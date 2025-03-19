import { Effect, Stream, pipe, Console } from 'effect'
import {
  getBookSync,
  getOrderSync,
  validateOrderSync,
  Order,
  SyncProcessor,
  Book,
  placedOrderFailed,
  placedOrderSuccess,
  PlacedOrderSuccess
} from './api'

function bookService(key: number): Effect<Order,string> {
  const r = getBookSync(key)
  return r ? Effect.succeed(r) : Effect.fail("book not found")
}

function orderService(key: number): Effect<Order,string> {
  const r = getOrderSync(key)
  return r ? Effect.succeed(r) : Effect.fail("order not found")
}


function validationService(order: Order): Effect<Order,string> {
  const r = validateOrderSync(order)
  return r.valid ? Effect.succeed(order) : Effect.fail(r.error)
}

const calculateAmountService = (order: Order) =>
  Effect.gen(function* (_) {
    let total = 0;
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      const book = yield* bookService(item.bookKey);
      if (book != null) {
        total += item.quantity * book.price;
      } else {
        return yield* Effect.fail("Book not found: " + item.bookKey);
      }
    }
    return total;
  });

/*
function calculateAmountServiceStreamed(order: Order): Effect<number,string> {
  return Stream.fromIterable(order.items).pipe(
    Stream.mapEffect(item => {
      return bookService(item.bookId).pipe(
        Effect.andThen(book => book),
        Effect.andThen(b => { return b.price * item.quantity }))
    }),
    Stream.runFold(0, (a, b) => a + b)
  )
}
*/

const placeOrderService = (order: Order) =>
  calculateAmountService(order).pipe(Effect.andThen(placedOrderSuccess))

const processor: SyncProcessor = (key: number) => {
  return Effect.runSync(
    pipe(
      key,
      orderService,
      Effect.andThen(validationService),
      Effect.andThen(placeOrderService),
      Effect.catchAll(e => Effect.succeed(placedOrderFailed))
    )
  )
}


export default processor
