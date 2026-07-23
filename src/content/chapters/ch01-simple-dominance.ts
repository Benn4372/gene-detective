import type { Chapter } from '../types'

// Chapter 1 — Simple Dominance
//
// The four-stage arc for the very first concept. Introductory — no Master
// stage; the Solo stage's completion is enough to advance.
export const ch01: Chapter = {
  id: 'ch01',
  order: 1,
  tier: 'curious',
  concept: 'Simple dominant / recessive inheritance',
  title: 'One trait, two versions',
  mentorId: 'dr-mendel',

  storyIntro: `Dr. Mendel, warmly, over a chipped mug of tea:
"Welcome to the Station. There's something a little off about the wild blobs lately, but before we go chasing anomalies — you need the basics."
"Here's a pair I found this morning. One has antennae, one doesn't. Cross them for me?"`,

  storyOutro: `Dr. Mendel, nodding at the chalkboard:
"Good. You've made your first proper deduction from evidence. That mother was carrying a hidden 'a' allele — invisible to the eye but plain in her offspring."
"Keep that idea. It's going to come up a lot."`,

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

  stages: {
    show: {
      body: `Every blob carries **two copies** of every gene — one from its mother, one from its father. Different versions of the same gene are called **alleles**.

Some alleles are **dominant** — if a blob has even one copy, the trait shows up. Others are **recessive** — they only show up when the blob has two copies of them.

We write dominant alleles as capital letters (A) and recessive as lowercase (a). A blob's **genotype** is what it carries. Three combinations are possible:

- **AA** — two copies of the dominant allele. Called **homozygous dominant**.
- **aa** — two copies of the recessive allele. Called **homozygous recessive**.
- **Aa** — one of each. Called **heterozygous**.

("Homo" means same, "hetero" means different.) A blob's **phenotype** is what you see. AA and Aa both look the same because A is dominant — but they're not the same underneath.

Below, watch a cross between AA × aa. Every offspring inherits one allele from each parent — so every child ends up **Aa** (heterozygous). They all show the dominant trait, but every single one is secretly carrying a recessive.`,
      workedExample: {
        parents: [
          { antennae: ['A', 'A'], spots: ['s', 's'] },
          { antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Mother is AA — she can only pass A.',
          'Father is aa — he can only pass a.',
          'Every offspring gets one from each: Aa.',
          'Every offspring shows antennae. But every one is a hidden carrier.',
        ],
      },
    },

    guided: {
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
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Look at the two blobs. The mother has antennae; the father doesn't. What genotype MUST the father have? (Hint: he's showing the recessive trait, so he must be homozygous recessive.)",
        onWrongHypothesis: {
          'mother:antennae:AA':
            "Not quite. If she were AA, every one of her offspring would show antennae. Cross them a few times and count how many offspring lack antennae.",
          'mother:antennae:aa':
            "But she visibly HAS antennae — so she must have at least one A allele. She can't be aa.",
          'father:antennae:Aa':
            "The father doesn't show antennae. He must be homozygous recessive — aa.",
          'father:antennae:AA':
            "The father doesn't show antennae. He can't have any A allele.",
        },
      },
    },

    solo: {
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
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "Two things are true at once: the mother shows the antennae trait, and the father doesn't. What must each of those tell you about which alleles they carry?",
        },
        {
          stage: 'point',
          text: "Focus on which parent could possibly be hiding a recessive allele. A parent who shows a recessive trait is easy — but a parent showing a dominant trait might be homozygous, or might be hiding one recessive copy.",
        },
        {
          stage: 'suggest',
          text: "Count offspring across every litter you've bred. Group them by whether they show the trait or not. What ratio would you expect if the mother were fully homozygous? Does the actual ratio match that, or something else?",
        },
      ],
    },

    // No master stage on Chapter 1 — we want the very first chapter to be a
    // gentle onboarding.
  },

  unlocks: {
    traits: ['antennae'],
    // The Punnett square is taught in Ch 2 but has to be USABLE in Ch 2's
    // guided/solo stages, so unlock it on Ch 1 completion.
    tools: ['punnett-2x2'],
    nextChapterId: 'ch02',
  },
}
