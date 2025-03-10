import { pipe } from 'fp-ts-new/lib/pipeable.js'
import { array } from 'fp-ts-new/lib/Array.js'
import {
  Either,
  isLeft,
  isRight,
  Left,
  Right,
  right,
  left
} from 'fp-ts-new/lib/Either.js'
import { taskEither, TaskEither, chain, map } from 'fp-ts-new/lib/TaskEither.js'
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

type NotValid = Left<Error>
type Valid<A> = Right<A>
type Validated<A> = Either<Error, A>
const valid: <A>(a: A) => Valid<A> = <A>(a: A) => <Valid<A>>right(a)
const notvalid: (e: string) => NotValid = (e: string) =>
  <NotValid>left(Error(e))

type TaskValidated<A> = TaskEither<Error, A>
const mapTask = <A, B>(f: (a: Valid<A>) => TaskValidated<B>) => (
  a: Validated<A>
) => (isRight(a) ? f(a) : taskEither.throwError<Error, B>(a.left))

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

const validationService: (o: Order) => Validated<Order> = (order: Order) => {
  const r = validateOrder(order)
  if (r.valid) {
    return valid<Order>(order)
  } else {
    return notvalid(`${r.error}`)
  }
}

const calculateAmountService = (order: Valid<Order>) =>
  pipe(
    order.right.items.map(item =>
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

const placeOrderService = (order: Valid<Order>) =>
  pipe(
    calculateAmountService(order),
    map(placedOrderSuccess)
  )

const processor: AsyncProcessor = (orderId: string) => {
  return pipe(
    orderId,
    orderService,
    map(validationService),
    chain(mapTask(placeOrderService))
  )()
    .then(evaluateEither)
    .catch(() => placedOrderFailed)
}

export default processor
