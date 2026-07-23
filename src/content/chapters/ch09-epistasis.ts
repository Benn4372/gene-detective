import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Chapter 9 — Epistasis
//
// The tailGrowth gene (P/p) masks the tail gene (T/t): pp individuals have
// NO tail at all, regardless of what T/t alleles they carry. The player sees
// tail-less offspring appear from two visibly-tailed parents — classic
// epistasis, where one gene switches another off entirely.
//
// tailGrowth's symbol is P (Pathway) rather than G because the sex-linked
// eyeGlow gene from Ch7 already occupies G on the X chromosome.
export const ch09: Chapter = {
  id: 'ch09',
  order: 9,
  tier: 'curious',
  concept: 'Epistasis — one gene masking another',
  title: 'The gene above the gene',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, sliding a photo of a tail-less blob across the bench:
"Two long-tailed parents. This tail-less child. You know the tail gene — TT should breed true for long tails. So what's stopping this one from growing a tail at all?"
"Meet **tailGrowth**. When both copies are recessive — pp — the tail-growth pathway arrests entirely. No tail forms, whatever the T/t alleles say."`,

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

- **PP or Pp** → growth pathway on. The tail gene (T/t) expresses normally — TT long, Tt medium, tt short.
- **pp** → growth pathway off. **No tail at all**, no matter what T/t alleles the blob carries.

The show walkthrough uses a **known-carrier × tail-less** cross so you can watch epistasis land cleanly. In guided you'll then diagnose two long-tailed parents who are secretly both carriers.`,
      workedExample: {
        parents: [
          {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['p', 'p'],
          },
        ],
        narration: [
          'Mother is Pp — she carries one silent p allele.',
          'Father is pp — visibly tail-less, can only pass p.',
          'Half of offspring get P from the mother → tail grows normally.',
          'Half get p from the mother → pp offspring: no tail at all.',
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
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Long-tail α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Long-tail β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Pp' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Pp' },
      ],
      // Tail is the observable trait — it goes on the offspring tally so
      // the player can literally see "long × 3 / no tail × 1" ratios that
      // reveal the pp homozygote hiding inside the tailGrowth cross.
      supportingGeneIds: ['tail'],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Both parents have long tails. If a tail-less offspring appears, that's impossible from the tail gene alone — both parents must be carrying a hidden p in tailGrowth.",
        onWrongHypothesis: {
          'mother:tailGrowth:PP':
            "If she were PP, no offspring could ever be pp. Any tail-less child means she must be Pp.",
          'mother:tailGrowth:pp':
            "pp would mean SHE has no tail. She clearly does — she must have at least one P.",
          'father:tailGrowth:PP':
            "Same logic — a tail-less offspring means the father must be Pp, not PP.",
          'father:tailGrowth:pp':
            "The father has a tail. He can't be pp.",
        },
      },
    },

    // Solo swaps to an EPISTASIS TEST CROSS: long-tail mystery mother × known
    // tail-less father (pp for tailGrowth). Every offspring inherits p from
    // the father, so their tail depends entirely on which allele the mother
    // contributes. Half tail-less means she must be Pp.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Long-tail mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['p', 'p'],
          },
          defaultName: 'Tail-less father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Pp' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'pp' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Every offspring inherits p from the father (he\'s pp). So each child\'s tail is entirely decided by which allele the mother passed.',
        },
        {
          stage: 'point',
          text: 'If the mother is Pp, roughly half of offspring get P (grow tail) and half get p (no tail). If she were PP, all offspring would grow tails.',
        },
        {
          stage: 'suggest',
          text: 'A rough 1:1 split of tailed vs tail-less → mother is Pp. Enter Pp for the mother, pp for the tail-less father.',
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
      tailGrowth: ['p', 'p'],
    },
    defaultName: 'Tail-less Trophy',
  },
}
