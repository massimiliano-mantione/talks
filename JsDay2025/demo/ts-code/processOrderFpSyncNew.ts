import { pipe } from 'fp-ts-new/lib/pipeable.js'
import { Either, either, isRight, isLeft, chain, map } from 'fp-ts-new/lib/Either.js'
import {
  getBookSync,
  getOrderSync,
  validateOrderSync,
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

const bookService = (key: number) => {
  const r = getBookSync(key)
  return r
    ? either.of<Error, Book>(r)
    : either.throwError<Error, Book>(new Error(`Book not found: ${key}`))

}

const orderService = (key: number) => {
  const r = getOrderSync(key)
  return r
    ? either.of<Error, Order>(r)
    : either.throwError<Error, Order>(new Error(`Order not found: ${key}`))
}

const validationService = (order: Order) => {
  const r = validateOrderSync(order)
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
        bookService(item.bookKey),
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

const processor: SyncProcessor = (key: number) =>
  handleResult(
    pipe(
      orderService(key),
      chain(validationService),
      chain(placeOrderService)
    )
  )

export default processor
