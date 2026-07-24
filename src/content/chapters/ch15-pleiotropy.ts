import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 15 — Pleiotropy. The antennae gene now expresses TWO traits: antennae
// itself, plus a chemical 'metabolism' marker in the Codex. One gene, two
// observable phenotypes.
export const ch15: Chapter = {
  id: 'ch15',
  order: 15,
  tier: 'student',
  concept: 'Pleiotropy — one gene, many effects',
  title: 'One gene, many jobs',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"The antennae gene builds antennae. It also drives an oil-secretion pathway — visible only in a chemistry assay, not on the blob's face. One gene, two very different effects. That's pleiotropy."`,

  storyOutro: `Prof. Weaver:
"You can't select for antennae without also shifting the metabolic marker. In real biology this ties the whole genome together — every gene is doing more than one thing."`,

  pinnedGlossaryTerms: ['pleiotropy'],

  stages: {
    show: {
      body: `A **pleiotropic** gene affects more than one trait. The antennae gene is a classic case: A grows antennae AND boosts a specific metabolic marker; a does neither.

Flip on the **🧪 Metabolism assay** on the workbench below to reveal the marker — a small green chemistry flask on the shoulder of every antennae-carrying blob. Look through the bench: flask and antennae always segregate together, because they're driven by the same gene.

The Codex (📖) also lists the metabolism trait — same genotype table as antennae, because it IS the same gene.`,
    },
    guided: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] },
          defaultName: 'Antenna mystery',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, antennae: ['a', 'a'] },
          defaultName: 'Recessive tester',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen: 'Testcross. Antennae-bearing offspring also carry the A metabolism marker; antennae-less offspring carry the a marker. Same gene.',
        onWrongHypothesis: {
          'mother:antennae:AA': 'AA would give 100% antennae offspring — you saw some without.',
          'father:antennae:Aa': "The tester was set to aa on purpose. Enter aa.",
        },
      },
    },
    // Solo: both antennae-bearing parents (Aa × Aa). Some non-antennae
    // offspring reveal both parents hidden 'a' — and the pleiotropic
    // metabolism marker segregates identically because it's the same gene.
    solo: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] },
          defaultName: 'Antenna pair α',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, antennae: ['A', 'a'] },
          defaultName: 'Antenna pair β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        { stage: 'reframe', text: 'Testcross reveals the mother\'s hidden allele.' },
        { stage: 'point', text: 'Half A-showing offspring means mother is Aa.' },
        { stage: 'suggest', text: 'Enter Aa mother, aa father.' },
      ],
    },
  },
  unlocks: { traits: ['metabolism'], nextChapterId: 'ch16' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] },
    defaultName: 'Pleiotropy Trophy',
  },
}
