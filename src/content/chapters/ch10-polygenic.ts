import type { Chapter } from '../types'

// Chapter 10 — Polygenic / Quantitative traits
//
// Size is driven by three additive genes (sizeA D/d, sizeB E/e, sizeC V/v),
// each with a "large" and a "small" allele. Total "large" alleles across all
// three ranges from 0 (smallest) to 6 (largest). This is the first CONTINUOUS-
// looking trait in the game — the bell-curve distribution of offspring size
// is the signature of polygenic inheritance.
//
// The three genes use D, E, V rather than X, Y, Z so they never clash with
// sex chromosomes X and Y in the notebook or Punnett display.
export const ch10: Chapter = {
  id: 'ch10',
  order: 10,
  tier: 'curious',
  concept: 'Polygenic (additive) inheritance and continuous traits',
  title: 'Many small effects',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, tapping a scatterplot of body sizes:
"Size isn't discrete. Look — a smooth spread from small to large, no sharp categories."
"That's because THREE genes each add a tiny bit. When many small effects sum, phenotypes go continuous."`,

  storyOutro: `Prof. Weaver:
"With enough polygenic loci, the offspring distribution approaches a bell curve. Every human trait you can measure — height, weight, most disease risks — works this way."
"Only a few chapters left in the tier. Environment next."`,

  pinnedGlossaryTerms: [
    'polygenic',
    'quantitative-trait',
    'continuous-variation',
    'additive-effect',
  ],

  stages: {
    show: {
      body: `A **polygenic** trait is controlled by many genes acting additively — each contributes a small amount.

Blob size is controlled by three genes:

- **sizeA** (D large / d small)
- **sizeB** (E large / e small)
- **sizeC** (V large / v small)

Each "large" allele adds 1 to the total. So a DdEeVv blob (heterozygous for all three) gets 3 out of 6 — a medium blob. A DDEEVV blob is maximum size (6/6); a ddeevv blob is smallest (0/6).

The show walkthrough uses a **largest × smallest** cross so you can watch every offspring land at exactly medium. In guided you'll then work backwards from a bell-curve litter to figure out both parents are hetero on all three genes.`,
      workedExample: {
        parents: [
          {
            sizeA: ['D', 'D'],
            sizeB: ['E', 'E'],
            sizeC: ['V', 'V'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
          },
          {
            sizeA: ['d', 'd'],
            sizeB: ['e', 'e'],
            sizeC: ['v', 'v'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
          },
        ],
        narration: [
          'Mother is DDEEVV — 6 large alleles. Every gamete is DEV.',
          'Father is ddeevv — 0 large alleles. Every gamete is dev.',
          'Every offspring inherits DEV from her and dev from him → DdEeVv (3 large).',
          'Every child lands at exactly medium — the F1 collapse before variation returns.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sizeA: ['D', 'd'],
            sizeB: ['E', 'e'],
            sizeC: ['V', 'v'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
          },
          defaultName: 'Medium α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sizeA: ['D', 'd'],
            sizeB: ['E', 'e'],
            sizeC: ['V', 'v'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
          },
          defaultName: 'Medium β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sizeA', correctGenotype: 'Dd' },
        { creatureRole: 'mother', geneId: 'sizeB', correctGenotype: 'Ee' },
        { creatureRole: 'mother', geneId: 'sizeC', correctGenotype: 'Vv' },
        { creatureRole: 'father', geneId: 'sizeA', correctGenotype: 'Dd' },
        { creatureRole: 'father', geneId: 'sizeB', correctGenotype: 'Ee' },
        { creatureRole: 'father', geneId: 'sizeC', correctGenotype: 'Vv' },
      ],
      litterSize: 10,
      scaffolding: {
        onOpen:
          "Both parents are medium-sized. Breed several litters and look for the smallest and largest offspring. If either extreme appears, both parents must be Dd / Ee / Vv.",
        onWrongHypothesis: {
          'mother:sizeA:DD':
            "If she were DD for sizeA, no offspring could ever be dd for that gene — no smallest-size individuals would appear.",
          'mother:sizeA:dd':
            "She's medium-sized, not smallest — she can't be homozygous small for all three genes.",
        },
      },
    },

    // Solo poses a polygenic TESTCROSS — same test-cross reasoning as Ch 2,
    // now scaled to three additive genes. Mystery medium-sized mother × known
    // smallest father (0 large alleles). Every offspring gets d/e/v from the
    // father, so offspring sizes range 0-3 depending on which allele the
    // mother contributes. Extremes at both ends confirm the mother is
    // heterozygous on every gene.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sizeA: ['D', 'd'],
            sizeB: ['E', 'e'],
            sizeC: ['V', 'v'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
          },
          defaultName: 'Medium mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sizeA: ['d', 'd'],
            sizeB: ['e', 'e'],
            sizeC: ['v', 'v'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
          },
          defaultName: 'Smallest tester',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sizeA', correctGenotype: 'Dd' },
        { creatureRole: 'mother', geneId: 'sizeB', correctGenotype: 'Ee' },
        { creatureRole: 'mother', geneId: 'sizeC', correctGenotype: 'Vv' },
        { creatureRole: 'father', geneId: 'sizeA', correctGenotype: 'dd' },
        { creatureRole: 'father', geneId: 'sizeB', correctGenotype: 'ee' },
        { creatureRole: 'father', geneId: 'sizeC', correctGenotype: 'vv' },
      ],
      litterSize: 10,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "The father is smallest — 0 large alleles across all three genes. Every offspring inherits only d, e, v from him, so their size depends entirely on the mother's contribution.",
        },
        {
          stage: 'point',
          text: 'If the mother were homozygous large for any gene, the offspring would never inherit its recessive for that gene. Watch for size-0 offspring — those need her to contribute d AND e AND v on the same gamete.',
        },
        {
          stage: 'suggest',
          text: 'Offspring range from size 0 to size 3 → mother must be heterozygous on all three (Dd / Ee / Vv). Enter dd / ee / vv for the smallest-tester father.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['size'],
    nextChapterId: 'ch11',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      sizeA: ['D', 'D'],
      sizeB: ['E', 'E'],
      sizeC: ['V', 'V'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      tailGrowth: ['P', 'P'],
    },
    defaultName: 'Giant Trophy',
  },
}
