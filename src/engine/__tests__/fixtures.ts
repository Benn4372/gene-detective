import type { Creature, Species } from '../types'

// A test species with:
// - one autosome carrying two genes (antennae presence, body pattern)
// - X and Y sex chromosomes (no genes on them yet)
//
// Gene 1: antennae — simple dominant. A = antennae present, a = absent.
// Gene 2: pattern — codominant. P = polka-dot, S = stripes, PS = both.
export const testBlob: Species = {
  id: 'test-blob',
  name: 'Test Blob',
  sexSystem: 'XY',
  chromosomes: [
    { id: 'auto-1', type: 'autosome', lengthCM: 100 },
    { id: 'X', type: 'sex-X', lengthCM: 100 },
    { id: 'Y', type: 'sex-Y', lengthCM: 20 },
  ],
  genes: [
    {
      id: 'antennae',
      name: 'Antennae',
      chromosome: 'auto-1',
      locusCM: 10,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['antennae'],
      alleles: [
        { id: 'A', symbol: 'A', dominanceRank: 1 },
        { id: 'a', symbol: 'a', dominanceRank: 0 },
      ],
    },
    {
      id: 'pattern',
      name: 'Pattern',
      chromosome: 'auto-1',
      locusCM: 80,
      inheritanceModel: 'codominant',
      expressesTraits: ['pattern'],
      alleles: [
        { id: 'P', symbol: 'P', dominanceRank: 1 },
        { id: 'S', symbol: 'S', dominanceRank: 1 },
      ],
    },
  ],
  traits: [
    { id: 'antennae', name: 'Antennae', category: 'visible' },
    { id: 'pattern', name: 'Pattern', category: 'visible' },
  ],
}

export function makeCreature(overrides: Partial<Creature>): Creature {
  return {
    id: 'test',
    speciesId: 'test-blob',
    sex: 'F',
    genotype: {},
    age: 1,
    ...overrides,
  }
}
