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
          { tail: ['T', 'T'], antennae: ['a', 'a'], spots: ['s', 's'] },
          { tail: ['t', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        ],
        narration: [
          'Show walkthrough: long × short (the parent generation).',
          'Mother TT can only pass T. Father tt can only pass t.',
          'Every F1 offspring is Tt — the blended MEDIUM phenotype.',
          'Guided then crosses two Tt mediums together and you watch the 1:2:1 F2 ratio come out — long, medium, short.',
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

    // Solo picks up the storyIntro's teaser — a long-tail parent × short-tail
    // parent. Under incomplete dominance every offspring should come out
    // medium (Tt), showing the F1 blend.
    solo: {
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
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'This time the parents are visually different — one long tail, one short. Under incomplete dominance, each visible extreme corresponds to just one genotype.',
        },
        {
          stage: 'point',
          text: 'Long tail can only be TT (Tt would be medium). Short tail can only be tt. Now what does that predict for every offspring?',
        },
        {
          stage: 'suggest',
          text: 'Every offspring inherits T from the mother and t from the father → every child is Tt (medium). Enter TT for the long-tail mother, tt for the short-tail father.',
        },
      ],
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
