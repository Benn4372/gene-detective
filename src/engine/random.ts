// Seedable RNG so tests are deterministic and breeding can be replayed.
// mulberry32: fast, well-distributed, tiny.

export interface Random {
  next(): number
  int(maxExclusive: number): number
  pick<T>(items: readonly T[]): T
  bool(): boolean
}

export function makeRandom(seed?: number): Random {
  let state = (seed ?? Math.floor(Math.random() * 2 ** 32)) >>> 0
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (maxExclusive: number) => Math.floor(next() * maxExclusive),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)]!,
    bool: () => next() < 0.5,
  }
}
