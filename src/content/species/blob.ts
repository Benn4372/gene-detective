import type { Species } from '../../engine/types'

// The one and only species for now.
// Traits start binary and simple; more genes get added as later lessons unlock.
export const blobSpecies: Species = {
  id: 'blob',
  name: 'Blob',
  sexSystem: 'XY',
  chromosomes: [
    { id: 'auto-1', type: 'autosome', lengthCM: 100 },
    { id: 'auto-2', type: 'autosome', lengthCM: 100 },
    { id: 'X', type: 'sex-X', lengthCM: 100 },
    { id: 'Y', type: 'sex-Y', lengthCM: 20 },
  ],
  genes: [
    {
      id: 'antennae',
      name: 'Antennae',
      chromosome: 'auto-1',
      locusCM: 50,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['antennae'],
      alleles: [
        { id: 'A', symbol: 'A', dominanceRank: 1 },
        { id: 'a', symbol: 'a', dominanceRank: 0 },
      ],
    },
    {
      id: 'spots',
      name: 'Spots',
      chromosome: 'auto-2',
      locusCM: 30,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['spots'],
      alleles: [
        { id: 'S', symbol: 'S', dominanceRank: 1 },
        { id: 's', symbol: 's', dominanceRank: 0 },
      ],
    },
  ],
  traits: [
    {
      id: 'antennae',
      name: 'Antennae',
      category: 'visible',
      description: 'Two little antennae on top of the head.',
    },
    {
      id: 'spots',
      name: 'Spots',
      category: 'visible',
      description: 'A polka-dot pattern on the body.',
    },
  ],
}
