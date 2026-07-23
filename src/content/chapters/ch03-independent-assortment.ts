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
          { antennae: ['A', 'a'], spots: ['S', 's'] },
          { antennae: ['A', 'a'], spots: ['S', 's'] },
        ],
        narration: [
          'Each parent can produce AS, As, aS, or as gametes — each 25%.',
          'Sixteen cell combinations in the Punnett square.',
          'Group by phenotype: 9 have both traits, 3 have only antennae, 3 have only spots, 1 has neither.',
          'The ratio 9:3:3:1 is the signature of two unlinked heterozygous traits.',
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

    solo: {
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
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Both parents show antennae and spots. But among offspring, four combinations are possible. Which combinations tell you the parents hide recessive alleles?',
        },
        {
          stage: 'point',
          text: 'Watch for offspring lacking antennae, or lacking spots, or lacking both. Those "missing" traits mean each parent is heterozygous for that gene.',
        },
        {
          stage: 'suggest',
          text: 'Cross them many times — 30+ offspring gives a clearer picture. Around 3/16 should lack antennae, 3/16 should lack spots, and 1/16 should lack both.',
        },
      ],
    },

    master: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
          defaultName: 'Advanced Blob',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
          defaultName: 'Advanced Partner',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
        { creatureRole: 'father', geneId: 'spots', correctGenotype: 'Ss' },
      ],
      litterSize: 8,
      // 5 × 8 = 40 offspring. For Aa × Aa with 1/4 recessive per gene,
      // P(no recessive in 40) = (3/4)^40 ≈ 1e-5 per gene. Needing both aa
      // AND ss to appear at least once is now essentially guaranteed.
      breedBudget: 5,
      rewardMentorDialogue:
        "That's efficient dihybrid work. Prof. Weaver will be impressed.",
    },
  },

  unlocks: {
    traits: ['spots'],
    tools: ['punnett-4x4'],
    mentors: ['prof-weaver'],
    nextChapterId: 'ch04',
  },
}
