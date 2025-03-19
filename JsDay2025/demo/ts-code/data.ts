import { Book, Order, OrderLine, OrderValidationResult, validationError } from './api'

type StoredBook = { name: string; author: string; price: number }
type StoredOrder = { date: Date; items: OrderLine[] }

const books: StoredBook[] = [
  {
    name: 'Positioning: The Battle for Your Mind',
    author: 'Al Reis',
    price: 12.98
  },
  {
    name: 'Start With Why: How Great Leaders Inspire Everyone to Take Action',
    author: 'Simon Sinek',
    price: 11.51
  },
  {
    name:
      'Pitch Anything: An Innovative Method for Presenting, Persuading, and Winning the Deal',
    author: 'Oren Klaff',
    price: 19.23
  }
]

export function getBookSync(key: number): Book|null {
  let k = key - 1;
  if (books[k]) {
    return { key, ...books[k]}
  } else {
    return null
  }
}

export async function getBookAsync(key: number): Promise<Book|null> {
  let k = key - 1;
  if (books[k]) {
    return { key, ...books[k]}
  } else {
    return null
  }
}

export function getBookCallback(key: number, cb: (book: Book|null) => void) {
  let k = key - 1;
  if (books[k]) {
    cb({ key, ...books[k]})
  } else {
    cb(null)
  }
}

const validOrders: StoredOrder[] = [
  {
    date: new Date(),
    items: [{ bookKey: 1, quantity: 10 }, { bookKey: 3, quantity: 27 }]
  },
  {
    date: new Date(),
    items: [{ bookKey: 2, quantity: 7 }, { bookKey: 3, quantity: 5 }]
  },
  {
    date: new Date(),
    items: [
      { bookKey: 3, quantity: 11 },
      { bookKey: 1, quantity: 23 },
      { bookKey: 2, quantity: 2 }
    ]
  }
]

const invalidOrders: StoredOrder[] = [
  { date: new Date(), items: [] },
  {
    date: new Date(),
    items: [{ bookKey: 4, quantity: 3 }]
  }
]

function orderWithKey(key: number, data: StoredOrder): Order {
  return {key, ...data}
}

export function validateOrderSync(order: Order): OrderValidationResult {
  if (order.items.length === 0) {
    return validationError('NoItems')
  }
  for (let i = 0; i < order.items.length; i++) {
    if (getBookSync(order.items[i].bookKey) == null) {
      return validationError('BookNotExists')
    }
  }
  return { valid: true, order }
}

export async function validateOrderAsync(order: Order): Promise<OrderValidationResult> {
  if (order.items.length === 0) {
    return validationError('NoItems')
  }
  for (let i = 0; i < order.items.length; i++) {
    if (await getBookAsync(order.items[i].bookKey) == null) {
      return validationError('BookNotExists')
    }
  }
  return { valid: true, order }
}

export async function validateOrderCallback(order: Order, cb: (OrderValidationResult) => void) {
  if (order.items.length === 0) {
    cb(validationError('NoItems'))
    return
  }
  for (let i = 0; i < order.items.length; i++) {
    if (getBookSync(order.items[i].bookKey) == null) {
      cb(validationError('BookNotExists'))
      return
    }
  }
  cb({ valid: true, order })
  return
}

export function checkOrdersData(): boolean {
  for (let i = 0; i < validOrders.length; i++) {
    const order = orderWithKey(i, validOrders[i])
    const r = validateOrderSync(order)
    if (r.valid == false) {
      return false
    }
  }

  for (let i = 0; i < invalidOrders.length; i++) {
    const order = orderWithKey(i, invalidOrders[i])
    const r = validateOrderSync(order)
    if (r.valid == true) {
      return false
    }
  }

  return true
}

export function validKey(baseKey: number): number {
  return baseKey * 2
}

export function invalidKey(baseKey: number): number {
  return (baseKey * 2) + 1
}

function getOrder(key: number): Order {
  let index = (key / 2) | 0;
  if (key % 2 == 0) {
    return orderWithKey(key, validOrders[index % validOrders.length])
  } else {
    return orderWithKey(key, invalidOrders[index % invalidOrders.length])
  }
}

export function getOrderSync(key: number): Order {
  return getOrder(key)
}

export async function getOrderAsync(key: number): Promise<Order> {
  return getOrder(key)
}

export async function getOrderCallback(key: number, cb: (order: Order) => void) {
  cb(getOrder(key))
}
