import type { Chapter } from '../types'

// Chapter 11 — Environmental / Penetrance
//
// The heatSpot gene has an environmentalThreshold of 70: below that, even H
// individuals look plain. The player must experiment with the temperature
// slider to reveal the trait — genotype alone doesn't guarantee expression.
export const ch11: Chapter = {
  id: 'ch11',
  order: 11,
  tier: 'curious',
  concept: 'Environmental effects on phenotype expression',
  title: 'Genes plus environment',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, adjusting the Station thermostat:
"Two blobs here. At room temperature they both look plain. But watch what happens when I warm the room…"
"Genotype tells you what a blob is CAPABLE of. Environment decides whether it actually shows up."`,

  storyOutro: `Prof. Weaver:
"Genotype × Environment. That's the shape of every real phenotype. Height, disease risk, coat colour on a Siamese cat — always both."
"Just one more chapter in the Curious tier — populations. Then you're a Student."`,

  pinnedGlossaryTerms: [
    'environmental-effect',
    'penetrance',
    'expressivity',
    'norm-of-reaction',
  ],

  stages: {
    show: {
      body: `Some genes only express under the right environmental conditions. Our **heatSpot** gene is one: at cold or temperate temperatures, even an H allele looks like h. The heat spot only appears when the ambient temperature climbs above **70**.

That means:

- At **cold** temperatures (< 70), you can't tell H apart from h — everyone looks plain.
- At **warm** temperatures (≥ 70), the H allele finally expresses: a bright glowing spot.

Try dragging the temperature slider on the workbench. Genotypes stay the same; phenotypes change.`,
      workedExample: {
        parents: [
          {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
          {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
        ],
        narration: [
          'Both parents are Hh — hetero for heatSpot.',
          'At room temperature, both LOOK plain — the H allele is silent.',
          'Turn up the heat past 70° and the H reveals itself in the parents.',
          'Offspring: 25% HH, 50% Hh, 25% hh — but only 75% show the spot when warm.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
          defaultName: 'Hh α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
          defaultName: 'Hh β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'heatSpot', correctGenotype: 'Hh' },
        { creatureRole: 'father', geneId: 'heatSpot', correctGenotype: 'Hh' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "Drag the temperature slider from cold to warm and watch the parents. Their phenotype changes — but their genotype hasn't.",
        onWrongHypothesis: {
          'mother:heatSpot:hh':
            "At warm temperature the mother clearly shows a heat spot — she must carry at least one H.",
          'mother:heatSpot:HH':
            "If HH, no offspring could ever be plain even at warm temp. Have you seen a plain offspring at warm temp? Then she's Hh.",
          'father:heatSpot:hh':
            "Same as the mother — turn the temperature up and check.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g', 'g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
          defaultName: 'Hh α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            heatSpot: ['H', 'h'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
            pattern: ['B', 'B'],
            horns: ['n', 'n'],
            fins: ['f', 'f'],
            eyeGlow: ['g'],
            tailGrowth: ['G', 'G'],
            sizeA: ['x', 'x'],
            sizeB: ['y', 'y'],
            sizeC: ['z', 'z'],
          },
          defaultName: 'Hh β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'heatSpot', correctGenotype: 'Hh' },
        { creatureRole: 'father', geneId: 'heatSpot', correctGenotype: 'Hh' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "You have a genotype puzzle AND an environmental puzzle. Under one condition you can't distinguish HH from Hh from hh at all.",
        },
        {
          stage: 'point',
          text: 'Raise the temperature above 70° first. Now you can see the H phenotype. What do the parents show, and what do plain offspring tell you?',
        },
        {
          stage: 'suggest',
          text: 'Both parents are Hh. At warm temp both show the spot; a fraction of offspring will be plain (hh) — that fraction proves each parent carries an h.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['heatSpot'],
    tools: ['environment-slider'],
    nextChapterId: 'ch12',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      heatSpot: ['H', 'H'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      tailGrowth: ['G', 'G'],
      sizeA: ['x', 'x'],
      sizeB: ['y', 'y'],
      sizeC: ['z', 'z'],
    },
    defaultName: 'Heat-Spot Trophy',
  },
}
