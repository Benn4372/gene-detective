import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 19 — Genomic imprinting. imprintMark is maternally imprinted: the
// maternal allele is silenced, only the paternal copy expresses. So a Jj
// heterozygote's phenotype depends entirely on which parent contributed J.
export const ch19: Chapter = {
  id: 'ch19',
  order: 19,
  tier: 'student',
  concept: 'Imprinting — parent-of-origin effects',
  title: 'Which parent sent it?',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"The imprint mark gene is maternally imprinted — the mother's copy is silenced. Only the father's copy speaks."`,

  storyOutro: `Prof. Weaver:
"Reciprocal crosses tell you it's imprinted: JJ × jj and jj × JJ give the same offspring genotypes but opposite phenotypes."`,

  pinnedGlossaryTerms: ['imprinting', 'parent-of-origin'],

  stages: {
    show: {
      body: `**Imprinting** silences an allele based on parent-of-origin. Our imprintMark gene is **maternally imprinted** — the mother's copy is silenced in every offspring, and only the paternal copy expresses.

Consequence: a Jj offspring where father contributed J shows the mark. A Jj offspring where father contributed j does NOT show the mark, even though the genotype is identical.`,
    },
    guided: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, imprintMark: ['J', 'J'] },
          defaultName: 'JJ ♀ (silenced)',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, imprintMark: ['j', 'j'] },
          defaultName: 'jj ♂',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'imprintMark', correctGenotype: 'JJ' },
        { creatureRole: 'father', geneId: 'imprintMark', correctGenotype: 'jj' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen: 'Mother is JJ (mark silenced because it\'s maternal). Father jj (no mark). All offspring: Jj — but mother\'s J is silenced, so they all show j (no mark).',
        onWrongHypothesis: {},
      },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, imprintMark: ['J', 'J'] }, defaultName: 'JJ ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, imprintMark: ['j', 'j'] }, defaultName: 'jj ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'imprintMark', correctGenotype: 'JJ' },
        { creatureRole: 'father', geneId: 'imprintMark', correctGenotype: 'jj' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [
        { stage: 'reframe', text: 'Note: offspring inherit both alleles but only the paternal one expresses.' },
        { stage: 'point', text: 'Try the reciprocal: swap parent genotypes and re-run.' },
        { stage: 'suggest', text: 'JJ mother × jj father.' },
      ],
    },
  },
  unlocks: { traits: ['imprintMark'], nextChapterId: 'ch20' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, imprintMark: ['J', 'j'] },
    defaultName: 'Imprint Trophy',
  },
}
