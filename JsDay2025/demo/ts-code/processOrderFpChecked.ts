import { pipe } from 'fp-ts-old/lib/pipeable.js'
import { array } from 'fp-ts-old/lib/Array.js'
import { Either, isLeft } from 'fp-ts-old/lib/Either.js'
import { taskEither, chain, map } from 'fp-ts-old/lib/TaskEither.js'
import {
  getBookSync,
  getOrderSync,
  validateOrderSync,
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

const bookService = (key: number) =>
  getBookSync(key)
    ? taskEither.of<Error, Book>(getBookSync(key))
    : taskEither.throwError<Error, Book>(new Error(`Book not found: ${key}`))


const orderService = (key: number) =>
  getOrderSync(key)
    ? taskEither.of<Error, Order>(getOrderSync(key))
    : taskEither.throwError<Error, Order>(
        new Error(`Order not found: ${key}`)
      )


type ValidatedOrder = { validated: true } & Order
function validated(order: Order): ValidatedOrder {
  return { validated: true, ...order }
}

const validationService = (order: Order) => {
  const r = validateOrderSync(order)
  if (r.valid) {
    return taskEither.of<Error, ValidatedOrder>(validated(order))
  } else {
    return taskEither.throwError<Error, ValidatedOrder>(new Error(`${r.error}`))
  }
}

const calculateAmountService = (order: ValidatedOrder) => {
  return pipe(
    order.items.map(item =>
      pipe(
        bookService(item.bookKey),
        map(b => b.price * item.quantity)
      )
    ),
    array.sequence(taskEither),
    map(amounts => {
      return amounts.reduce((a, b) => a + b, 0)
    })
  )
}

const placeOrderService = (order: ValidatedOrder) =>
  pipe(
    calculateAmountService(order),
    map(placedOrderSuccess)
  )

const processor: AsyncProcessor = (key: number) =>
  pipe(
    orderService(key),
    chain(validationService),
    chain(placeOrderService)
  )()
    .then(evaluateEither)
    .catch(() => placedOrderFailed)

export default processor
