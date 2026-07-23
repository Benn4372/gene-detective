import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Chapter 9 — Epistasis
//
// The tailGrowth gene (G/g) masks the tail gene (T/t): gg individuals have
// NO tail at all, regardless of what T/t alleles they carry. The player sees
// tail-less offspring appear from two visibly-tailed parents — classic
// epistasis, where one gene switches another off entirely.
export const ch09: Chapter = {
  id: 'ch09',
  order: 9,
  tier: 'curious',
  concept: 'Epistasis — one gene masking another',
  title: 'The gene above the gene',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, sliding a photo of a tail-less blob across the bench:
"Two long-tailed parents. This tail-less child. You know the tail gene — TT should breed true for long tails. So what's stopping this one from growing a tail at all?"
"Meet **tailGrowth**. When both copies are recessive — gg — the tail-growth pathway arrests entirely. No tail forms, whatever the T/t alleles say."`,

  storyOutro: `Prof. Weaver:
"That's epistasis. One gene controls whether another can express at all. Real biology is stitched together this way — a hormone gene switching a target gene off, a regulator silencing a whole cascade."
"Ten chapters in. Time to zoom out."`,

  pinnedGlossaryTerms: [
    'epistasis',
    'gene-interaction',
    'phenotype',
    'genotype',
  ],

  stages: {
    show: {
      body: `**Epistasis** is when one gene interferes with another gene's expression. The masked gene still exists in the genome — its alleles are there — but its phenotypic output is overridden by the masking gene.

The **tailGrowth** gene has two alleles:

- **GG or Gg** → growth pathway on. The tail gene (T/t) expresses normally — TT long, Tt medium, tt short.
- **gg** → growth pathway off. **No tail at all**, no matter what T/t alleles the blob carries.

So a tail-less blob could secretly be TT, Tt, or tt — you can't tell without breeding it. But two long-tailed parents producing a tail-less child? That reveals both parents must be carrying a hidden **g**.`,
      workedExample: {
        parents: [
          {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
        ],
        narration: [
          'Both parents are TT for tail — should breed nothing but long tails.',
          'Both are also Gg for tailGrowth — heterozygous carriers of the "off" allele.',
          '3/4 of offspring inherit at least one G → tail grows normally (long).',
          "1/4 of offspring are gg → no tail forms, even though they're TT for the tail gene.",
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Long-tail α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Long-tail β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Gg' },
      ],
      // Tail is the observable trait — it goes on the offspring tally so
      // the player can literally see "long × 3 / no tail × 1" ratios that
      // reveal the gg homozygote hiding inside the tailGrowth cross.
      supportingGeneIds: ['tail'],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Both parents have long tails. If a tail-less offspring appears, that's impossible from the tail gene alone — both parents must be carrying a hidden g in tailGrowth.",
        onWrongHypothesis: {
          'mother:tailGrowth:GG':
            "If she were GG, no offspring could ever be gg. Any tail-less child means she must be Gg.",
          'mother:tailGrowth:gg':
            "gg would mean SHE has no tail. She clearly does — she must have at least one G.",
          'father:tailGrowth:GG':
            "Same logic — a tail-less offspring means the father must be Gg, not GG.",
          'father:tailGrowth:gg':
            "The father has a tail. He can't be gg.",
        },
      },
    },

    // Solo swaps to an EPISTASIS TEST CROSS: long-tail mystery mother × known
    // tail-less father (gg for tailGrowth). Every offspring inherits g from
    // the father, so their tail depends entirely on which allele the mother
    // contributes. Half tail-less means she must be Gg.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Long-tail mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['g', 'g'],
          },
          defaultName: 'Tail-less father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'gg' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Two long-tailed parents producing a tail-less child is impossible under the tail gene alone. Something else must be involved.',
        },
        {
          stage: 'point',
          text: 'A tail-less blob means gg on the tailGrowth gene. If a gg offspring appears, both parents must be Gg heterozygotes.',
        },
        {
          stage: 'suggest',
          text: 'Enter Gg for both parents on tailGrowth — they carry the "off" allele silently while their own G keeps their tail growing.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['tailGrowth'],
    nextChapterId: 'ch10',
  },

  trophyBlobPreset: {
    sex: 'M',
    genotype: {
      ...NEUTRAL_MALE,
      tail: ['T', 'T'],
      tailGrowth: ['g', 'g'],
    },
    defaultName: 'Tail-less Trophy',
  },
}
