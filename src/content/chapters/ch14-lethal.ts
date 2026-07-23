import type { Chapter } from '../types'

// Common genotype scaffold used by Ch14+ chapter starters. Fills every gene
// with a neutral homozygous-recessive default so the chapter's focus stands
// out visually without carrying over unrelated traits.
const NEUTRAL: Record<string, string[]> = {
  antennae: ['a', 'a'],
  spots: ['s', 's'],
  color: ['w', 'w'],
  pattern: ['B', 'B'],
  horns: ['n', 'n'],
  fins: ['f', 'f'],
  eyeGlow: ['g', 'g'],
  coatPigment: ['C', 'C'],
  sizeA: ['x', 'x'],
  sizeB: ['y', 'y'],
  sizeC: ['z', 'z'],
  heatSpot: ['h', 'h'],
  sparkle: ['k', 'k'],
}
const NEUTRAL_MALE: Record<string, string[]> = { ...NEUTRAL, eyeGlow: ['g'] }

// Chapter 14 — Lethal alleles
//
// YY homozygotes die before observation. Yy × Yy crosses show a 2:1 yellow:
// dark ratio (instead of 3:1) because the YY quarter is missing.
export const ch14: Chapter = {
  id: 'ch14',
  order: 14,
  tier: 'student',
  concept: 'Lethal alleles — offspring that never appear',
  title: 'The class that isn’t there',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, gravely:
"Two yellow parents. You'd expect 3 yellow : 1 dark. But we see 2 : 1. Something's culling the offspring."
"The Y allele. Homozygous YY is lethal — never observed. Only Yy and yy survive."`,

  storyOutro: `Prof. Weaver:
"Lethal alleles hide behind ratio distortions. If your Punnett predicts 3:1 and you see 2:1, suspect a lethal in the missing class."
"Welcome to the Student tier."`,

  pinnedGlossaryTerms: ['lethal-allele', 'ratio-distortion'],

  stages: {
    show: {
      body: `A **lethal allele** kills its homozygous carriers before they can be observed. Cross two heterozygous Yy parents and, by Punnett, expect 1 YY : 2 Yy : 1 yy. But YY dies in utero — so among LIVE offspring you see 2 Yy : 1 yy. Yellow to dark is 2:1, not 3:1.

The recessive-phenotype fraction rises from 1/4 to 1/3. That deviation is the fingerprint.`,
      workedExample: {
        parents: [
          { ...NEUTRAL, lethalCoat: ['Y', 'y'] },
          { ...NEUTRAL_MALE, lethalCoat: ['Y', 'y'] },
        ],
        narration: [
          'Both parents are Yy — both yellow.',
          'Expected: 1 YY : 2 Yy : 1 yy.',
          'YY dies. Observed live offspring: 2 Yy : 1 yy.',
          "The 'missing quarter' is the fingerprint.",
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { ...NEUTRAL, lethalCoat: ['Y', 'y'] },
          defaultName: 'Yellow α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { ...NEUTRAL_MALE, lethalCoat: ['Y', 'y'] },
          defaultName: 'Yellow β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'lethalCoat', correctGenotype: 'Yy' },
        { creatureRole: 'father', geneId: 'lethalCoat', correctGenotype: 'Yy' },
      ],
      litterSize: 12,
      scaffolding: {
        onOpen:
          "Two yellow parents. Cross them; expect the surviving-offspring ratio to be 2 yellow : 1 dark, not 3 : 1.",
        onWrongHypothesis: {
          'mother:lethalCoat:YY':
            "If she were YY, she'd be dead — YY is lethal. She's alive and yellow, so Yy.",
          'father:lethalCoat:YY':
            "Same — YY is lethal. Yy.",
        },
      },
    },

    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { ...NEUTRAL, lethalCoat: ['Y', 'y'] },
          defaultName: 'Yellow α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { ...NEUTRAL_MALE, lethalCoat: ['Y', 'y'] },
          defaultName: 'Yellow β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'lethalCoat', correctGenotype: 'Yy' },
        { creatureRole: 'father', geneId: 'lethalCoat', correctGenotype: 'Yy' },
      ],
      litterSize: 12,
      validationTier: 'medium',
      hints: [
        { stage: 'reframe', text: 'Yellow parents, both showing dominant. Under lethal-YY rules only Yy survives among yellow adults.' },
        { stage: 'point', text: 'Observed 2:1 yellow:dark instead of 3:1 confirms both parents are Yy.' },
        { stage: 'suggest', text: 'Enter Yy for both.' },
      ],
    },
  },

  unlocks: {
    traits: ['lethalCoat'],
    nextChapterId: 'ch15',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { ...NEUTRAL, lethalCoat: ['Y', 'y'] },
    defaultName: 'Yellow-carrier Trophy',
  },
}
