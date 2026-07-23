import type { Chapter } from '../types'

// Chapter 13 — Mutations
//
// The sparkle gene has a nonzero mutationRate. Even from two kk parents, a
// small fraction of gametes flip k→K, so occasional Kk sparkling offspring
// appear. That "impossible" offspring is the fingerprint of mutation.
export const ch13: Chapter = {
  id: 'ch13',
  order: 13,
  tier: 'curious',
  concept: 'Mutation — the source of new alleles',
  title: 'When something new appears',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, tapping a photo of a sparkling child from plain parents:
"Neither parent has the sparkle. The child does. Every genetic rule you've learned says that's impossible."
"Meet mutation. Not a rule-breaker — the rule ITSELF. It's how every allele you've studied came into being at some point in the past."`,

  storyOutro: `Prof. Weaver:
"You've finished the Curious tier. Basics down: dominance, linkage, sex-linkage, environment, populations, mutation. What comes next is where things get strange."
"The Student tier waits. Lethal alleles first — a gene that kills its carriers. See you there."`,

  pinnedGlossaryTerms: [
    'mutation',
    'novel-allele',
    'mutation-rate',
    'spontaneous-variation',
  ],

  stages: {
    show: {
      body: `A **mutation** is a change in a gene's DNA sequence — one allele flipping to another (or to a brand-new one) between generations. It's a rare event per gene per generation, but with lots of genes and lots of individuals, mutations happen constantly.

The sparkle gene in blobs is unusually unstable: about **3%** of gametes carry a mutated allele. That means:

- Two **kk** (non-sparkling) parents can still produce a sparkling **Kk** offspring — the k in a parental gamete flipped to K during meiosis.
- Two **KK** parents can still produce a **Kk** offspring, then a **kk** offspring one generation later.

Cross these two kk parents. Most offspring will be kk (as expected). But among many offspring, some sparkles will appear. That's mutation in action.`,
      workedExample: {
        parents: [
          {
            sparkle: ['k', 'k'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
          {
            sparkle: ['k', 'k'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
        ],
        narration: [
          'Both parents are kk — no sparkle allele between them.',
          'Under classical rules, zero sparkling offspring should ever appear.',
          "But mutation flips k→K in ~3% of gametes. Over enough crosses, sparkling offspring show up.",
          'Every dominant allele in every species started as a mutation once.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sparkle: ['k', 'k'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'Plain mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sparkle: ['k', 'k'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'Plain father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 10,
      scaffolding: {
        onOpen:
          'Both parents show no sparkle. Enter kk for both. Then breed many litters and see whether the "impossible" — a sparkling child — ever happens.',
        onWrongHypothesis: {
          'mother:sparkle:Kk':
            "Look at her — no sparkle. She has to be kk. A sparkling child comes from MUTATION, not from a hidden K.",
          'mother:sparkle:KK':
            "KK would sparkle. She doesn't.",
          'father:sparkle:Kk':
            "Same — the father is plain. He's kk. Any sparkling offspring comes from mutation.",
        },
      },
    },

    // Solo flips the mutation-recognition into a homozygous puzzle. A visibly
    // sparkling mother × plain father — the reverse setup. Almost every
    // offspring sparkles (all Kk), but the rare non-sparkler is the FORWARD
    // mutation (K→k) still teaching the same concept from the other direction.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sparkle: ['K', 'K'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'Sparkle mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sparkle: ['k', 'k'],
            tail: ['t', 't'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['P', 'P'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'Plain father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'KK' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 10,
      validationTier: 'loose',
      hints: [
        {
          stage: 'reframe',
          text: "Mother sparkles, father doesn't. Every offspring inherits k from the father. If mother is KK, every offspring is Kk — every one sparkles.",
        },
        {
          stage: 'point',
          text: 'If you EVER see a plain offspring from many litters, it\'s not because mother is hiding a k — it\'s a K→k mutation.',
        },
        {
          stage: 'suggest',
          text: 'Enter KK for mother, kk for father. Rare plain offspring in the litter tally are the mutation signal.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['sparkle'],
    tools: ['mutation-tracker'],
    nextChapterId: 'ch14',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      sparkle: ['K', 'k'],
      tail: ['t', 't'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      tailGrowth: ['P', 'P'],
      heatSpot: ['h', 'h'],
    },
    defaultName: 'Mutation Trophy',
  },
}
