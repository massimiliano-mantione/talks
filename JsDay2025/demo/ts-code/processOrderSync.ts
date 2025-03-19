import { getBookSync, getOrderSync, validateOrderSync, Order, SyncProcessor, PlacedOrderResult, placedOrderFailed } from './api'

const bookService = getBookSync

const orderService = getOrderSync

const validationService = validateOrderSync

const calculateAmountService = (order: Order) => {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    const book = bookService(item.bookKey)
    if (book != null) {
      total += item.quantity * book.price
    } else {
      throw new Error('Book not found: ' + item.bookKey)
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

const processor: SyncProcessor = (key: number): PlacedOrderResult => {
  const order = orderService(key)
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
