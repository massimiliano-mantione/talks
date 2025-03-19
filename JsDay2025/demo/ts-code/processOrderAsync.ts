import {
  getBookAsync,
  getOrderAsync,
  validateOrderAsync,
  Book,
  Order,
  AsyncProcessor,
  OrderValidationResult,
  PlacedOrderResult,
  placedOrderFailed,
} from './api'

async function bookService (key: number): Promise<Book|null> {
  return await getBookAsync(key)
}

async function orderService (key: number): Promise<Order|null> {
  return await getOrderAsync(key)
}

async function validationService(order: Order): Promise<OrderValidationResult> {
  return await validateOrderAsync(order)
}

async function calculateAmountService(order: Order): Promise<number> {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    const book = await bookService(item.bookKey)
    if (book != null) {
      total += item.quantity * book.price
    } else {
      throw new Error('Book not found: ' + item.bookKey)
    }
  }
  return total
}

async function placeOrderService(order: Order): Promise<PlacedOrderResult> {
  return {
    success: true,
    totalAmount: await calculateAmountService(order)
  }
}

const processor: AsyncProcessor = async (
  orderKey: number
): Promise<PlacedOrderResult> => {
  const order = await orderService(orderKey)
  if (order == null) {
    return {
      success: false
    }
  }

  const validationResult = await validationService(order)
  if (!validationResult.valid) {
    return placedOrderFailed
  }

  return await placeOrderService(order)
}

export default processor
