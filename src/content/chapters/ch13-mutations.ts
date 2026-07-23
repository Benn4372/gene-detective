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
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            heatSpot: ['h', 'h'],
          },
          {
            sparkle: ['k', 'k'],
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
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
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'kk α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sparkle: ['k', 'k'],
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'kk β',
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

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            sparkle: ['k', 'k'],
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'kk α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            sparkle: ['k', 'k'],
            color: ['w', 'w'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            coatPigment: ['C', 'C'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
            heatSpot: ['h', 'h'],
          },
          defaultName: 'kk β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'sparkle', correctGenotype: 'kk' },
        { creatureRole: 'father', geneId: 'sparkle', correctGenotype: 'kk' },
      ],
      litterSize: 10,
      validationTier: 'loose',
      hints: [
        {
          stage: 'reframe',
          text: "Neither parent shows the sparkle. Under normal rules that would mean neither can produce a sparkling child. But you've seen mutation exists.",
        },
        {
          stage: 'point',
          text: 'The parent genotype is exactly what you see — kk. The occasional sparkling offspring is not evidence they were hiding a K; it\'s evidence of a k→K mutation event.',
        },
        {
          stage: 'suggest',
          text: 'Enter kk for both parents. The sparkling offspring you saw came from a spontaneous mutation.',
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
      color: ['w', 'w'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      coatPigment: ['C', 'C'],
      sizeA: ['x', 'x'],
      sizeB: ['y', 'y'],
      sizeC: ['z', 'z'],
      heatSpot: ['h', 'h'],
    },
    defaultName: 'Mutation Trophy',
  },
}
