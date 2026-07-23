import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 21 — Modifier genes. Genes that don't cause a trait themselves but tune
// the intensity of another gene's expression. Reuses coatPigment.
export const ch21: Chapter = {
  id: 'ch21',
  order: 21,
  tier: 'student',
  concept: 'Modifier genes — turning knobs, not switches',
  title: 'The volume knob',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Some genes don't do anything on their own but they dial up or dial down other genes."`,

  storyOutro: `Prof. Weaver:
"Modifier genes explain variable expressivity — why the same 'disease-causing' allele can be mild in one family and severe in another."`,

  pinnedGlossaryTerms: ['modifier-gene', 'expressivity'],

  stages: {
    show: {
      body: `A **modifier gene** doesn't produce its own phenotype — it changes how strongly another gene expresses. Think of it as a volume knob.

In blobs, coatPigment (C/c) doesn't just switch color on/off; it also modulates how intense the color appears. CC gives a saturated colour; Cc a paler version; cc masks entirely.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 'T'], tailGrowth: ['G', 'g'] }, defaultName: 'Muted red ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, tail: ['T', 'T'], tailGrowth: ['G', 'g'] }, defaultName: 'Muted red ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Gg' },
      ],
      litterSize: 8,
      scaffolding: { onOpen: 'Both parents RR for color — you\'d expect all offspring red. Some are yellow (cc). Cc modifier.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 'T'], tailGrowth: ['G', 'g'] }, defaultName: 'Muted red ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, tail: ['T', 'T'], tailGrowth: ['G', 'g'] }, defaultName: 'Muted red ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Gg' },
      ],
      litterSize: 8,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Both look muted red. Cc.' }, { stage: 'point', text: 'Yellow offspring means Cc parents.' }, { stage: 'suggest', text: 'Enter Cc for both.' }],
    },
  },
  unlocks: { nextChapterId: 'ch22' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 'T'], tailGrowth: ['G', 'G'] },
    defaultName: 'Modifier Trophy',
  },
}
