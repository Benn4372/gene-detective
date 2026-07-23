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
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'g'] }, defaultName: 'Mosaic mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, eyeGlow: ['g'] }, defaultName: 'No-glow father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'g' },
      ],
      litterSize: 6,
      scaffolding: { onOpen: 'Female Gg is really a mosaic — some cells glow, others don\'t. Real body-cell composition varies.', onWrongHypothesis: {} },
    },
    // Solo: GG mother × g father — every offspring inherits G from mother
    // and g/Y from father. Daughters all Gg mosaics; sons all G hemizygous.
    // Every offspring glows outwardly, but daughters are patchy under close
    // inspection.
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'G'] }, defaultName: 'Uniform-glow mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, eyeGlow: ['g'] }, defaultName: 'No-glow father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'GG' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'g' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Every offspring glows visibly. Sons hemizygous G; daughters Gg mosaic.' }, { stage: 'point', text: 'Uniform outer glow across offspring means mother is GG (else half would be gg / dim).' }, { stage: 'suggest', text: 'GG mother, g father.' }],
    },
  },
  unlocks: { nextChapterId: 'ch21' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, eyeGlow: ['G', 'g'] },
    defaultName: 'Mosaic Trophy',
  },
}
