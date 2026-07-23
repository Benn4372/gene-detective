import type { Chapter } from '../types'

// Chapter 5 — Codominance
//
// The pattern gene: two alleles (R = stripes, B = blotches) where the
// heterozygote (RB) shows BOTH patterns rather than blending them. The
// symbol R (Ribbon) is used instead of T so the codex is unambiguous —
// the tail gene already claims T.
export const ch05: Chapter = {
  id: 'ch05',
  order: 5,
  tier: 'curious',
  concept: 'Codominance — both alleles expressed simultaneously',
  title: 'Both, at once',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, pointing at a specimen with a striped-and-blotched hide:
"Look — not a blend of stripes and blotches. Both. Fully expressed at the same time."
"That's **codominance**. Neither allele hides; both make their own contribution."`,

  storyOutro: `Prof. Weaver:
"With R and B being codominant, the heterozygote RB is unmistakably both — you can read the genotype without breeding a single litter. Handy."
"Next up: what happens when a gene has more than two alleles?"`,

  pinnedGlossaryTerms: [
    'codominance',
    'heterozygote',
    'phenotype',
    'allele',
  ],

  stages: {
    show: {
      body: `**Codominance** is a close cousin of incomplete dominance — but instead of blending, the heterozygote expresses BOTH allele phenotypes simultaneously.

Our pattern gene has two codominant alleles:

- **RR** → stripes only
- **BB** → blotches only
- **RB** → stripes AND blotches, both fully visible

The show walkthrough below uses a **pure-striped × pure-blotched** cross so you can watch a codominant F1 form. In the guided stage you'll then work backwards from a mixed litter to figure out heterozygous parents.`,
      workedExample: {
        parents: [
          { pattern: ['R', 'R'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
          { pattern: ['B', 'B'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
        ],
        narration: [
          'Mother is RR — pure stripes. She can only pass R.',
          'Father is BB — pure blotches. He can only pass B.',
          'Every offspring inherits R from mother, B from father → all RB.',
          'Codominance: every child shows stripes AND blotches, at once.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            pattern: ['R', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Patterned α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            pattern: ['R', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Patterned β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'pattern', correctGenotype: 'RB' },
        { creatureRole: 'father', geneId: 'pattern', correctGenotype: 'RB' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Both parents show stripes AND blotches. Under codominance, that phenotype is only consistent with ONE genotype. Which?",
        onWrongHypothesis: {
          'mother:pattern:RR':
            "An RR parent would show stripes only. This one has blotches too — it can't be RR.",
          'mother:pattern:BB':
            "A BB parent would show blotches only. Yours has stripes too — must be heterozygous.",
          'father:pattern:RR':
            "RR means stripes only. The father shows both — impossible for RR.",
          'father:pattern:BB':
            "BB means blotches only. The father clearly has stripes as well.",
        },
      },
    },

    // Solo flips to a test-cross-style reveal: a mystery both-patterned mother
    // × a pure-blotched father. Offspring split cleanly into stripes+blotches
    // vs blotches-only, revealing whether the mother is truly RB.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            pattern: ['R', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Mystery patterned',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            pattern: ['B', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Pure-blotched partner',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'pattern', correctGenotype: 'RB' },
        { creatureRole: 'father', geneId: 'pattern', correctGenotype: 'BB' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Father is pure-blotched (BB gives blotches only). He can only pass B. So every offspring reveals one of the mother\'s alleles directly.',
        },
        {
          stage: 'point',
          text: 'If the mother is RB, half her gametes are R (→ RB offspring: both patterns) and half are B (→ BB offspring: blotches only). Look for a 1:1 split.',
        },
        {
          stage: 'suggest',
          text: 'Roughly half stripes+blotches, half blotches-only → mother is RB. Enter RB for mother, BB for father.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['pattern'],
    nextChapterId: 'ch06',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      pattern: ['R', 'B'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
    },
    defaultName: 'RB Trophy',
  },
}
