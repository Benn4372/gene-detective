import type { Chapter } from '../types'

// Chapter 4 — Incomplete Dominance
//
// The tail-length gene demonstrates a heterozygous blend: Tt = medium tail,
// halfway between the long TT and the short/nub tt. Three distinct visible
// phenotypes, one for each genotype.
export const ch04: Chapter = {
  id: 'ch04',
  order: 4,
  tier: 'curious',
  concept: 'Incomplete dominance — heterozygote blends',
  title: 'When neither wins',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, sliding a stack of field sketches across the bench:
"Good — you're ready. Look at these three. A long-tailed parent, a short-tailed parent, and every child comes out with a **medium** tail. Not long. Not short. Medium — right in between."
"That's incomplete dominance. Neither allele fully hides the other in the heterozygote."`,

  storyOutro: `Prof. Weaver:
"Two Tt parents → a 1 : 2 : 1 ratio of long : medium : short. The heterozygote looks different from either homozygote. Very useful — the phenotype tells you the genotype at a glance."
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

Our tail-length gene has two alleles: **T** (long, dominant partial) and **t** (short, recessive partial). The phenotypes are:

- **TT** → long tail
- **Tt** → medium tail (blend)
- **tt** → short / nub tail

Cross a medium-tail Tt with another medium-tail Tt, and you get a clean **1 : 2 : 1** ratio of long : medium : short. Every offspring's genotype is visible from its tail alone — no hidden carriers.`,
      workedExample: {
        parents: [
          { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Both parents are Tt — visibly medium tails.',
          'Each parent contributes T or t with 50/50 odds.',
          'Offspring: 25% TT (long), 50% Tt (medium), 25% tt (short).',
          "The heterozygote has its own distinct phenotype — no hidden carriers here.",
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Medium-tail α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Medium-tail β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tail', correctGenotype: 'Tt' },
        { creatureRole: 'father', geneId: 'tail', correctGenotype: 'Tt' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Both parents have medium-length tails. Under incomplete dominance, medium means one of only three possibilities — but only ONE fits. Which?",
        onWrongHypothesis: {
          'mother:tail:TT':
            'A TT mother would have a visibly LONG tail, not medium. Look at her tail carefully.',
          'mother:tail:tt':
            "A tt mother would have a short nub. She's clearly medium, so she must be heterozygous.",
          'father:tail:TT':
            'TT would be long. The father is medium — he must carry one t allele.',
          'father:tail:tt':
            "tt would be a short nub. The father is medium, so he can't be homozygous recessive.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Medium-tail α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Medium-tail β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tail', correctGenotype: 'Tt' },
        { creatureRole: 'father', geneId: 'tail', correctGenotype: 'Tt' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "Three possible genotypes — TT, Tt, tt — each with its own tail length. Two of them are ruled out immediately by the parents' medium tails. Which one remains?",
        },
        {
          stage: 'point',
          text: 'You should see long, medium, AND short tails in the litter. If any category is completely missing, the parents can\'t both be Tt.',
        },
        {
          stage: 'suggest',
          text: 'Look for the 1:2:1 pattern in the phenotype tally. When you see roughly a quarter long, half medium, and a quarter short — record both parents as Tt.',
        },
      ],
    },

    master: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { tail: ['T', 'T'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Long-tail Blob',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { tail: ['t', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
          defaultName: 'Short-tail Blob',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tail', correctGenotype: 'TT' },
        { creatureRole: 'father', geneId: 'tail', correctGenotype: 'tt' },
      ],
      litterSize: 4,
      breedBudget: 2,
      rewardMentorDialogue:
        'A single cross tells the whole story here — every child medium, no hidden alleles.',
    },
  },

  unlocks: {
    traits: ['tail'],
    nextChapterId: 'ch05',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Medium-tail Trophy',
  },
}
