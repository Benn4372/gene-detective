import type { Chapter } from '../types'

// Chapter 7 — Sex-Linked Inheritance
//
// The eyeGlow gene sits on the X chromosome. XY males carry only one allele
// (hemizygous — phenotype directly reveals the allele). XX females carry two.
// The classic pattern: recessive X-linked traits are far more common in sons
// than daughters.
export const ch07: Chapter = {
  id: 'ch07',
  order: 7,
  tier: 'curious',
  concept: 'Sex-linked inheritance on the X chromosome',
  title: 'Riding the X',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, holding up two field-note photos side by side:
"Sons of glowing-eye mothers are glowing about half the time. Daughters — always glowing. What's going on?"
"The eyeGlow gene is on the X chromosome. Males only have one X, so what they inherit shows up. No hiding."`,

  storyOutro: `Prof. Weaver:
"Sex-linked recessives sneak through carrier mothers to their sons. It's the fingerprint of an X-linked gene."
"Now the fun starts: what if two genes ride the same chromosome?"`,

  pinnedGlossaryTerms: [
    'sex-linked',
    'x-linked',
    'hemizygous',
    'carrier',
  ],

  stages: {
    show: {
      body: `**Sex-linked** genes sit on the X or Y chromosome. Because XY males carry only ONE X, they only have one copy of every X-linked gene — they're **hemizygous**. Whatever's on that X shows up in their phenotype.

Females (XX) carry two copies, so they can be homozygous, heterozygous, or a hidden carrier.

Our eyeGlow gene: **G** (glow, dominant) and **g** (no glow, recessive), both on the X chromosome.

Cross a heterozygous Gg mother with a glowing G father, and watch:

- **Sons** get their X only from mom. Half get G (glow), half get g (no glow).
- **Daughters** get an X from each parent. Dad gives G; mom gives G or g. All are Gg or GG — all glow.

That asymmetry — recessive phenotype surfacing mostly in sons — is the fingerprint of X-linked inheritance.`,
      workedExample: {
        parents: [
          {
            eyeGlow: ['G', 'g'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
          {
            eyeGlow: ['G'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
        ],
        narration: [
          'Mother is Gg on her two Xs — glows, but carries g.',
          'Father is G (hemizygous, single X) — glows.',
          'Sons: mom gives G or g → 50/50 glow vs no glow.',
          'Daughters: dad gives G, mom gives G or g → all glow.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            eyeGlow: ['G', 'g'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
          defaultName: 'Carrier α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            eyeGlow: ['G'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
          defaultName: 'Glow β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'G' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Both parents glow. Watch for sons who DON'T glow — their existence means mother must be carrying a hidden g.",
        onWrongHypothesis: {
          'mother:eyeGlow:GG':
            "If she were GG, every son would glow (they can only inherit her G). Have you seen a non-glowing son? If yes, she's Gg.",
          'mother:eyeGlow:gg':
            "She visibly glows, so she can't be gg — she must have at least one G.",
          'father:eyeGlow:Gg':
            'The father is XY — he only has ONE X-linked allele, not two. Enter just G.',
          'father:eyeGlow:GG':
            'Same reason: XY males are hemizygous on X. One allele only. Enter G.',
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            eyeGlow: ['G', 'g'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
          defaultName: 'Carrier α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            eyeGlow: ['G'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            color: ['w', 'w'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
          },
          defaultName: 'Glow β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'eyeGlow', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'eyeGlow', correctGenotype: 'G' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Both parents glow. Fathers with only one X show whatever allele they have. Mothers with two Xs can hide a recessive.',
        },
        {
          stage: 'point',
          text: 'Watch offspring by sex. If any SONS lack the glow, the mother must be Gg.',
        },
        {
          stage: 'suggest',
          text: 'Enter Gg for the mother and G for the father (males have only one X-linked allele).',
        },
      ],
    },
  },

  unlocks: {
    traits: ['eyeGlow'],
    nextChapterId: 'ch08',
  },

  trophyBlobPreset: {
    sex: 'M',
    genotype: {
      eyeGlow: ['G'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      color: ['w', 'w'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
    },
    defaultName: 'Glow-eye Trophy',
  },
}
