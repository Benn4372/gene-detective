import type { Mission } from '../types'

// Dr. Nyx's mission set — unlocks after Ch 41 (molecular chapters). Bright,
// visible traits acting as stand-ins for sequence-level puzzles. Multi-
// starter benches so the player picks which pair to breed.
export const nyxTier3Missions: Mission[] = [
  // Mutation rate calibration: 4 plain (kk) samples. Any pair works; the
  // choice is really about how quickly a spontaneous mutation appears.
  // Multiple candidates simulate "which lineage was the mutation from?"
  {
    id: 'mission-nyx-01',
    chapterTier: 'researcher',
    minCompletedChapters: 41,
    clientCharacterId: 'dr-nyx',
    clientBrief:
      "I need a live sparkle (K-carrier) from non-sparkling parents. Four plain samples on the bench — pick a lineage and breed until the mutation happens.",
    targetPhenotype: { sparkle: 'K' },
    visibleGeneIds: ['sparkle'],
    labStarters: [
      {
        sex: 'F',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx F-α',
      },
      {
        sex: 'F',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx F-β',
      },
      {
        sex: 'M',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx M-α',
      },
      {
        sex: 'M',
        genotype: { sparkle: ['k', 'k'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Nyx M-β',
      },
    ],
    breedBudget: 30, // rare event
    mode: 'breed',
    rewardPreviewText: 'contributes to the mutation-rate reference dataset',
  },
  // CRISPR calibration: 3 samples on heatSpot. HH F, hh F, hh M.
  // Target = H-carrier. HH × hh guarantees Hh in F1; hh × hh cannot produce.
  {
    id: 'mission-nyx-02',
    chapterTier: 'researcher',
    minCompletedChapters: 48,
    clientCharacterId: 'dr-nyx',
    clientBrief:
      "CRISPR calibration. Deliver a heat-spot carrier (H-carrier). Three samples on the bench — pick the pair that guarantees the trait passes.",
    targetPhenotype: { heatSpot: 'H' },
    visibleGeneIds: ['heatSpot'],
    labStarters: [
      {
        sex: 'F',
        genotype: { heatSpot: ['H', 'H'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Homoz H F',
      },
      {
        sex: 'F',
        genotype: { heatSpot: ['h', 'h'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Plain F',
      },
      {
        sex: 'M',
        genotype: { heatSpot: ['h', 'h'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Plain M',
      },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'signs off the CRISPR calibration for the next round',
  },
]
