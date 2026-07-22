import type { Lesson } from './types'

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    slug: 'simple-dominance',
    order: 1,
    title: 'One trait, two versions',
    concept: 'Simple dominant / recessive inheritance',
    intro: `Meet your first two blobs. One has antennae, one doesn't. If you breed them, what do you get?

Blobs, like all animals, carry two copies of every gene — one from each parent. Different versions of the same gene are called alleles. Some alleles are "dominant" — if a blob has even one copy, the trait shows up. Others are "recessive" — they only show up when a blob has two copies.

Your job: figure out what the invisible alleles are inside these two blobs. You can breed them, look at their offspring, and fill in your Notebook. The Notebook only accepts a genotype when your breeding results actually support it.`,
    pinnedGlossaryTerms: [
      'chromosome',
      'gene',
      'allele',
      'genotype',
      'phenotype',
      'dominant',
      'recessive',
      'homozygous',
      'heterozygous',
    ],
    starterCreatures: [
      {
        role: 'mother',
        sex: 'F',
        genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Blob A',
      },
      {
        role: 'father',
        sex: 'M',
        genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Blob B',
      },
    ],
    litterSize: 6,
    correctAssertions: [
      { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
      { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
    ],
    validationTier: 'medium',
    hints: [
      {
        stage: 'reframe',
        text: 'Two things are true at once: the mother shows the antennae trait, and the father doesn\'t. What must each of those tell you about which alleles they carry?',
      },
      {
        stage: 'point',
        text: 'Focus on which parent could possibly be hiding a recessive allele. A parent who shows a recessive trait is easy — but a parent showing a dominant trait might be homozygous, or might be hiding one recessive copy.',
      },
      {
        stage: 'suggest',
        text: 'Count offspring across every litter you\'ve bred. Group them by whether they show the trait or not. What ratio would you expect if the mother were fully homozygous? Does the actual ratio match that, or something else?',
      },
    ],
    unlocks: {
      orderTypes: ['tier-1'],
      characters: ['dr-mendel'],
    },
    gateOrderIds: ['order-mendel-1', 'order-mendel-2'],
  },
  {
    id: 'lesson-2',
    slug: 'punnett-test-cross',
    order: 2,
    title: 'The test cross',
    concept: 'Punnett squares and test crosses',
    intro: `A Punnett square is a grid showing every possible offspring from a cross. Along the top go one parent's gametes; down the side, the other parent's. Each cell is one possible outcome.

Here's a mystery: you have a blob with antennae. But does it have two "A" alleles (AA), or one "A" and one hidden "a" (Aa)? Both look identical on the outside.

The trick is a **test cross** — breed the mystery blob with one that has no antennae (aa). If any offspring lack antennae, the mystery blob must be carrying a hidden "a" allele. Do the cross a few times; the notebook is watching.`,
    pinnedGlossaryTerms: [
      'punnett-square',
      'gamete',
      'test-cross',
      'monohybrid-cross',
      'homozygous',
      'heterozygous',
    ],
    starterCreatures: [
      {
        role: 'mother',
        sex: 'F',
        genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Mystery Blob',
      },
      {
        role: 'father',
        sex: 'M',
        genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Test Partner',
      },
    ],
    litterSize: 6,
    correctAssertions: [
      { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
    ],
    validationTier: 'medium',
    hints: [
      {
        stage: 'reframe',
        text: 'The mystery blob shows antennae. Only two options: AA or Aa. Which offspring pattern would each predict?',
      },
      {
        stage: 'point',
        text: 'If the mystery blob is AA, every offspring gets antennae. If it\'s Aa, about half will lack antennae. Count carefully.',
      },
      {
        stage: 'suggest',
        text: 'Cross them several more times. If any offspring lack antennae, the mystery blob is Aa. Enter that in the notebook.',
      },
    ],
    unlocks: {},
    gateOrderIds: [],
  },
  {
    id: 'lesson-3',
    slug: 'independent-assortment',
    order: 3,
    title: 'Two genes, no interference',
    concept: 'Independent assortment of unlinked traits',
    intro: `Now let's track two traits at once. Both parents show antennae AND spots. But maybe they're carrying hidden recessive alleles for one or both.

Here's the surprise: because these two genes sit on different chromosomes, they get shuffled independently when gametes form. The antennae outcome doesn't influence the spots outcome, and vice versa.

Breed the pair and see what happens. In a two-trait cross like this, the classic phenotype ratio is 9:3:3:1 — but that's the expected pattern, not what any single litter will look like. Watch for it over multiple crosses. Fill in both genotypes for both parents.`,
    pinnedGlossaryTerms: [
      'dihybrid-cross',
      'independent-assortment',
      'f1-generation',
      'f2-generation',
      'true-breeding',
    ],
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
    litterSize: 8,
    correctAssertions: [
      { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
      { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
      { creatureRole: 'mother', geneId: 'spots', correctGenotype: 'Ss' },
      { creatureRole: 'father', geneId: 'spots', correctGenotype: 'Ss' },
    ],
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
    unlocks: {},
    gateOrderIds: [],
  },
]

export const lessonById: Record<string, Lesson> = Object.fromEntries(
  lessons.map(l => [l.id, l]),
)
