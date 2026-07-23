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
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['k', 'k'] }, defaultName: 'Stable mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, sparkle: ['k', 'k'] }, defaultName: 'Stable father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 8,
      scaffolding: { onOpen: 'Both kk — no sparkle. Watch for the rare mutations climbing in later generations.', onWrongHypothesis: {} },
    },
    // Solo: heterozygous sparkler mother × plain father. Half the offspring
    // inherit K (sparkling). Different setup from guided's kk × kk mutation
    // scenario — teaches that anticipation is layered on top of the ordinary
    // inheritance rules the player already knows.
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['K', 'k'] }, defaultName: 'Faint-sparkle mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, sparkle: ['k', 'k'] }, defaultName: 'Plain father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'Kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 8,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Mother is Kk carrier, father kk. Half offspring sparkle. Watch for repeat expansions strengthening the signal in later gens.' }, { stage: 'point', text: 'About 50/50 sparkle:plain in offspring → mother is Kk.' }, { stage: 'suggest', text: 'Kk mother, kk father.' }],
    },
  },
  unlocks: { nextChapterId: 'ch23' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, sparkle: ['K', 'k'] },
    defaultName: 'Anticipation Trophy',
  },
}
