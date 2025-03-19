import {
  getBookCallback,
  getOrderCallback,
  validateOrderCallback,
  Book,
  Order,
  AsyncProcessor,
  OrderValidationResult,
  PlacedOrderResult,
} from './api'

function bookService (key: number, cb: (res: Book|null) => void) {
  getBookCallback(key, cb)
}

function orderService (key: number, cb: (res: Order) => void) {
  getOrderCallback(key, cb)
}

function validationService(order: Order, cb: (res: OrderValidationResult) => void) {
  validateOrderCallback(order, cb)
}

function calculateAmountService(order: Order, cb: (res: number) => void) {
  let total = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    bookService(item.bookKey, (book) => {
      if (book != null) {
        total += item.quantity * book.price
      } else {
        throw new Error('Book not found: ' + item.bookKey)
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
  key: number
): Promise<PlacedOrderResult> => {
  return new Promise((resolve) => {
    orderService(key, (order) => {
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
