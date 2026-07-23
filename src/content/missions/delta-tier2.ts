import type { Mission } from '../types'

// Prof. Delta's mission set — unlocks after Ch 27 (population-scale chapters).
// All 'breed' mode targeting specific phenotypes with multi-starter benches
// so the player has to pick the right pair.
export const deltaTier2Missions: Mission[] = [
  // Founder puzzle: 3 samples — one long, one medium, one short.
  // Target = long-tail (TT) offspring. Only pairs involving the TT female
  // or two Tt heterozygotes can produce it; tt × Tt cannot.
  {
    id: 'mission-delta-01',
    chapterTier: 'student',
    minCompletedChapters: 27,
    clientCharacterId: 'prof-delta',
    clientBrief:
      "Small colony. I need a long-tail founder — TT homozygote — to seed a drift experiment. Three tail samples on the bench; not every cross can even produce a TT.",
    targetPhenotype: { tail: 'T' },
    visibleGeneIds: ['tail'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 'T'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Long-tail F',
      },
      {
        sex: 'F',
        genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Medium-tail F',
      },
      {
        sex: 'M',
        genotype: { tail: ['t', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Short-tail M',
      },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'seeds a founder-effect experiment; adds a note to the population registry',
  },
  // Selection sweep: 4 samples of tail × antennae dihybrids.
  // Target = double-recessive (tt aa). Fastest path is the two Aa Tt × Aa Tt
  // sample cross (1/16); slower via crosses with dominant homozygotes.
  {
    id: 'mission-delta-02',
    chapterTier: 'student',
    minCompletedChapters: 30,
    clientCharacterId: 'prof-delta',
    clientBrief:
      "Selection sweep. Bring me a double-recessive (short-tail, no antennae). Four dihybrid samples — the ratio of tt aa varies enormously by which pair you pick.",
    targetPhenotype: { tail: 't', antennae: 'a' },
    visibleGeneIds: ['tail', 'antennae'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 't'], antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Dihybrid F-α',
      },
      {
        sex: 'F',
        genotype: { tail: ['T', 'T'], antennae: ['A', 'A'], spots: ['s', 's'] },
        defaultName: 'Homoz-dominant F',
      },
      {
        sex: 'M',
        genotype: { tail: ['T', 't'], antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Dihybrid M-α',
      },
      {
        sex: 'M',
        genotype: { tail: ['t', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Double-recessive M',
      },
    ],
    breedBudget: 10,
    mode: 'breed',
    rewardPreviewText: 'confirms the multi-gene tail-frequency prediction',
  },
]
