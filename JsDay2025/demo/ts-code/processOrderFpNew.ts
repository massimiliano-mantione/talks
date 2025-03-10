import { pipe } from 'fp-ts-new/lib/pipeable.js'
import { array } from 'fp-ts-new/lib/Array.js'
import { Either, isLeft } from 'fp-ts-new/lib/Either.js'
import { taskEither, chain, map } from 'fp-ts-new/lib/TaskEither.js'
import { orders, books } from './data'
import {
  validateOrder,
  Order,
  AsyncProcessor,
  Book,
  placedOrderFailed,
  placedOrderSuccess
} from './api'

const evaluateEither = <T>(ma: Either<Error, T>) => {
  if (isLeft(ma)) {
    throw ma.left
  }
  return ma.right
}

const bookService = (bookId: string) =>
  books[bookId]
    ? taskEither.of<Error, Book>(books[bookId])
    : taskEither.throwError<Error, Book>(new Error(`Book not found: ${bookId}`))

const orderService = (orderId: string) =>
  orders[orderId]
    ? taskEither.of<Error, Order>(orders[orderId])
    : taskEither.throwError<Error, Order>(
        new Error(`Order not found: ${orderId}`)
      )

const validationService = (order: Order) => {
  const r = validateOrder(order)
  if (r.valid) {
    return taskEither.of<Error, Order>(order)
  } else {
    return taskEither.throwError<Error, Order>(new Error(`${r.error}`))
  }
}

const calculateAmountService = (order: Order) => {
  return pipe(
    order.items.map(item =>
      pipe(
        bookService(item.bookId),
        map(b => b.price * item.quantity)
      )
    ),
    array.sequence(taskEither),
    map(amounts => {
      return amounts.reduce((a, b) => a + b, 0)
    })
  )
}

const placeOrderService = (order: Order) =>
  pipe(
    calculateAmountService(order),
    map(placedOrderSuccess)
  )

const processor: AsyncProcessor = (orderId: string) =>
  pipe(
    orderService(orderId),
    chain(validationService),
    chain(placeOrderService)
  )()
    .then(evaluateEither)
    .catch(() => placedOrderFailed)

export default processor
