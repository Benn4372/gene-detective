import { describe, expect, it } from 'vitest'
import { computePhenotype } from '../phenotype'
import { makeCreature, testBlob } from './fixtures'

describe('computePhenotype — simple dominance', () => {
  it('AA expresses dominant', () => {
    const c = makeCreature({ genotype: { antennae: ['A', 'A'] } })
    expect(computePhenotype(c, testBlob).antennae).toBe('A')
  })
  it('Aa expresses dominant', () => {
    const c = makeCreature({ genotype: { antennae: ['A', 'a'] } })
    expect(computePhenotype(c, testBlob).antennae).toBe('A')
  })
  it('aa expresses recessive', () => {
    const c = makeCreature({ genotype: { antennae: ['a', 'a'] } })
    expect(computePhenotype(c, testBlob).antennae).toBe('a')
  })
})

describe('computePhenotype — codominance', () => {
  it('PP expresses P', () => {
    const c = makeCreature({ genotype: { pattern: ['P', 'P'] } })
    expect(computePhenotype(c, testBlob).pattern).toBe('P')
  })
  it('SS expresses S', () => {
    const c = makeCreature({ genotype: { pattern: ['S', 'S'] } })
    expect(computePhenotype(c, testBlob).pattern).toBe('S')
  })
  it('PS heterozygote expresses both', () => {
    const c = makeCreature({ genotype: { pattern: ['P', 'S'] } })
    // Symbols sorted by dominance rank — both are 1 here so order is stable by insertion.
    expect(computePhenotype(c, testBlob).pattern).toMatch(/^(PS|SP)$/)
  })
})
