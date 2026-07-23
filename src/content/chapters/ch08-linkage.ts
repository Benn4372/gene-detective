import type { Chapter } from '../types'

// Chapter 8 — Linked genes & Recombination
//
// Antennae and fins sit close together on chromosome 1 (5 cM apart). Under
// linkage, the parental combinations show up disproportionately in offspring;
// recombinant classes (crossovers) are rare. Demonstrates that "independent
// assortment" is only true for genes on different chromosomes.
export const ch08: Chapter = {
  id: 'ch08',
  order: 8,
  tier: 'curious',
  concept: 'Genetic linkage — genes on the same chromosome',
  title: 'Riding together',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, laying out an offspring tally:
"Two dihybrid parents. Textbook says 9 : 3 : 3 : 1. Field results say... very much not."
"The antennae and fins genes sit next to each other on the same chromosome. They don't shuffle independently."`,

  storyOutro: `Prof. Weaver:
"Linked genes travel together most of the time. Only when a crossover event happens between them do you see a recombinant offspring."
"The rate of recombinants tells you how far apart the genes are. Handy — you can map chromosomes just by counting."`,

  pinnedGlossaryTerms: [
    'linkage',
    'recombination',
    'crossover',
    'centimorgan',
  ],

  stages: {
    show: {
      body: `Two genes on the SAME chromosome don't segregate independently. During meiosis, the whole chromosome (well, one of its two homologs) mostly stays intact — the alleles that started together tend to stay together.

**Crossover** events break that up occasionally. During meiotic prophase, homolog pairs swap chunks. The further apart two loci are, the more often a crossover falls between them.

The unit is the **centimorgan (cM)**: 1 cM ≈ 1% recombination frequency. Genes 5 cM apart recombine ~5% of the time; genes 50 cM apart look independent (50% recombination).

Our antennae gene is at locus 50 on chromosome 1. Our new fins gene is at locus 55 — just 5 cM away. That's tight linkage. Expect the parental combinations to dominate.`,
      workedExample: {
        parents: [
          {
            antennae: ['A', 'a'],
            fins: ['F', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g', 'g'],
          },
          {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g'],
          },
        ],
        narration: [
          "Mother's chromosome 1: AF on one homolog, af on the other.",
          'Father is aa ff — pure recessive for both traits.',
          "This is a **testcross**: father's contribution is fixed, so offspring phenotypes directly reveal the mother's gametes.",
          'Expect ~47.5% AF, ~47.5% af — mostly parental. ~2.5% Af, ~2.5% aF — rare recombinants.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            antennae: ['A', 'a'],
            fins: ['F', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'AF/af mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g'],
          },
          defaultName: 'af/af father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'mother', geneId: 'fins', correctGenotype: 'Ff' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
        { creatureRole: 'father', geneId: 'fins', correctGenotype: 'ff' },
      ],
      litterSize: 10,
      scaffolding: {
        onOpen:
          "This is a testcross. Father contributes only recessive alleles, so every offspring shows the mother's gamete directly. Count how many are AF, af, Af, and aF.",
        onWrongHypothesis: {
          'mother:antennae:AA':
            "If she were AA for antennae, every offspring would show antennae. Some don't — she must be Aa.",
          'mother:fins:FF':
            "If she were FF, every offspring would show fins. Some don't — she must be Ff.",
          'father:antennae:Aa':
            "Father is the tester — pure recessive for both traits. Enter aa.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            antennae: ['A', 'a'],
            fins: ['F', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'AF/af mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            eyeGlow: ['g'],
          },
          defaultName: 'af/af father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'mother', geneId: 'fins', correctGenotype: 'Ff' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
        { creatureRole: 'father', geneId: 'fins', correctGenotype: 'ff' },
      ],
      litterSize: 10,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Under independent assortment you\'d expect ~25% of each phenotype class. Under linkage, two classes dominate and two are rare.',
        },
        {
          stage: 'point',
          text: 'The parental combinations (AF and af) are common; the recombinants (Af and aF) are rare. The rare-class frequency ≈ the map distance in cM / 100.',
        },
        {
          stage: 'suggest',
          text: 'The mother is Aa for antennae and Ff for fins — the coupling is AF/af (both dominants on one homolog).',
        },
      ],
    },
  },

  unlocks: {
    traits: ['fins'],
    tools: ['linkage-map'],
    nextChapterId: 'ch09',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      antennae: ['A', 'a'],
      fins: ['F', 'f'],
      spots: ['s', 's'],
      color: ['w', 'w'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
      eyeGlow: ['G', 'G'],
    },
    defaultName: 'Linked-heterozygote Trophy',
  },
}
