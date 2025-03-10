import { Effect, Stream } from 'effect';

export function add(a: number, b: number): number {
  return a + b;
}

const s = Stream.fromIterable([1, 2, 3, 4, 5]);
const mapped = s.map(n => n + 1);
