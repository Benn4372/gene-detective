import { describe, expect, it } from 'vitest'
import { cross } from '../cross'
import { makeRandom } from '../random'
import { computePhenotype } from '../phenotype'
import { makeCreature, testBlob } from './fixtures'

describe('cross — mechanics', () => {
  it('produces requested litter size', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rng = makeRandom(1)
    const litter = cross(mom, dad, testBlob, rng, { litterSize: 6 })
    expect(litter).toHaveLength(6)
  })

  it('AA × aa → all Aa offspring', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rng = makeRandom(2)
    const litter = cross(mom, dad, testBlob, rng, { litterSize: 20 })
    for (const child of litter) {
      const alleles = [...child.genotype.antennae!].sort()
      expect(alleles).toEqual(['A', 'a'])
    }
  })

  it('rejects same-sex pairs', () => {
    const a = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const b = makeCreature({ id: 'b', sex: 'F', genotype: { antennae: ['a', 'a'] } })
    const rng = makeRandom(3)
    expect(() => cross(a, b, testBlob, rng, { litterSize: 1 })).toThrow(/same sex/)
  })

  it('accepts parents in either order', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rng = makeRandom(4)
    const litterA = cross(mom, dad, testBlob, rng, { litterSize: 3 })
    const litterB = cross(dad, mom, testBlob, makeRandom(4), { litterSize: 3 })
    expect(litterA).toHaveLength(3)
    expect(litterB).toHaveLength(3)
  })
})

describe('cross — statistical properties', () => {
  it('Aa × Aa over large litter yields ~3:1 dominant:recessive phenotype', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'a'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['A', 'a'] } })
    const rng = makeRandom(42)
    const N = 4000
    const litter = cross(mom, dad, testBlob, rng, { litterSize: N })

    let dominant = 0
    for (const child of litter) {
      const phen = computePhenotype(
        {
          id: child.id,
          speciesId: testBlob.id,
          sex: child.sex,
          genotype: child.genotype,
          age: 0,
        },
        testBlob,
      )
      if (phen.antennae === 'A') dominant++
    }
    const ratio = dominant / N
    // Expect 0.75 dominant. With N=4000, allow ±0.03.
    expect(ratio).toBeGreaterThan(0.72)
    expect(ratio).toBeLessThan(0.78)
  })

  it('sex distribution in XY system is ~50/50', () => {
    const mom = makeCreature({ sex: 'F', genotype: { antennae: ['A', 'A'] } })
    const dad = makeCreature({ id: 'd', sex: 'M', genotype: { antennae: ['a', 'a'] } })
    const rng = makeRandom(7)
    const N = 4000
    const litter = cross(mom, dad, testBlob, rng, { litterSize: N })
    const males = litter.filter(c => c.sex === 'M').length
    const ratio = males / N
    expect(ratio).toBeGreaterThan(0.47)
    expect(ratio).toBeLessThan(0.53)
  })
})
