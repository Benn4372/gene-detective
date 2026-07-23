import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 24 — Nondisjunction. Chromosomes fail to separate in meiosis,
// producing offspring with the wrong count.
export const ch24: Chapter = {
  id: 'ch24',
  order: 24,
  tier: 'student',
  concept: 'Nondisjunction — chromosome-count changes',
  title: 'Missed the split',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"When homologs fail to separate during meiosis, one gamete carries both, the other carries neither. Fertilise with a normal gamete and you get trisomy or monosomy."`,

  storyOutro: `Prof. Weaver:
"Down syndrome is trisomy 21. Turner syndrome is monosomy X. Nondisjunction is common; almost all cases end pre-birth."`,

  pinnedGlossaryTerms: ['nondisjunction', 'trisomy', 'monosomy', 'aneuploidy'],

  stages: {
    show: {
      body: `**Nondisjunction** is failure of chromosome separation. Normal meiosis: 1+1 alleles per gene from each parent. Nondisjunction: 2+0. Fertilise:

- 2 + 1 = 3 alleles (**trisomy**)
- 0 + 1 = 1 allele (**monosomy**)

Most aneuploidies are lethal in embryo. A few survive with distinctive phenotypes.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] }, defaultName: 'Test-cross mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, antennae: ['A', 'a'] }, defaultName: 'Test-cross father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
      ],
      litterSize: 8,
      scaffolding: { onOpen: 'Standard breeding for now. Nondisjunction is rare and hard to spot from single crosses.', onWrongHypothesis: {} },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] }, defaultName: 'Test-cross mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, antennae: ['A', 'a'] }, defaultName: 'Test-cross father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
      ],
      litterSize: 8,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Standard genotype puzzle.' }, { stage: 'point', text: 'Both showing dominant with recessive offspring means Aa.' }, { stage: 'suggest', text: 'Enter Aa for both.' }],
    },
  },
  unlocks: { tools: ['karyotype-viewer'], nextChapterId: 'ch25' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE },
    defaultName: 'Karyotype Trophy',
  },
  interactionMode: {
    kind: 'karyotype',
    states: {
      'auto-2': 'trisomy',
      'X': 'monosomy',
    },
  },
}
