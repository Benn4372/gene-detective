import type { Chapter, ChapterTier } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

type InteractionMode = NonNullable<Chapter['interactionMode']>

// Compact factory for Researcher-tier chapters (Ch 36-54). Uses a testcross
// pattern with the antennae gene as a stand-in — chapter text carries the
// concept while the mechanic stays familiar.
export interface ResearcherChapterSpec {
  id: string
  order: number
  concept: string
  title: string
  storyIntro: string
  storyOutro: string
  body: string
  glossary: string[]
  focusGene?: string
  correctMother?: string
  correctFather?: string
  tools?: string[]
  nextChapterId?: string
  trophyName?: string
  tier?: ChapterTier
  unlockMentors?: string[]
  interactionMode?: InteractionMode
}

export function researcherChapter(spec: ResearcherChapterSpec): Chapter {
  const focus = spec.focusGene ?? 'antennae'
  const correctMother = spec.correctMother ?? 'Aa'
  const correctFather = spec.correctFather ?? 'aa'
  return {
    id: spec.id,
    order: spec.order,
    tier: spec.tier ?? 'researcher',
    concept: spec.concept,
    title: spec.title,
    mentorId: 'prof-weaver',
    storyIntro: spec.storyIntro,
    storyOutro: spec.storyOutro,
    pinnedGlossaryTerms: spec.glossary,
    stages: {
      show: { body: spec.body },
      guided: {
        starterCreatures: [
          {
            role: 'mother',
            sex: 'F',
            genotype: {
              ...NEUTRAL_FEMALE,
              [focus]: alleleTupleFromString(correctMother),
            },
            defaultName: `${correctMother} ♀`,
          },
          {
            role: 'father',
            sex: 'M',
            genotype: {
              ...NEUTRAL_MALE,
              [focus]: alleleTupleFromString(correctFather),
            },
            defaultName: `${correctFather} ♂`,
          },
        ],
        correctAssertions: [
          { creatureRole: 'mother', geneId: focus, correctGenotype: correctMother },
          { creatureRole: 'father', geneId: focus, correctGenotype: correctFather },
        ],
        litterSize: 6,
        scaffolding: {
          onOpen: 'Concept-heavy chapter — the puzzle stays classical. Read the mentor\'s notes and breed to confirm.',
          onWrongHypothesis: {},
        },
      },
      solo: {
        starterCreatures: [
          {
            role: 'mother',
            sex: 'F',
            genotype: {
              ...NEUTRAL_FEMALE,
              [focus]: alleleTupleFromString(correctMother),
            },
            defaultName: `${correctMother} ♀`,
          },
          {
            role: 'father',
            sex: 'M',
            genotype: {
              ...NEUTRAL_MALE,
              [focus]: alleleTupleFromString(correctFather),
            },
            defaultName: `${correctFather} ♂`,
          },
        ],
        correctAssertions: [
          { creatureRole: 'mother', geneId: focus, correctGenotype: correctMother },
          { creatureRole: 'father', geneId: focus, correctGenotype: correctFather },
        ],
        litterSize: 6,
        validationTier: 'loose',
        hints: [
          { stage: 'reframe', text: 'Focus on the notebook puzzle; concept notes are in the Codex.' },
          { stage: 'point', text: `Try ${correctMother} for mother, ${correctFather} for father.` },
          { stage: 'suggest', text: `Enter ${correctMother} and ${correctFather}.` },
        ],
      },
    },
    unlocks: {
      tools: spec.tools,
      nextChapterId: spec.nextChapterId,
      mentors: spec.unlockMentors,
    },
    trophyBlobPreset: {
      sex: 'F',
      genotype: {
        ...NEUTRAL_FEMALE,
        [focus]: alleleTupleFromString(correctMother),
      },
      defaultName: spec.trophyName ?? `${spec.title} Trophy`,
    },
    interactionMode: spec.interactionMode,
  }
}

// Turn a genotype string like "Aa" into an allele-id tuple. Falls back to
// splitting characters; single-allele strings become one-element arrays.
function alleleTupleFromString(str: string): string[] {
  return str.split('')
}
