import type { Chapter } from '../types'

// Chapter 12 — Population Genetics (Hardy-Weinberg)
//
// The first chapter using the PopulationSandbox instead of Workbench. Player
// runs generations of a small population and observes that allele frequencies
// stay constant under random-mating, no-selection assumptions.
export const ch12: Chapter = {
  id: 'ch12',
  order: 12,
  tier: 'curious',
  concept: 'Hardy-Weinberg equilibrium in populations',
  title: 'Frequencies at rest',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, wheeling in a whole population of blobs on a rolling cart:
"Forget one pair for a moment. Here are dozens. What happens to allele frequencies over generations?"
"If nothing pushes them — no selection, no migration, no drift, no mutation — the answer is: nothing. They stay put. That's Hardy-Weinberg."`,

  storyOutro: `Prof. Weaver:
"You've reached the end of the Curious tier. What follows is much darker material — real anomalies in the wild population."
"Take a break. When you're ready, the Student tier begins with lethal alleles."`,

  pinnedGlossaryTerms: [
    'hardy-weinberg',
    'allele-frequency',
    'population',
    'equilibrium',
  ],

  stages: {
    show: {
      body: `A **population** is a group of interbreeding individuals. Instead of tracking one cross, we track the **allele frequency** across everyone.

If a two-allele gene has:

- **p** = frequency of the dominant allele
- **q** = frequency of the recessive allele (p + q = 1)

Then under the Hardy-Weinberg equilibrium the genotype frequencies over time settle at:

- **p²** for the dominant homozygote
- **2pq** for the heterozygote
- **q²** for the recessive homozygote

The catch: this holds ONLY when the population is large, mating is random, and there's no selection / migration / mutation / drift acting.

Use the sandbox below. Change the starting frequency, advance a few generations, watch the bars.`,
      workedExample: {
        parents: [
          {
            color: ['R', 'R'],
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
          'Suppose we start with 50/50 R and w alleles in a large population.',
          'After random mating, the next generation is: p²=25% RR, 2pq=50% Rw, q²=25% ww.',
          'Allele frequencies stay at 50/50 in every subsequent generation.',
          'Break any HW assumption and the frequencies start to drift.',
        ],
      },
    },

    guided: {
      starterCreatures: [],
      correctAssertions: [],
      litterSize: 1,
      scaffolding: {
        onOpen:
          'Run five generations. Watch the allele-frequency bars. Do they drift, or stay?',
        onWrongHypothesis: {},
      },
    },

    solo: {
      starterCreatures: [],
      correctAssertions: [],
      litterSize: 1,
      validationTier: 'loose',
      hints: [],
    },
  },

  unlocks: {
    tools: ['population-sandbox'],
    nextChapterId: 'ch13',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      color: ['R', 'w'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      pattern: ['B', 'B'],
      horns: ['n', 'n'],
      fins: ['f', 'f'],
      eyeGlow: ['G', 'G'],
      coatPigment: ['C', 'C'],
      sizeA: ['X', 'x'],
      sizeB: ['Y', 'y'],
      sizeC: ['Z', 'z'],
      heatSpot: ['h', 'h'],
    },
    defaultName: 'Population Trophy',
  },

  interactionMode: {
    kind: 'population-sandbox',
    focusGeneId: 'color',
    initialDominantFreq: 0.5,
    populationSize: 48,
    generationsToExplore: 5,
  },
}
