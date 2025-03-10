import { pipe } from 'fp-ts-old/lib/pipeable.js'
import { Either, either, isRight, isLeft, chain, map } from 'fp-ts-old/lib/Either.js'
import { orders, books } from './data'
import {
  validateOrder,
  Order,
  SyncProcessor,
  Book,
  placedOrderFailed,
  placedOrderSuccess,
  PlacedOrderResult
} from './api'

function handleResult(ma: Either<Error, PlacedOrderResult>): PlacedOrderResult {
  return isRight(ma) ? ma.right : placedOrderFailed
}

const bookService = (bookId: string) =>
  books[bookId]
    ? either.of<Error, Book>(books[bookId])
    : either.throwError<Error, Book>(new Error(`Book not found: ${bookId}`))

const orderService = (orderId: string) =>
  orders[orderId]
    ? either.of<Error, Order>(orders[orderId])
    : either.throwError<Error, Order>(new Error(`Order not found: ${orderId}`))

const validationService = (order: Order) => {
  const r = validateOrder(order)
  if (r.valid) {
    return either.of<Error, Order>(order)
  } else {
    return either.throwError<Error, Order>(new Error(`${r.error}`))
  }
}

const calculateAmountService = (order: Order) =>
  order.items
    .map(item =>
      pipe(
        bookService(item.bookId),
        map((b: Book) => b.price * item.quantity)
      )
    )
    .reduce(
      (acc, curr) =>
        isLeft(acc) || isLeft(curr)
          ? either.throwError<Error, number>(
              new Error('Error computing order amount ')
            )
          : either.of<Error, number>(acc.right + curr.right),
      either.of<Error, number>(0.0)
    )

const placeOrderService = (order: Order) =>
  pipe(
    calculateAmountService(order),
    map(placedOrderSuccess)
  )

const processor: SyncProcessor = (orderId: string) =>
  handleResult(
    pipe(
      orderService(orderId),
      chain(validationService),
      chain(placeOrderService)
    )
  )

export default processor
