import type { Mission } from '../types'

// Prof. Delta's mission set — unlocks after Ch 27 (population-scale chapters).
// All 'breed' mode targeting specific frequencies expressed as phenotypes.
export const deltaTier2Missions: Mission[] = [
  {
    id: 'mission-delta-01',
    chapterTier: 'student',
    minCompletedChapters: 27,
    clientCharacterId: 'prof-delta',
    clientBrief:
      "Small colony. I need a pure-red founder — RR homozygote — to seed a new drift experiment.",
    targetPhenotype: { tail: 'T' },
    visibleGeneIds: ['color'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Delta F-01',
      },
      {
        sex: 'M',
        genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Delta M-01',
      },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'seeds a founder-effect experiment; adds a note to the population registry',
  },
  {
    id: 'mission-delta-02',
    chapterTier: 'student',
    minCompletedChapters: 30,
    clientCharacterId: 'prof-delta',
    clientBrief:
      "Selection sweep. Bring me a double-recessive (yellow, no antennae) — a rare tail-end phenotype.",
    targetPhenotype: { tail: 't', antennae: 'a' },
    visibleGeneIds: ['color', 'antennae'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 't'], antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Delta F-02',
      },
      {
        sex: 'M',
        genotype: { tail: ['T', 't'], antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Delta M-02',
      },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'confirms the multi-gene tail-frequency prediction',
  },
]
