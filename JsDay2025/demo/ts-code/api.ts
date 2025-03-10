import { books } from './data'
import { Effect } from 'effect'

export type Book = { name: string; author: string; price: number }
export type Order = { date: Date; items: OrderLine[] }
export type OrderLine = { bookId: string; quantity: number }

export type PlacedOrderSuccess = { success: true; totalAmount: number }
export type PlacedOrderFailure = { success: false }
export type PlacedOrderResult = PlacedOrderSuccess | PlacedOrderFailure

export const placedOrderSuccess: (totalAmount: number) => PlacedOrderSuccess = (
  totalAmount: number
) => ({
  success: true,
  totalAmount
})
export const placedOrderFailed: PlacedOrderFailure = { success: false }

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
