import { orders, books } from './data'
import { validateOrder, Order, SyncProcessor, PlacedOrderResult, placedOrderFailed } from './api'

const bookService = (bookId: string) => (books[bookId] ? books[bookId] : null)

const orderService = (orderId: string) =>
  orders[orderId] ? orders[orderId] : null

const validationService = (order: Order) => {
  return validateOrder(order)
}

const calculateAmountService = (order: Order) => {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    const book = bookService(item.bookId)
    if (book != null) {
      total += item.quantity * book.price
    } else {
      throw new Error('Book not found: ' + item.bookId)
    }
  }
  return total
}

const placeOrderService = (order: Order) => {
  let totalAmount = calculateAmountService(order)
  return {
    success: true,
    totalAmount
  }
}

const processor: SyncProcessor = (orderId: string): PlacedOrderResult => {
  const order = orderService(orderId)
  if (order == null) {
    return {
      success: false
    }
  }

  const validationResult = validationService(order)
  if (!validationResult.valid) {
    return placedOrderFailed
  }

  return placeOrderService(order)
}

export default processor
