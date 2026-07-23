import type { Chapter } from '../types'

// Chapter 3 — Independent Assortment (Dihybrid Cross)
//
// Introduces the 4x4 Punnett and the 9:3:3:1 phenotype ratio. Master stage
// unlocks Prof. Weaver, the Station's second mentor.
export const ch03: Chapter = {
  id: 'ch03',
  order: 3,
  tier: 'curious',
  concept: 'Independent assortment of unlinked traits',
  title: 'Two genes, no interference',
  mentorId: 'dr-mendel',

  storyIntro: `Dr. Mendel, unfurling a chart with a proud little smile:
"Time for two traits at once. Meet these two — both show antennae AND spots. I'd like you to figure out what they're each hiding."
"Because these two genes sit on different chromosomes, they shuffle independently. Watch for the classic 9 : 3 : 3 : 1 pattern."`,

  storyOutro: `Dr. Mendel:
"Wonderful. Two traits, four phenotype combinations, and both parents heterozygous for both genes. That 9:3:3:1 result you saw — it's the fingerprint of independent assortment."
"Prof. Weaver's been eager to meet you. She'll be at the Station starting today."`,

  pinnedGlossaryTerms: [
    'dihybrid-cross',
    'independent-assortment',
    'f1-generation',
    'f2-generation',
    'true-breeding',
  ],

  stages: {
    show: {
      body: `A **dihybrid cross** tracks TWO genes at once. If those genes sit on different chromosomes, each one gets shuffled independently when gametes form — the antennae outcome has nothing to do with the spots outcome.

Each heterozygous parent (AaSs) can produce four possible gametes: AS, As, aS, as — each with 25% probability.

Crossing AaSs × AaSs gives a **4×4 Punnett square** with sixteen cells. When you group offspring by phenotype:

- **9/16** show both dominant traits (antennae AND spots)
- **3/16** show only antennae
- **3/16** show only spots
- **1/16** show neither

You won't see that exactly in any single litter — but over 30+ offspring, the pattern becomes clear.`,
      workedExample: {
        parents: [
          { antennae: ['A', 'A'], spots: ['S', 'S'] },
          { antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Show walkthrough: pure double-dominant × pure double-recessive (the P generation).',
          'Mother AASS makes only AS gametes. Father aass makes only as gametes.',
          'Every F1 offspring is AaSs — a heterozygote on BOTH genes.',
          'Guided then crosses two AaSs F1s and you watch the classic 9:3:3:1 F2 ratio emerge.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
          defaultName: 'Blob 3-A',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
          defaultName: 'Blob 3-B',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
        { creatureRole: 'father', geneId: 'spots', correctGenotype: 'Ss' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Both parents show antennae and spots. Breed them and look for offspring that are MISSING a trait — those tell you the parents were secretly heterozygous.",
        onWrongHypothesis: {
          'mother:antennae:AA':
            "If she were AA for antennae, no offspring could ever lack antennae. But look — some do.",
          'mother:spots:SS':
            "If she were SS for spots, every offspring would have spots. But some don't.",
        },
      },
    },

    // Solo swaps to a DIHYBRID TEST CROSS: the mystery mother has both
    // traits, the father is pure double-recessive. Instead of the 9:3:3:1
    // pattern, expect a clean 1:1:1:1 ratio of the four phenotype classes
    // when the mother is truly AaSs. Every offspring class directly reveals
    // one of her gametes.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
          defaultName: 'Dihybrid Mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Double Recessive',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
        { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
        { creatureRole: 'father', geneId: 'spots', correctGenotype: 'ss' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'The father is fixed at double-recessive (his phenotype gives it away). His gametes are always "as". So every offspring directly reveals ONE of the mother\'s gametes.',
        },
        {
          stage: 'point',
          text: 'Four phenotype classes should appear in offspring: antennae+spots, antennae-only, spots-only, and neither. Under AaSs × aass they arrive in roughly equal 1:1:1:1 proportions.',
        },
        {
          stage: 'suggest',
          text: 'Enter AaSs for the mother (heterozygous on both), and aass for the pure-recessive father.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['spots'],
    tools: ['punnett-4x4'],
    mentors: ['prof-weaver'],
    nextChapterId: 'ch04',
  },
}
