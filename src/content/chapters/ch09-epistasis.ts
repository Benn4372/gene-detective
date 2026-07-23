import type { Chapter } from '../types'

// Chapter 9 — Epistasis
//
// A second gene (coatPigment) masks the color gene: a cc individual is yellow
// regardless of its R/w alleles. The player sees a body colour that isn't
// predicted by the color gene alone — the classic epistasis puzzle.
export const ch09: Chapter = {
  id: 'ch09',
  order: 9,
  tier: 'curious',
  concept: 'Epistasis — one gene masking another',
  title: 'The gene above the gene',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, sliding a photo of a bright yellow blob across the bench:
"Two red parents. Yellow child. Red doesn't turn into yellow under the color model we know. So something else is going on."
"Meet **coatPigment**. When both copies are recessive — cc — the whole colour system is switched off. Yellow, regardless of the color gene."`,

  storyOutro: `Prof. Weaver:
"That's epistasis. One gene controls whether another can express at all. In real biology it's everywhere — blood types, coat colours, disease modifiers."
"Ten chapters in. Time to zoom out."`,

  pinnedGlossaryTerms: [
    'epistasis',
    'gene-interaction',
    'phenotype',
    'genotype',
  ],

  stages: {
    show: {
      body: `**Epistasis** is when one gene interferes with another gene's expression. The masked gene may be "expressed" in a genetic sense — the alleles are there — but its phenotypic output is overridden.

The coatPigment gene has two alleles:

- **CC or Cc** → pigment produced. The color gene expresses normally (RR = red, Rw = pink, ww = white).
- **cc** → no pigment produced. Colour system off — blob is **yellow** regardless of R/w.

So a yellow blob could be RR, Rw, or ww for the color gene. You can't tell from looking. But breeding a yellow to a red-with-CC can tell you a lot.`,
      workedExample: {
        parents: [
          {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
          },
          {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
          },
        ],
        narration: [
          'Both parents look red — RR for color, Cc for coatPigment.',
          'Cross them: 3/4 of offspring inherit at least one C (pigment on) → red.',
          '1/4 of offspring are cc (pigment off) → yellow.',
          "Yellow appears even though NEITHER parent is 'yellow' — that's the epistasis fingerprint.",
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'Red Cc α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
          },
          defaultName: 'Red Cc β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'coatPigment', correctGenotype: 'Cc' },
        { creatureRole: 'father', geneId: 'coatPigment', correctGenotype: 'Cc' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Both parents look red — no visible yellow. But if any offspring turns yellow, both parents must be carrying a hidden c.",
        onWrongHypothesis: {
          'mother:coatPigment:CC':
            "If she were CC, no offspring could ever be cc. If a yellow child appeared, mother must be Cc.",
          'mother:coatPigment:cc':
            "cc would make her yellow. She's clearly not — she must have at least one C.",
          'father:coatPigment:CC':
            "Same logic — if you've seen a yellow child, father must be Cc.",
          'father:coatPigment:cc':
            "Father looks red, so he can't be cc.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
          },
          defaultName: 'Red Cc α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            color: ['R', 'R'],
            coatPigment: ['C', 'c'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
          },
          defaultName: 'Red Cc β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'coatPigment', correctGenotype: 'Cc' },
        { creatureRole: 'father', geneId: 'coatPigment', correctGenotype: 'Cc' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Two red parents producing a yellow child is impossible under the color gene alone. Something else must be at play.',
        },
        {
          stage: 'point',
          text: 'Yellow means cc for coatPigment. If a yellow offspring appears, both parents must be Cc.',
        },
        {
          stage: 'suggest',
          text: 'Enter Cc for both parents on coatPigment — they mask their heterozygous state as long as one C is around.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['coatPigment'],
    nextChapterId: 'ch10',
  },

  trophyBlobPreset: {
    sex: 'M',
    genotype: {
      color: ['R', 'R'],
      coatPigment: ['c', 'c'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
      fins: ['f', 'f'],
      eyeGlow: ['g'],
    },
    defaultName: 'Yellow Trophy',
  },
}
