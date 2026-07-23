import type { Chapter } from '../types'

// Chapter 10 — Polygenic / Quantitative traits
//
// Size is driven by three additive genes (sizeA, sizeB, sizeC), each with a
// "large" and a "small" allele. Total "large" alleles across all three ranges
// from 0 (smallest) to 6 (largest). This is the first CONTINUOUS-looking
// trait in the game — the bell-curve distribution of offspring size is the
// signature of polygenic inheritance.
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

- **sizeA** (X large / x small)
- **sizeB** (Y large / y small)
- **sizeC** (Z large / z small)

Each "large" allele adds 1 to the total. So an XxYyZz blob (heterozygous for all three) gets 3 out of 6 — a medium blob. An XXYYZZ blob is maximum size (6/6); an xxyyzz blob is smallest (0/6).

Cross two medium (XxYyZz) parents and you get a bell-curve of offspring sizes centred on 3, with 0 and 6 being rare tail events.`,
      workedExample: {
        parents: [
          {
            sizeA: ['X', 'x'],
            sizeB: ['Y', 'y'],
            sizeC: ['Z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
          },
          {
            sizeA: ['X', 'x'],
            sizeB: ['Y', 'y'],
            sizeC: ['Z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
          },
        ],
        narration: [
          'Both parents are XxYyZz — 3 large alleles out of 6.',
          'Offspring range: 0 through 6 large alleles.',
          'Distribution: symmetric around 3, tails at 0 and 6 rarest.',
          'The rare extreme sizes are your evidence that all three genes are heterozygous.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sizeA: ['X', 'x'],
            sizeB: ['Y', 'y'],
            sizeC: ['Z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
          },
          defaultName: 'Medium α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sizeA: ['X', 'x'],
            sizeB: ['Y', 'y'],
            sizeC: ['Z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
          },
          defaultName: 'Medium β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sizeA', correctGenotype: 'Xx' },
        { creatureRole: 'mother', geneId: 'sizeB', correctGenotype: 'Yy' },
        { creatureRole: 'mother', geneId: 'sizeC', correctGenotype: 'Zz' },
        { creatureRole: 'father', geneId: 'sizeA', correctGenotype: 'Xx' },
        { creatureRole: 'father', geneId: 'sizeB', correctGenotype: 'Yy' },
        { creatureRole: 'father', geneId: 'sizeC', correctGenotype: 'Zz' },
      ],
      litterSize: 10,
      scaffolding: {
        onOpen:
          "Both parents are medium-sized. Breed several litters and look for the smallest and largest offspring. If either extreme appears, both parents must be Xx / Yy / Zz.",
        onWrongHypothesis: {
          'mother:sizeA:XX':
            "If she were XX for sizeA, no offspring could ever be xx for that gene — no smallest-size individuals would appear.",
          'mother:sizeA:xx':
            "She's medium-sized, not smallest — she can't be homozygous small for all three genes.",
        },
      },
    },

    // Solo poses a polygenic TESTCROSS — same test-cross reasoning as Ch 2,
    // now scaled to three additive genes. Mystery medium-sized mother × known
    // smallest father (0 large alleles). Every offspring gets x/y/z from the
    // father, so offspring sizes range 0-3 depending on which allele the
    // mother contributes. Extremes at both ends confirm the mother is
    // heterozygous on every gene.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sizeA: ['X', 'x'],
            sizeB: ['Y', 'y'],
            sizeC: ['Z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
          },
          defaultName: 'Medium mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
          },
          defaultName: 'Smallest tester',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sizeA', correctGenotype: 'Xx' },
        { creatureRole: 'mother', geneId: 'sizeB', correctGenotype: 'Yy' },
        { creatureRole: 'mother', geneId: 'sizeC', correctGenotype: 'Zz' },
        { creatureRole: 'father', geneId: 'sizeA', correctGenotype: 'xx' },
        { creatureRole: 'father', geneId: 'sizeB', correctGenotype: 'yy' },
        { creatureRole: 'father', geneId: 'sizeC', correctGenotype: 'zz' },
      ],
      litterSize: 10,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "The father is smallest — 0 large alleles across all three genes. Every offspring inherits only x, y, z from him, so their size depends entirely on the mother's contribution.",
        },
        {
          stage: 'point',
          text: 'If the mother were homozygous large for any gene, the offspring would never inherit its recessive for that gene. Watch for size-0 offspring — those need her to contribute x AND y AND z on the same gamete.',
        },
        {
          stage: 'suggest',
          text: 'Offspring range from size 0 to size 3 → mother must be heterozygous on all three (Xx / Yy / Zz). Enter xx / yy / zz for the smallest-tester father.',
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
      sizeA: ['X', 'X'],
      sizeB: ['Y', 'Y'],
      sizeC: ['Z', 'Z'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      tailGrowth: ['G', 'G'],
    },
    defaultName: 'Giant Trophy',
  },
}
