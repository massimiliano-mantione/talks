import { orders, books } from './data'
import {
  validateOrder,
  Book,
  Order,
  AsyncProcessor,
  OrderValidationResult,
  PlacedOrderResult,
} from './api'

function bookService (bookId: string, cb: (res: Book|null) => void) {
  cb(books[bookId] ? books[bookId] : null)
}

function orderService (orderId: string, cb: (res: Order|null) => void) {
  cb(orders[orderId] ? orders[orderId] : null)
}

function validationService(order: Order, cb: (res: OrderValidationResult) => void) {
  cb(validateOrder(order))
}

function calculateAmountService(order: Order, cb: (res: number) => void) {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    bookService(item.bookId, (book) => {
      if (book != null) {
        total += item.quantity * book.price
      } else {
        throw new Error('Book not found: ' + item.bookId)
      }
    })
  }
  cb(total)
}

function placeOrderService(order: Order, cb: (res: PlacedOrderResult) => void) {
  calculateAmountService(order, (res) => {
    cb ({
      success: true,
      totalAmount: res
    })
  })
}

const processor: AsyncProcessor = async (
  orderId: string
): Promise<PlacedOrderResult> => {
  return new Promise((resolve) => {
    orderService(orderId, (order) => {
      if (order != null) {
        validationService(order, (validated) => {
          if (validated.valid) {
            placeOrderService(order, resolve)
          } else {resolve({success: false})}
        })
      } else {resolve({success: false})}
    })
  })
}

export default processor
