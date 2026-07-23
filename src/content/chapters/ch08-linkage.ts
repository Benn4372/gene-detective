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
            antennae: ['A', 'A'],
            fins: ['F', 'F'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g', 'g'],
          },
          {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g'],
          },
        ],
        narration: [
          'Show walkthrough: pure AF/AF × pure af/af — the parent generation that sets up coupling phase.',
          'Every mother-gamete is AF (both dominants on the same homolog). Every father-gamete is af.',
          "Every F1 offspring is AF/af — dominant on both, alleles physically linked in coupling.",
          "Guided then crosses that F1 back to a recessive tester and you watch how tightly the alleles stay together (~95% parental, ~5% recombinant).",
        ],
      },
    },

    guided: {
      // Coupling phase: dominants together on one homolog (AF), recessives
      // on the other (af). Offspring will show mostly parental phenotypes.
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            antennae: ['A', 'a'],
            fins: ['F', 'f'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'Linked mother α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g'],
          },
          defaultName: 'Recessive tester',
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

    // Solo swaps the linkage PHASE. Repulsion: dominants on OPPOSITE homologs
    // (Af on one, aF on the other). Same per-gene genotypes as guided (Aa Ff),
    // but the parental gamete classes flip — the rare classes are now AF and
    // af, while Af and aF dominate. Teaches that "linkage" doesn't automatically
    // mean "dominants travel together".
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            antennae: ['A', 'a'],
            fins: ['f', 'F'], // A on homolog 0 paired with f; a on homolog 1 with F
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'Linked mother β',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            antennae: ['a', 'a'],
            fins: ['f', 'f'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            eyeGlow: ['g'],
          },
          defaultName: 'Recessive tester',
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
          text: "Same mother genotype as before — Aa for antennae, Ff for fins — but the PHASE is different. Which pair of gametes will dominate this time?",
        },
        {
          stage: 'point',
          text: 'This mother\'s alleles started as Af on one homolog, aF on the other. The parental gametes are now Af and aF; AF and af are the rare recombinants.',
        },
        {
          stage: 'suggest',
          text: 'The per-gene answer is still Aa Ff for mother and aa ff for father — the change is in which linkage phase the offspring reveal.',
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
      tail: ['t', 't'],
      eyeGlow: ['G', 'G'],
    },
    defaultName: 'Linked-heterozygote Trophy',
  },
}
