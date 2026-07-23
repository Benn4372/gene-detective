import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 17 — Sex-limited: gene only expresses in one sex. Broodpouch shows only
// in females; males can carry U silently and pass it to daughters.
export const ch17: Chapter = {
  id: 'ch17',
  order: 17,
  tier: 'student',
  concept: 'Sex-limited traits',
  title: 'Only one sex shows it',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver:
"Only females grow brood pouches. Males can carry U alleles just fine — they never express, but they pass to their daughters normally."`,

  storyOutro: `Prof. Weaver:
"Milk production in mammals, egg laying in reptiles — sex-limited traits are common. Don't confuse them with sex-linked. Different chromosome, different mechanism."`,

  pinnedGlossaryTerms: ['sex-limited'],

  stages: {
    show: {
      body: `**Sex-limited** traits only express in one sex. The gene sits on autosomes, so both sexes inherit alleles; only one sex has the hormonal context to express them.

For blobs: U (brood pouch) only expresses in **females**. UU or Uu male → looks like uu male (no pouch). His daughters can still show the pouch.`,
    },
    guided: {
      starterCreatures: [
        {
          role: 'mother', sex: 'F',
          genotype: { ...NEUTRAL_FEMALE, broodPouch: ['U', 'u'] },
          defaultName: 'Uu ♀ (pouch)',
        },
        {
          role: 'father', sex: 'M',
          genotype: { ...NEUTRAL_MALE, broodPouch: ['U', 'u'] },
          defaultName: 'Uu ♂ (silent)',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'broodPouch', correctGenotype: 'Uu' },
        { creatureRole: 'father', geneId: 'broodPouch', correctGenotype: 'Uu' },
      ],
      litterSize: 8,
      scaffolding: {
        onOpen: "Mother shows a pouch. Father looks plain. Look at daughters — if some lack pouches, father carries a u.",
        onWrongHypothesis: {
          'mother:broodPouch:uu': 'Mother shows the pouch, so she has at least one U.',
          'father:broodPouch:UU': 'Male phenotype is silent — you can\'t tell UU from Uu from uu on him directly. Watch his daughters.',
        },
      },
    },
    solo: {
      starterCreatures: [
        { role: 'mother', sex: 'F', genotype: { ...NEUTRAL_FEMALE, broodPouch: ['U', 'u'] }, defaultName: 'Uu ♀' },
        { role: 'father', sex: 'M', genotype: { ...NEUTRAL_MALE, broodPouch: ['U', 'u'] }, defaultName: 'Uu ♂' },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'broodPouch', correctGenotype: 'Uu' },
        { creatureRole: 'father', geneId: 'broodPouch', correctGenotype: 'Uu' },
      ],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        { stage: 'reframe', text: 'Males are silent. Watch daughters.' },
        { stage: 'point', text: 'Pouch-lacking daughters mean both parents carry u.' },
        { stage: 'suggest', text: 'Uu × Uu.' },
      ],
    },
  },
  unlocks: { traits: ['broodPouch'], nextChapterId: 'ch18' },
  trophyBlobPreset: {
    sex: 'F', genotype: { ...NEUTRAL_FEMALE, broodPouch: ['U', 'U'] },
    defaultName: 'Pouch-daughter Trophy',
  },
}
