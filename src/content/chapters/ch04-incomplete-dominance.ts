import type { Chapter } from '../types'

// Chapter 4 — Incomplete Dominance
//
// First chapter under Prof. Weaver. The color gene demonstrates a heterozygous
// blend (Rw = pink) rather than a simple dominant expression. New body color
// visuals appear immediately.
export const ch04: Chapter = {
  id: 'ch04',
  order: 4,
  tier: 'curious',
  concept: 'Incomplete dominance — heterozygote blends',
  title: 'When neither wins',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, sliding a coloured field-sketch across the bench:
"Good — you're ready. Look at these. Red-body parent, white-body parent, and every child comes out **pink**. Not red. Not white. Pink."
"That's incomplete dominance. Neither allele fully hides the other in the heterozygote."`,

  storyOutro: `Prof. Weaver:
"Two Rw parents → a 1:2:1 ratio of red : pink : white. The heterozygotes look different from either homozygote. Very useful — a phenotype tells you the genotype at a glance."
"Keep this in mind for the codominant traits coming next."`,

  pinnedGlossaryTerms: [
    'incomplete-dominance',
    'heterozygote',
    'phenotype',
    'genotype',
  ],

  stages: {
    show: {
      body: `In **incomplete dominance**, the heterozygote shows a *blended* phenotype — halfway between the two homozygotes.

Our blob color gene has two alleles: **R** (red) and **w** (white). The phenotypes are:

- **RR** → red body
- **Rw** → pink body (blend)
- **ww** → white body

Cross a pink Rw with another pink Rw, and you get a clean **1 : 2 : 1** ratio of red : pink : white. Every offspring's genotype is visible on its face — that's the special gift of incomplete dominance.`,
      workedExample: {
        parents: [
          { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Both parents are Rw — visibly pink.',
          'Each parent contributes R or w with 50/50 odds.',
          'Offspring: 25% RR (red), 50% Rw (pink), 25% ww (white).',
          "The heterozygote has its own distinct phenotype — no hidden carriers here.",
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Pink 4-A',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Pink 4-B',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'color', correctGenotype: 'Rw' },
        { creatureRole: 'father', geneId: 'color', correctGenotype: 'Rw' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Both parents look pink. Under incomplete dominance, pink means one of only three possibilities — but only ONE fits. Which?",
        onWrongHypothesis: {
          'mother:color:RR':
            'An RR mother would be visibly RED, not pink. Look at her body colour.',
          'mother:color:ww':
            "A ww mother would be nearly white. She's clearly pink, so she must be heterozygous.",
          'father:color:RR':
            'RR would be red. The father is pink — he must carry one w allele.',
          'father:color:ww':
            "ww would be white. The father is pink, so he can't be homozygous recessive.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Pink 4-A',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Pink 4-B',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'color', correctGenotype: 'Rw' },
        { creatureRole: 'father', geneId: 'color', correctGenotype: 'Rw' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Three possible genotypes — RR, Rw, ww — each with its own phenotype. Two of them are ruled out immediately by the parents\' colour. Which one remains?',
        },
        {
          stage: 'point',
          text: 'You should see red, pink, AND white offspring in the litter. If any category is completely missing, the parents can\'t both be Rw.',
        },
        {
          stage: 'suggest',
          text: 'Look for the 1:2:1 pattern in the phenotype tally. When you see roughly a quarter red, half pink, and a quarter white — record both parents as Rw.',
        },
      ],
    },

    master: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { color: ['R', 'R'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Red Blob',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { color: ['w', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'White Blob',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'color', correctGenotype: 'RR' },
        { creatureRole: 'father', geneId: 'color', correctGenotype: 'ww' },
      ],
      litterSize: 4,
      breedBudget: 2,
      rewardMentorDialogue:
        'A single cross tells the whole story here — every child pink, no hidden alleles.',
    },
  },

  unlocks: {
    traits: ['color'],
    nextChapterId: 'ch05',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Pink Trophy',
  },
}
