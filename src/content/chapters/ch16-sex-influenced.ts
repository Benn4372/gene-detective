import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 16 — Sex-influenced traits. The braincrest gene's dominance flips by
// sex: in males W is dominant (Ww shows the crest); in females W is recessive
// (Ww shows no crest). Same genotype, opposite phenotype.
export const ch16: Chapter = {
  id: 'ch16',
  order: 16,
  tier: 'student',
  concept: 'Sex-influenced dominance',
  title: 'Same gene, different rules',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Two heterozygous parents. In males W wins; in females w wins. Same alleles, opposite phenotype by sex."`,

  storyOutro: `Prof. Weaver:
"Male-pattern baldness in humans works this way — one gene, opposite dominance in each sex. Watch for it in your data."`,

  pinnedGlossaryTerms: ['sex-influenced'],

  stages: {
    show: {
      body: `A **sex-influenced** trait's dominance flips by sex.

For our braincrest gene:
- **Males**: W dominates (Ww male shows the crest).
- **Females**: w dominates (Ww female does NOT show the crest).

Cross Ww × Ww: expect crests in half of male offspring, and in only the WW quarter of females.`,
    },
    guided: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, braincrest: ['W', 'w'] },
          defaultName: 'Ww ♀ (no crest)',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, braincrest: ['W', 'w'] },
          defaultName: 'Ww ♂ (crest)',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'braincrest', correctGenotype: 'Ww' },
        { creatureRole: 'father', geneId: 'braincrest', correctGenotype: 'Ww' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen: 'Mother has no crest but father does. Both are Ww. Watch: half the sons show a crest, only 1/4 of daughters do.',
        onWrongHypothesis: {
          'mother:braincrest:WW': 'WW female — hmm, but she doesn\'t show a crest. Because W is recessive in females, she could be Ww or WW. Look at her sons: if any lack a crest, she must be Ww.',
          'father:braincrest:ww': 'ww male would have no crest. Yours does — so he carries at least one W.',
        },
      },
    },
    solo: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, braincrest: ['W', 'w'] },
          defaultName: 'Ww ♀ (no crest)',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, braincrest: ['W', 'w'] },
          defaultName: 'Ww ♂ (crest)',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'braincrest', correctGenotype: 'Ww' },
        { creatureRole: 'father', geneId: 'braincrest', correctGenotype: 'Ww' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        { stage: 'reframe', text: 'Read sons and daughters separately. Rules differ by sex.' },
        { stage: 'point', text: 'Half of sons should show the crest, ~1/4 of daughters.' },
        { stage: 'suggest', text: 'Both parents Ww.' },
      ],
    },
  },
  unlocks: { traits: ['braincrest'], nextChapterId: 'ch17' },
  trophyBlobPreset: {
    sex: 'M', genotype: { ...NEUTRAL_MALE, braincrest: ['W', 'w'] },
    defaultName: 'Sex-Influenced Trophy',
  },
}
