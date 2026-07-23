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
          defaultName: 'Marked-mother mystery',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, imprintMark: ['j', 'j'] },
          defaultName: 'Unmarked father',
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
    // Solo runs the RECIPROCAL cross: jj mother × JJ father. Genotype-wise
    // every offspring is still Jj — but now the father's J is the one that
    // expresses, so ALL offspring show the mark. Same genotype, opposite
    // phenotype from guided → imprinting fingerprint.
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, imprintMark: ['j', 'j'] }, defaultName: 'Unmarked mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, imprintMark: ['J', 'J'] }, defaultName: 'Marked-father mystery' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'imprintMark', correctGenotype: 'jj' },
        { creatureRole: 'father', geneId: 'imprintMark', correctGenotype: 'JJ' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [
        { stage: 'reframe', text: "This is guided flipped — mother has no mark, father does. Offspring still inherit J from father and j from mother, and now father's J expresses in every one." },
        { stage: 'point', text: 'Same Jj genotype as guided offspring, opposite phenotype. That reciprocal difference IS the imprinting signature.' },
        { stage: 'suggest', text: 'jj mother, JJ father.' },
      ],
    },
  },
  unlocks: { traits: ['imprintMark'], nextChapterId: 'ch20' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, imprintMark: ['J', 'j'] },
    defaultName: 'Imprint Trophy',
  },
}
