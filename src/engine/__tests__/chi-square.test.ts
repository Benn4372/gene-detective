import { describe, expect, it } from 'vitest'
import { chiSquarePValue } from '../validators'

// The chi-square p-value calculator is used by the 'strict' validation tier.
// These tests pin down its behavior against well-known reference values so
// future edits (e.g. numerical tweaks) don't silently drift.
describe('chiSquarePValue', () => {
  it('returns ~0.05 for the classic 5% critical value at df=1 (χ² ≈ 3.841)', () => {
    const p = chiSquarePValue(3.841, 1)
    expect(p).toBeGreaterThan(0.04)
    expect(p).toBeLessThan(0.06)
  })

  it('returns ~0.05 for df=3 at χ² ≈ 7.815', () => {
    const p = chiSquarePValue(7.815, 3)
    expect(p).toBeGreaterThan(0.04)
    expect(p).toBeLessThan(0.06)
  })

  it('returns a large p-value for a perfectly-matching observation', () => {
    // χ² = 0 → p should be 1 (or extremely close to it).
    const p = chiSquarePValue(0, 3)
    expect(p).toBeGreaterThan(0.99)
  })

  it('returns a very small p-value for a wildly-mismatched observation', () => {
    // χ² = 50 at df=3 is far into the rejection zone.
    const p = chiSquarePValue(50, 3)
    expect(p).toBeLessThan(0.001)
  })

  it('handles df = 2 correctly (e.g. χ² = 5.991 → ~0.05)', () => {
    const p = chiSquarePValue(5.991, 2)
    expect(p).toBeGreaterThan(0.04)
    expect(p).toBeLessThan(0.06)
  })

  it('is monotonically non-increasing as χ² grows (df=2)', () => {
    const ps = [1, 2, 3, 5, 10, 20].map(x => chiSquarePValue(x, 2))
    for (let i = 1; i < ps.length; i++) {
      expect(ps[i]).toBeLessThanOrEqual(ps[i - 1]!)
    }
  })
})
