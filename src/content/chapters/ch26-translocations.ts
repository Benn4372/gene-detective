import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 26 — Translocations and inversions. Chromosome chunks swap or flip.
export const ch26: Chapter = {
  id: 'ch26',
  order: 26,
  tier: 'student',
  concept: 'Translocations and inversions',
  title: 'Chunks in the wrong place',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"A translocation moves a chunk of DNA to a different chromosome. An inversion flips a chunk end-for-end. Genes are all still there; just rearranged."`,

  storyOutro: `Prof. Weaver:
"Rearrangements often go unnoticed in the carrier. But in their gametes, meiosis pairing goes wrong and fertility drops. Chromosomal medicine at work."`,

  pinnedGlossaryTerms: ['translocation', 'inversion'],

  stages: {
    show: {
      body: `A **translocation** takes a chunk of one chromosome and glues it onto another. An **inversion** takes a chunk and flips it upside-down.

Both leave gene content intact — the carrier is usually fine. But offspring inherit imbalanced gametes (missing or duplicated chunks), reducing fertility. That's the karyotype clinician's first clue.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 't'] }, defaultName: 'Medium-tail mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, tail: ['T', 't'] }, defaultName: 'Medium-tail father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tail', correctGenotype: 'Tt' },
        { creatureRole: 'father', geneId: 'tail', correctGenotype: 'Tt' },
      ],
      litterSize: 8,
      scaffolding: { onOpen: 'Tt × Tt medium-tail pair. Notebook puzzle stays classical; the chapter concept is visualised in the karyotype viewer.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 't'] }, defaultName: 'Medium-tail mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, tail: ['T', 't'] }, defaultName: 'Medium-tail father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tail', correctGenotype: 'Tt' },
        { creatureRole: 'father', geneId: 'tail', correctGenotype: 'Tt' },
      ],
      litterSize: 8,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Medium-tail pair.' }, { stage: 'point', text: 'Tt × Tt.' }, { stage: 'suggest', text: 'Tt for both.' }],
    },
  },
  unlocks: { mentors: ['prof-delta'], nextChapterId: 'ch27' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, tail: ['T', 't'] },
    defaultName: 'Translocation Trophy',
  },
  interactionMode: {
    kind: 'karyotype',
    states: {
      'auto-1': 'translocation',
      'auto-2': 'inversion',
    },
  },
}
