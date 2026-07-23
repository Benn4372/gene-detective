import type { Chapter } from '../types'

// Common genotype scaffold used by Ch14+ chapter starters. Fills every gene
// with a neutral homozygous-recessive default so the chapter's focus stands
// out visually without carrying over unrelated traits.
const NEUTRAL: Record<string, string[]> = {
  antennae: ['a', 'a'],
  spots: ['s', 's'],
  tail: ['t', 't'],
  fins: ['f', 'f'],
  eyeGlow: ['g', 'g'],
  tailGrowth: ['P', 'P'],
  heatSpot: ['h', 'h'],
  sparkle: ['k', 'k'],
}
const NEUTRAL_MALE: Record<string, string[]> = { ...NEUTRAL, eyeGlow: ['g'] }

// Chapter 14 — Lethal alleles
//
// CC homozygotes die before observation. Cc × Cc crosses show a 2:1
// yellow:dark ratio (instead of 3:1) because the CC quarter is missing.
// Symbol C (Coat) — Y was reused elsewhere in the codex.
export const ch14: Chapter = {
  id: 'ch14',
  order: 14,
  tier: 'student',
  concept: 'Lethal alleles — offspring that never appear',
  title: 'The class that isn’t there',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, gravely:
"Two yellow parents. You'd expect 3 yellow : 1 dark. But we see 2 : 1. Something's culling the offspring."
"The C allele. Homozygous CC is lethal — never observed. Only Cc and cc survive."`,

  storyOutro: `Prof. Weaver:
"Lethal alleles hide behind ratio distortions. If your Punnett predicts 3:1 and you see 2:1, suspect a lethal in the missing class."
"Welcome to the Student tier."`,

  pinnedGlossaryTerms: ['lethal-allele', 'ratio-distortion'],

  stages: {
    show: {
      body: `A **lethal allele** kills its homozygous carriers before they can be observed. Cross two heterozygous Cc parents and, by Punnett, expect 1 CC : 2 Cc : 1 cc. But CC dies in utero — so among LIVE offspring you see 2 Cc : 1 cc. Yellow to dark is 2:1, not 3:1.

The recessive-phenotype fraction rises from 1/4 to 1/3. That deviation is the fingerprint.

The show walkthrough starts from a **known-carrier × dark** cross (no lethality) so you can see the baseline 1:1 ratio first. Guided then hands you two yellow parents and asks you to spot the missing quarter.`,
      workedExample: {
        parents: [
          { ...NEUTRAL, lethalCoat: ['C', 'c'] },
          { ...NEUTRAL_MALE, lethalCoat: ['c', 'c'] },
        ],
        narration: [
          'Mother is Cc — yellow. Father is cc — dark. No CC in play.',
          'Every offspring inherits c from father; C or c from mother.',
          'Result: 50% Cc (yellow) : 50% cc (dark). Clean 1:1 — no lethality.',
          'Remember this baseline. When both parents are Cc, the ratio shifts to 2:1.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { ...NEUTRAL, lethalCoat: ['C', 'c'] },
          defaultName: 'Yellow-coat α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { ...NEUTRAL_MALE, lethalCoat: ['C', 'c'] },
          defaultName: 'Yellow-coat β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'lethalCoat', correctGenotype: 'Cc' },
        { creatureRole: 'father', geneId: 'lethalCoat', correctGenotype: 'Cc' },
      ],
      litterSize: 12,
      scaffolding: {
        onOpen:
          "Two yellow parents. Cross them; expect the surviving-offspring ratio to be 2 yellow : 1 dark, not 3 : 1.",
        onWrongHypothesis: {
          'mother:lethalCoat:CC':
            "If she were CC, she'd be dead — CC is lethal. She's alive and yellow, so Cc.",
          'father:lethalCoat:CC':
            "Same — CC is lethal. Cc.",
        },
      },
    },

    // Solo swaps to a lethal TEST CROSS: yellow Cc mother × dark cc father.
    // No CC lethality involved this time. Cross gives clean 50% Cc (yellow) :
    // 50% cc (dark). The 2:1 signature only shows in Cc × Cc — this puzzle
    // teaches that the ratio distortion needs BOTH parents heterozygous.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: { ...NEUTRAL, lethalCoat: ['C', 'c'] },
          defaultName: 'Yellow mystery',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: { ...NEUTRAL_MALE, lethalCoat: ['c', 'c'] },
          defaultName: 'Dark father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'lethalCoat', correctGenotype: 'Cc' },
        { creatureRole: 'father', geneId: 'lethalCoat', correctGenotype: 'cc' },
      ],
      litterSize: 12,
      validationTier: 'medium',
      hints: [
        { stage: 'reframe', text: 'A yellow mother × dark father. No CC lethality here — the father can only contribute c.' },
        { stage: 'point', text: 'Observed 50/50 yellow:dark → mother is Cc (heterozygous). If she were CC, every offspring would be yellow (Cc).' },
        { stage: 'suggest', text: 'Enter Cc for mother, cc for father.' },
      ],
    },
  },

  unlocks: {
    traits: ['lethalCoat'],
    nextChapterId: 'ch15',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { ...NEUTRAL, lethalCoat: ['C', 'c'] },
    defaultName: 'Yellow-carrier Trophy',
  },
}
