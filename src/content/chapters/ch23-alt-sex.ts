import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 23 — Alternative sex determination. ZW, haplodiploidy, temperature-
// dependent. Narrative-only; blob species stays XY.
export const ch23: Chapter = {
  id: 'ch23',
  order: 23,
  tier: 'student',
  concept: 'Alternative sex-determination systems',
  title: 'Not just XY',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Blobs are XY. But birds are ZW. Bees are haplodiploid. Alligators use temperature. Sex isn't just chromosomes."`,

  storyOutro: `Prof. Weaver:
"You've completed the Student tier's inheritance-pattern block. Chromosomes themselves next — what happens when the mechanics go wrong at that scale."`,

  pinnedGlossaryTerms: ['sex-determination', 'zw-system', 'haplodiploidy'],

  stages: {
    show: {
      body: `Blobs use **XY** — father determines sex (XX = ♀, XY = ♂). But other systems exist:

- **ZW**: mother determines sex (birds, some reptiles).
- **Haplodiploid**: unfertilized eggs become males (bees, wasps).
- **Temperature-dependent**: egg incubation temperature decides (alligators, turtles).

Real biology has more than one answer for the same problem.`,
    },
    guided: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] }, defaultName: 'Blob ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, antennae: ['a', 'a'] }, defaultName: 'Blob ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'aa' },
      ],
      litterSize: 6,
      scaffolding: { onOpen: 'Standard testcross under XY. Note the ratio still holds — sex system doesn\'t override Mendel.', onWrongHypothesis: {} },
    },
    // Solo: both antennae-bearing parents — some non-antennae offspring
    // reveal both are heterozygous. Different structure from guided's
    // testcross — still a Mendelian puzzle to reinforce that alternative
    // sex-determination systems don't rewrite the inheritance math.
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] }, defaultName: 'Antenna mother' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, antennae: ['A', 'a'] }, defaultName: 'Antenna father' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'antennae', correctGenotype: 'Aa' },
        { creatureRole: 'father', geneId: 'antennae', correctGenotype: 'Aa' },
      ],
      litterSize: 6,
      validationTier: 'loose',
      hints: [{ stage: 'reframe', text: 'Both parents show antennae. Some offspring don\'t — both parents must be Aa.' }, { stage: 'point', text: 'About 1 in 4 offspring should lack antennae.' }, { stage: 'suggest', text: 'Aa mother, Aa father.' }],
    },
  },
  unlocks: { nextChapterId: 'ch24' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, antennae: ['A', 'a'] },
    defaultName: 'Sex-system Trophy',
  },
}
