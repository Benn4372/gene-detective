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
          { antennae: ['A', 'A'], spots: ['s', 's'] },
          { antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Show walkthrough: mystery mother turns out to be AA.',
          'Every gamete she produces is A. Test father is aa — every gamete is a.',
          'Every single offspring is Aa. All show antennae. Zero recessive kids.',
          'That "clean sweep" is Case A — mother is homozygous. Guided runs the same test cross but with a Case B mother.',
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

    // Solo re-tests test-cross reasoning with a mystery blob whose test cross
    // reveals HOMOZYGOSITY instead: every offspring gets antennae, so the
    // mystery mother must be AA (not Aa).
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { antennae: ['A', 'A'], spots: ['s', 's'] },
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
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'AA' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "This mystery mother shows antennae — same as before, could be AA or Aa. Run the same test cross and see what the offspring say.",
        },
        {
          stage: 'point',
          text: "Under Aa × aa you'd expect roughly half the offspring to lack antennae. But if EVERY offspring has antennae across a big litter, that argues she can't have any 'a' at all.",
        },
        {
          stage: 'suggest',
          text: "Every child has antennae over many crosses → mother must be AA. Enter AA for the mother, aa for the known test partner.",
        },
      ],
    },
  },

  unlocks: {
    tools: ['test-cross'],
    nextChapterId: 'ch03',
  },
}
