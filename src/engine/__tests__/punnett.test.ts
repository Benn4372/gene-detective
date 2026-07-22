import { describe, expect, it } from 'vitest'
import { computePunnett } from '../punnett'
import { makeCreature, testBlob } from './fixtures'

describe('computePunnett — monohybrid', () => {
  it('Aa × Aa → 1:2:1 AA:Aa:aa', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'a'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['A', 'a'] } })
    const rows = computePunnett(mom, dad, testBlob)
    const probs = Object.fromEntries(rows.map(r => [r.genotypeKey, r.probability]))
    // Three distinct genotypes: AA, Aa (same as aA), aa
    expect(rows).toHaveLength(3)
    const total = Object.values(probs).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1, 6)
    // Aa is twice as likely as AA or aa.
    const values = Object.values(probs).sort((a, b) => a - b)
    expect(values[0]).toBeCloseTo(0.25, 6)
    expect(values[1]).toBeCloseTo(0.25, 6)
    expect(values[2]).toBeCloseTo(0.5, 6)
  })

  it('AA × aa → 100% Aa', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rows = computePunnett(mom, dad, testBlob)
    expect(rows).toHaveLength(1)
    expect(rows[0]!.probability).toBeCloseTo(1, 6)
  })

  it('Aa × aa test cross → 1:1 Aa:aa', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'a'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rows = computePunnett(mom, dad, testBlob)
    expect(rows).toHaveLength(2)
    expect(rows[0]!.probability).toBeCloseTo(0.5, 6)
    expect(rows[1]!.probability).toBeCloseTo(0.5, 6)
  })
})

describe('computePunnett — dihybrid', () => {
  it('AaPp × AaPp → 9 outcome classes with expected total probability', () => {
    const mom = makeCreature({
      sex: 'F',
      genotype: { antennae: ['A', 'a'], pattern: ['P', 'S'] },
    })
    const dad = makeCreature({
      id: 'd',
      sex: 'M',
      genotype: { antennae: ['A', 'a'], pattern: ['P', 'S'] },
    })
    const rows = computePunnett(mom, dad, testBlob)
    const total = rows.reduce((s, r) => s + r.probability, 0)
    expect(total).toBeCloseTo(1, 6)
    // 3 genotypes × 3 genotypes = 9 distinct joint genotypes.
    expect(rows.length).toBe(9)
  })
})
