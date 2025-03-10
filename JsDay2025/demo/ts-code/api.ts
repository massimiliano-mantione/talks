import { books } from './data'

export type Book = { name: string; author: string; price: number }
export type Order = { date: Date; items: OrderLine[] }
export type OrderLine = { bookId: string; quantity: number }

export type PlacedOrderResult =
  | {
      success: true
      totalAmount: number
    }
  | {
      success: false
    }

export const placedOrderSuccess: (totalAmount: number) => PlacedOrderResult = (
  totalAmount: number
) => ({
  success: true,
  totalAmount
})
export const placedOrderFailed: PlacedOrderResult = { success: false }

export type SyncProcessor = (orderId: string) => PlacedOrderResult
export type AsyncProcessor = (orderId: string) => Promise<PlacedOrderResult>

export type OrderNotValid = 'NoItems' | 'BookNotExists'
export type OrderValidationResult =
  | { valid: true }
  | { valid: false; error: OrderNotValid }

export function validateOrder(order: Order): OrderValidationResult {
  const invalid = (error: OrderNotValid) => ({ valid: false, error })
  if (order.items.length === 0) {
    return invalid('NoItems')
  }
  for (let i = 0; i < order.items.length; i++) {
    if (!books[order.items[i].bookId]) {
      return invalid('BookNotExists')
    }
  }
  return { valid: true }
}
