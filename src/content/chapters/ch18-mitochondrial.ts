import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 18 — Mitochondrial inheritance. Only mothers pass mitochondrial DNA to
// offspring. All offspring resemble the mother for the mitoHalo gene.
export const ch18: Chapter = {
  id: 'ch18',
  order: 18,
  tier: 'student',
  concept: 'Mitochondrial inheritance — maternal only',
  title: 'Mother’s line',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"The mito halo — see it? Only inherited from mother, never father. Human matrilineal ancestry, in a blob."`,

  storyOutro: `Prof. Weaver:
"Mitochondrial DNA is haploid, tiny, and inherited only through the maternal line. Reciprocal crosses tell you it's mitochondrial."`,

  pinnedGlossaryTerms: ['mitochondrial-inheritance'],

  stages: {
    show: {
      body: `**Mitochondrial** DNA lives in the mitochondria, not the nucleus. It's inherited only through the mother — every offspring shares her mito-genotype, no matter the father's.

For the mitoHalo gene: mother Q → every child Q. Mother q → every child q. Father contributes nothing.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, mitoHalo: ['Q'] }, defaultName: 'Halo ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, mitoHalo: ['q'] }, defaultName: 'Plain ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'mitoHalo', correctGenotype: 'Q' },
        { creatureRole: 'father', geneId: 'mitoHalo', correctGenotype: 'q' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen: 'Mother has the halo, father does not. Every child gets the halo from mother — including sons.',
        onWrongHypothesis: {},
      },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, mitoHalo: ['Q'] }, defaultName: 'Halo ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, mitoHalo: ['q'] }, defaultName: 'Plain ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'mitoHalo', correctGenotype: 'Q' },
        { creatureRole: 'father', geneId: 'mitoHalo', correctGenotype: 'q' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Mito DNA is maternal only.' }, { stage: 'point', text: 'Every child matches mother.' }, { stage: 'suggest', text: 'Q mother, q father.' }],
    },
  },
  unlocks: { traits: ['mitoHalo'], nextChapterId: 'ch19' },
  trophyBlobPreset: {
    sex: 'M', genotype: { ...NEUTRAL_MALE, mitoHalo: ['Q'] },
    defaultName: 'Halo son Trophy',
  },
}
