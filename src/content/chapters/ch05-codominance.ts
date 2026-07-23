import type { Chapter } from '../types'

// Chapter 5 — Codominance
//
// The pattern gene: two alleles (T = stripes, B = blotches) where the
// heterozygote (TB) shows BOTH patterns rather than blending them. Introduces
// the codominant model in the engine (already implemented; wiring only).
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
"With T and B being codominant, the heterozygote TB is unmistakably both — you can read the genotype without breeding a single litter. Handy."
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

- **TT** → stripes only
- **BB** → blotches only
- **TB** → stripes AND blotches, both fully visible

Cross two heterozygous TB parents and you'll still get 1:2:1 genotypes — but now the phenotypes are visually distinct: stripes-only, both, and blotches-only.`,
      workedExample: {
        parents: [
          { pattern: ['T', 'B'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
          { pattern: ['T', 'B'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
        ],
        narration: [
          'Both parents are TB — visibly striped AND blotched.',
          'Each parent contributes T or B with equal odds.',
          'Offspring: 25% TT (stripes only), 50% TB (both), 25% BB (blotches only).',
          'Codominance makes every genotype directly visible.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            pattern: ['T', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'TB Blob-α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            pattern: ['T', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'TB Blob-β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'pattern', correctGenotype: 'TB' },
        { creatureRole: 'father', geneId: 'pattern', correctGenotype: 'TB' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Both parents show stripes AND blotches. Under codominance, that phenotype is only consistent with ONE genotype. Which?",
        onWrongHypothesis: {
          'mother:pattern:TT':
            "A TT parent would show stripes only. This one has blotches too — it can't be TT.",
          'mother:pattern:BB':
            "A BB parent would show blotches only. Yours has stripes too — must be heterozygous.",
          'father:pattern:TT':
            "TT means stripes only. The father shows both — impossible for TT.",
          'father:pattern:BB':
            "BB means blotches only. The father clearly has stripes as well.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            pattern: ['T', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'TB Blob-α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            pattern: ['T', 'B'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'TB Blob-β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'pattern', correctGenotype: 'TB' },
        { creatureRole: 'father', geneId: 'pattern', correctGenotype: 'TB' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Three possible phenotypes: stripes only, blotches only, or both. Which parent phenotype must both mother and father share?',
        },
        {
          stage: 'point',
          text: 'Cross them; watch for three visually distinct offspring types. Roughly 1:2:1 confirms TB × TB.',
        },
        {
          stage: 'suggest',
          text: "Enter TB for both parents — codominant heterozygous, showing both stripes and blotches simultaneously.",
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
      pattern: ['T', 'B'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
    },
    defaultName: 'TB Trophy',
  },
}
