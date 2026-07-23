import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 20 — X-inactivation / mosaicism. Females inactivate one X per cell,
// producing a patchy phenotype. Presented narratively.
export const ch20: Chapter = {
  id: 'ch20',
  order: 20,
  tier: 'student',
  concept: 'X-inactivation and mosaicism',
  title: 'Half-on, half-off',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Female mammals silence one of their two Xs in every cell — at random. Heterozygous females become mosaics of expression."`,

  storyOutro: `Prof. Weaver:
"Calico cats work this way. Half the cells express the tortoiseshell allele from one X, half from the other. Same genotype, different cells."`,

  pinnedGlossaryTerms: ['x-inactivation', 'mosaicism'],

  stages: {
    show: {
      body: `In female mammals, one X per cell is silenced during early development — the "**Barr body**". Which X gets silenced is random. Result: a heterozygous female is a **mosaic** of two different cell populations, each expressing a different X allele.

Gg heterozygous females for the eyeGlow gene should show a patchy expression — some cells glow, some don't. In our simplified renderer we still show them as glowing overall.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'g'] }, defaultName: 'Gg mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, eyeGlow: ['g'] }, defaultName: 'g father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'g' },
      ],
      litterSize: 6,
      scaffolding: { onOpen: 'Female Gg is really a mosaic — some cells glow, others don\'t. Real body-cell composition varies.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'g'] }, defaultName: 'Gg mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, eyeGlow: ['g'] }, defaultName: 'g father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'g' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Mother is a carrier; father shows recessive.' }, { stage: 'point', text: 'Mother Gg heterozygous.' }, { stage: 'suggest', text: 'Gg mother, g father.' }],
    },
  },
  unlocks: { nextChapterId: 'ch21' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'g'] },
    defaultName: 'Mosaic Trophy',
  },
}
