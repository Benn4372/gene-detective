import type { Mission } from '../types'

// Dr. Nyx's mission set — unlocks after Ch 41 (molecular chapters). Bright,
// visible traits acting as stand-ins for sequence-level puzzles.
export const nyxTier3Missions: Mission[] = [
  {
    id: 'mission-nyx-01',
    chapterTier: 'researcher',
    minCompletedChapters: 41,
    clientCharacterId: 'dr-nyx',
    clientBrief:
      "I need a live sparkle (K-carrier) from two non-sparkling parents — mutation frequency measurement.",
    targetPhenotype: { sparkle: 'K' },
    visibleGeneIds: ['sparkle'],
    labStarters: [
      {
        sex: 'F',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx F-01',
      },
      {
        sex: 'M',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx M-01',
      },
    ],
    breedBudget: 30, // rare event
    mode: 'breed',
    rewardPreviewText: 'contributes to the mutation-rate reference dataset',
  },
  {
    id: 'mission-nyx-02',
    chapterTier: 'researcher',
    minCompletedChapters: 48,
    clientCharacterId: 'dr-nyx',
    clientBrief:
      "CRISPR calibration. Bring me a heat-spot carrier (H-showing at warm temp) from two non-showing parents. Emulates a directed-edit outcome.",
    targetPhenotype: { heatSpot: 'H' },
    visibleGeneIds: ['heatSpot'],
    labStarters: [
      {
        sex: 'F',
        genotype: { heatSpot: ['H', 'h'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx F-02',
      },
      {
        sex: 'M',
        genotype: { heatSpot: ['H', 'h'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx M-02',
      },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'signs off the CRISPR calibration for the next round',
  },
]
