import { Book, Order, validateOrder } from './api'
import { BenchmarkIds } from './configuration'

export const books: { [id: string]: Book } = {
  1: {
    name: 'Positioning: The Battle for Your Mind',
    author: 'Al Reis',
    price: 12.98
  },
  2: {
    name: 'Start With Why: How Great Leaders Inspire Everyone to Take Action',
    author: 'Simon Sinek',
    price: 11.51
  },
  3: {
    name:
      'Pitch Anything: An Innovative Method for Presenting, Persuading, and Winning the Deal',
    author: 'Oren Klaff',
    price: 19.23
  }
}

export const orders: { [id: string]: Order } = {
  1: { date: new Date(), items: [] },
  2: {
    date: new Date(),
    items: [{ bookId: '1', quantity: 10 }, { bookId: '3', quantity: 27 }]
  },
  3: {
    date: new Date(),
    items: [{ bookId: '2', quantity: 7 }, { bookId: '3', quantity: 5 }]
  },
  4: {
    date: new Date(),
    items: [
      { bookId: '3', quantity: 11 },
      { bookId: '1', quantity: 23 },
      { bookId: '2', quantity: 2 }
    ]
  },
  5: {
    date: new Date(),
    items: [{ bookId: '4', quantity: 3 }]
  }
}

function categorizeIds(): BenchmarkIds {
  const ok: string[] = []
  const ko: string[] = []

  for (let id of Object.keys(orders)) {
    const r = validateOrder(orders[id])
    if (r.valid) {
      ok.push(id)
    } else {
      ko.push(id)
    }
  }
  return { ok, ko }
}

export const categorizedOrderIds: BenchmarkIds = categorizeIds()
