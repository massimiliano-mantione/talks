import { nextTick } from 'node:process';
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
  nextTick(()=>cb(books[bookId] ? books[bookId] : null))
}

function orderService (orderId: string, cb: (res: Order|null) => void) {
  nextTick(()=>cb(orders[orderId] ? orders[orderId] : null))
}

function validationService(order: Order, cb: (res: OrderValidationResult) => void) {
  nextTick(()=>cb(validateOrder(order)))
}

function calculateAmountService(order: Order, cb: (res: number) => void) {
  let total = 0
  let target = order.items.length
  let requested = 0
  let resolved = 0
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]
    requested += 1
    bookService(item.bookId, (book) => {
      resolved += 1
      if (book != null) {
        total += item.quantity * book.price
      } else {
        throw new Error('Book not found: ' + item.bookId)
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
