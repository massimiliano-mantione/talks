import {
  getBookSync,
  getOrderSync,
  validateOrderSync,
  Book,
  Order,
  AsyncProcessor,
  PlacedOrderResult,
  placedOrderFailed,
  placedOrderSuccess
} from './api'

function bookService(key: number): Promise<Book> {
  const r = getBookSync(key);
  return r
    ? Promise.resolve(r)
    : Promise.reject(new Error(`Book not found: ${key}`))

}

function orderService(key: number): Promise<Order> {
  const r = getOrderSync(key);
  return r
    ? Promise.resolve(r)
    : Promise.reject(new Error(`Order not found: ${key}`))
}

function validationService(order: Order): Promise<Order> {
  const r = validateOrderSync(order)
  if (r.valid) {
    return Promise.resolve(order)
  } else {
    return Promise.reject(new Error(`${r.error}`))
  }
}

const calculateAmountService = async (order: Order) => {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    const book = await bookService(item.bookKey)
    total += item.quantity * book.price
  }
  return total
}

const placeOrderService = (order: Order) =>
  calculateAmountService(order).then(placedOrderSuccess)

const processor: AsyncProcessor = (
  key:number
): Promise<PlacedOrderResult> => {
  return orderService(key)
    .then(validationService)
    .then(placeOrderService)
    .catch(() => placedOrderFailed)
}

export default processor
