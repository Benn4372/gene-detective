import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 22 — Anticipation. Repeat-expansion mutations grow across generations.
// Presented narratively (engine doesn't grow repeats yet).
export const ch22: Chapter = {
  id: 'ch22',
  order: 22,
  tier: 'student',
  concept: 'Anticipation — worsening across generations',
  title: 'Growing across generations',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Some alleles are unstable. A repeat sequence grows a little bigger each generation. Symptoms show up earlier and more severely in each successive child."`,

  storyOutro: `Prof. Weaver:
"Huntington's, myotonic dystrophy, fragile X — all real anticipation diseases. Genetic anniversaries drifting earlier."`,

  pinnedGlossaryTerms: ['anticipation', 'repeat-expansion'],

  stages: {
    show: {
      body: `**Anticipation** is when a heritable trait appears earlier or more strongly in each successive generation. The mechanism is usually a **repeat expansion**: a stretch of DNA repeats gets a little longer during meiosis.

Not modeled directly in blob crosses, but you'll see the concept in the pedigrees of some missions.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['k', 'k'] }, defaultName: 'Stable ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, sparkle: ['k', 'k'] }, defaultName: 'Stable ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 8,
      scaffolding: { onOpen: 'Both kk — no sparkle. Watch for the rare mutations climbing in later generations.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['k', 'k'] }, defaultName: 'Stable ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, sparkle: ['k', 'k'] }, defaultName: 'Stable ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 8,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'No sparkle showing means kk.' }, { stage: 'point', text: 'Both parents kk.' }, { stage: 'suggest', text: 'Enter kk for both.' }],
    },
  },
  unlocks: { nextChapterId: 'ch23' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['K', 'k'] },
    defaultName: 'Anticipation Trophy',
  },
}
