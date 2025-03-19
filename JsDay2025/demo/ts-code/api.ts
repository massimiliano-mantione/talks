import {
  getBookSync,
  getBookAsync,
  getBookCallback,
  getOrderSync,
  getOrderAsync,
  getOrderCallback,
  validateOrderSync,
  validateOrderAsync,
  validateOrderCallback
} from './data'

export {
  getBookSync,
  getBookAsync,
  getBookCallback,
  getOrderSync,
  getOrderAsync,
  getOrderCallback,
  validateOrderSync,
  validateOrderAsync,
  validateOrderCallback
}

export type Book = { key: number; name: string; author: string; price: number }
export type Order = { key: number; date: Date; items: OrderLine[] }
export type OrderLine = { bookKey: number; quantity: number }

export type PlacedOrderSuccess = { success: true; totalAmount: number }
export type PlacedOrderFailure = { success: false }
export type PlacedOrderResult = PlacedOrderSuccess | PlacedOrderFailure

export const placedOrderSuccess: (totalAmount: number) => PlacedOrderSuccess = (
  totalAmount: number
) => ({
  success: true,
  totalAmount
})

export const placedOrderSuccessAsync: (totalAmount: number) => Promise<PlacedOrderSuccess> = (
  totalAmount: number
) => (
  Promise.resolve({
  success: true,
  totalAmount
}))

export const placedOrderFailed: PlacedOrderFailure = { success: false }

export type SyncProcessor = (orderKey: number) => PlacedOrderResult
export type AsyncProcessor = (orderKey: number) => Promise<PlacedOrderResult>

export type OrderValidationProblem = 'NoItems' | 'BookNotExists'
export type OrderValidationSuccess = { valid: true; order: Order }
export type OrderValidationError = { valid: false; error: OrderValidationProblem }
export type OrderValidationResult =
  | OrderValidationSuccess
  | OrderValidationError

  export function validationError(problem: OrderValidationProblem): OrderValidationError {
    return {valid: false, error: problem}
  }
