import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 25 — Deletions and duplications. Small chromosome chunks lost or copied.
export const ch25: Chapter = {
  id: 'ch25',
  order: 25,
  tier: 'student',
  concept: 'Deletions and duplications',
  title: 'Chunks lost or gained',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Whole chromosomes off by one is one problem. Losing or duplicating a *chunk* — a stretch containing several genes — is another."`,

  storyOutro: `Prof. Weaver:
"Cri-du-chat syndrome is a 5p deletion. Charcot-Marie-Tooth type 1A is a 17p duplication. Small changes, big consequences."`,

  pinnedGlossaryTerms: ['deletion', 'duplication', 'chromosome-aberration'],

  stages: {
    show: {
      body: `A **deletion** removes a chunk of DNA — often several genes at once. A **duplication** adds an extra copy. Both change gene dosage.

Blob genome examples (schematic in the karyotype viewer above): a deletion on chromosome auto-2 might strip out both spots and pattern; a duplication of auto-3 might triple the horns dosage.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, spots: ['S', 's'] }, defaultName: 'Spotted mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, spots: ['s', 's'] }, defaultName: 'Plain father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
        { creatureRole: 'father', geneId: 'spots', correctGenotype: 'ss' },
      ],
      litterSize: 6,
      scaffolding: { onOpen: 'Standard testcross. Chapter is about karyotype-scale changes; the puzzle stays classical.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, spots: ['S', 's'] }, defaultName: 'Spotted mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, spots: ['s', 's'] }, defaultName: 'Plain father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
        { creatureRole: 'father', geneId: 'spots', correctGenotype: 'ss' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Testcross.' }, { stage: 'point', text: 'Half offspring show spots.' }, { stage: 'suggest', text: 'Ss and ss.' }],
    },
  },
  unlocks: { nextChapterId: 'ch26' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, spots: ['S', 's'] },
    defaultName: 'Deletion Trophy',
  },
  interactionMode: {
    kind: 'karyotype',
    states: {
      'auto-1': 'deletion',
      'auto-3': 'duplication',
    },
  },
}
