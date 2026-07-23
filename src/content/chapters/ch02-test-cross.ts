import type { Chapter } from '../types'

// Chapter 2 — Test Cross
//
// Introduces the concept of a formal test cross. This is the first chapter
// with a Master stage — an efficiency challenge for the player who wants
// deeper mastery.
export const ch02: Chapter = {
  id: 'ch02',
  order: 2,
  tier: 'curious',
  concept: 'Punnett squares and test crosses',
  title: 'The test cross',
  mentorId: 'dr-mendel',

  storyIntro: `Dr. Mendel, sliding a fresh field-note card across the desk:
"Here's a blob I found near the eastern hedgerow. She has antennae — but I can't tell whether she's AA or Aa without knowing more."
"That's exactly the kind of ambiguity a **test cross** is built for. Breed her with a known aa partner and read the answer off her offspring."`,

  storyOutro: `Dr. Mendel:
"Nicely done. When you can't see a genotype, you make it visible through the next generation. Simple, powerful."
"A few of the missions on the board use this. Take a swing when you're ready."`,

  pinnedGlossaryTerms: [
    'punnett-square',
    'gamete',
    'test-cross',
    'monohybrid-cross',
    'homozygous',
    'heterozygous',
  ],

  stages: {
    show: {
      body: `A **Punnett square** is a grid showing every possible offspring from a cross. The parent's possible gametes (single alleles they can pass) go along the top and left; each cell shows one combination.

A **test cross** uses this on purpose. If you have a mystery dominant-looking blob and want to know whether it's AA or Aa, breed it with a known aa. Look at the offspring:

- If the mystery was **AA**, every offspring is Aa — all show the trait.
- If the mystery was **Aa**, about half of offspring are aa — visibly recessive.

The absence or presence of even a single recessive-phenotype offspring is your answer.`,
      workedExample: {
        parents: [
          { antennae: ['A', 'a'], spots: ['s', 's'] },
          { antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Mystery mother is Aa — she passes A or a with 50/50 odds.',
          'Test father is aa — he can only pass a.',
          'About half of offspring are Aa (show antennae). The other half are aa (no antennae).',
          "If ANY offspring lacks antennae, the mystery blob is definitively Aa.",
        ],
      },
    },

    guided: {
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
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Cross the mystery blob with the test partner a few times. If any offspring turn out without antennae, what does that tell you?",
        onWrongHypothesis: {
          'mother:antennae:AA':
            "If she were AA, no offspring would ever lack antennae. But look — some do. She must have a hidden 'a'.",
          'father:antennae:Aa':
            "The test partner was set up as aa on purpose — that's how the test cross works. Enter aa.",
        },
      },
    },

    solo: {
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
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'The mystery blob shows antennae. Only two options: AA or Aa. Which offspring pattern would each predict?',
        },
        {
          stage: 'point',
          text: "If the mystery blob is AA, every offspring gets antennae. If it's Aa, about half will lack antennae. Count carefully.",
        },
        {
          stage: 'suggest',
          text: 'Cross them several more times. If any offspring lack antennae, the mystery blob is Aa. Enter that in the notebook.',
        },
      ],
    },

    master: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
          defaultName: 'Second Mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Test Partner',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 4,
      breedBudget: 3,
      rewardMentorDialogue:
        "Efficient. That's the way real fieldwork is done — no wasted breedings.",
    },
  },

  unlocks: {
    tools: ['test-cross'],
    nextChapterId: 'ch03',
  },
}
