import { Effect, Stream, pipe, Console } from 'effect'
import { orders, books } from './data'
import {
  validateOrder,
  Order,
  SyncProcessor,
  Book,
  placedOrderFailed,
  placedOrderSuccess,
  PlacedOrderSuccess
} from './api'

function bookService(bookId: string): Effect<Order,string> {
  return Effect.sync(() => books[bookId] ? Effect.succeed(books[bookId]) : Effect.fail("book not found"))
}

function orderService(orderId: string): Effect<Order,string> {
  return Effect.sync(() => orders[orderId] ? Effect.succeed(orders[orderId]) : Effect.fail("order not found"))
}

function validationService(order: Order): Effect<Order,string> {
  const r = validateOrder(order)
  return r.valid ? Effect.succeed(order) : Effect.fail(r.error)
}

function calculateAmountService(order: Order): Effect<number,string> {
  return Stream.fromIterable(order.items).pipe(
    Stream.mapEffect(item => {
      return bookService(item.bookId).pipe(
        Effect.andThen(book => book),
        Effect.andThen(b => { return b.price * item.quantity }))
    }),
    Stream.runFold(0, (a, b) => a + b)
  )
}

function placeOrderService(order: Order): Effect<PlacedOrderSuccess,string> {
  return calculateAmountService(order).pipe(Effect.andThen(placedOrderSuccess))
}

const processor: SyncProcessor = (orderId: string) => {
  return Effect.runSync(
    orderService(orderId).pipe(
      Effect.andThen(order => order),
      Effect.andThen(validationService),
      Effect.andThen(placeOrderService),
      Effect.catchAll(e => Effect.succeed(placedOrderFailed))
    )
  )
}


export default processor
