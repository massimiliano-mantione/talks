import { nextTick } from 'node:process';
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
  nextTick(()=>getBookCallback(key, cb))
}

function orderService (key: number, cb: (res: Order|null) => void) {
  nextTick(()=>getOrderCallback(key, cb))
}

function validationService(order: Order, cb: (res: OrderValidationResult) => void) {
  nextTick(()=>validateOrderCallback(order, cb))
}

function calculateAmountService(order: Order, cb: (res: number) => void) {
  let total = 0
  let target = order.items.length
  let requested = 0
  let resolved = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    requested += 1
    bookService(item.bookKey, (book) => {
      resolved += 1
      if (book != null) {
        total += item.quantity * book.price
      } else {
        throw new Error('Book not found: ' + item.bookKey)
      }
      if (requested === target && resolved == requested) {
        nextTick(()=>cb(total))
      }
    })
  }
}

function placeOrderService(order: Order, cb: (res: PlacedOrderResult) => void) {
  calculateAmountService(order, (res) => {
    nextTick(()=>cb ({
      success: true,
      totalAmount: res
    }))
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
