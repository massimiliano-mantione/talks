import { orders, books } from './data'
import {
  validateOrder,
  Book,
  Order,
  AsyncProcessor,
  OrderValidationResult,
  PlacedOrderResult,
  placedOrderFailed,
} from './api'

async function bookService (bookId: string): Promise<Book|null> {
  return books[bookId] ? books[bookId] : null
}

async function orderService (orderId: string): Promise<Order|null> {
  return orders[orderId] ? orders[orderId] : null
}

async function validationService(order: Order): Promise<OrderValidationResult> {
  return validateOrder(order)
}

async function calculateAmountService(order: Order): Promise<number> {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    const book = await bookService(item.bookId)
    if (book != null) {
      total += item.quantity * book.price
    } else {
      throw new Error('Book not found: ' + item.bookId)
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
  orderId: string
): Promise<PlacedOrderResult> => {
  const order = await orderService(orderId)
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
