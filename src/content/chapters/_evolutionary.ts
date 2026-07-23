import type { Chapter } from '../types'
import { NEUTRAL_FEMALE } from './_scaffold'

// Compact factory for the nine evolutionary chapters (Ch 27-35). Each is a
// population-sandbox chapter with brief text and no per-parent notebook
// assertions — completion is driven by the sandbox's onFullyExplored.
export interface EvolutionaryChapterSpec {
  id: string
  order: number
  concept: string
  title: string
  storyIntro: string
  storyOutro: string
  body: string
  glossary: string[]
  focusGeneId: string
  initialDominantFreq: number
  populationSize?: number
  generationsToExplore?: number
  nextChapterId?: string
  unlockMentors?: string[]
  force?:
    | 'drift'
    | 'founder'
    | 'migration'
    | 'selection'
    | 'balancing'
    | 'assortative'
    | 'inbreeding'
    | 'hybrid-vigor'
    | 'speciation'
}

export function evolutionaryChapter(spec: EvolutionaryChapterSpec): Chapter {
  return {
    id: spec.id,
    order: spec.order,
    tier: 'student',
    concept: spec.concept,
    title: spec.title,
    mentorId: 'prof-weaver',
    storyIntro: spec.storyIntro,
    storyOutro: spec.storyOutro,
    pinnedGlossaryTerms: spec.glossary,
    stages: {
      show: { body: spec.body },
      guided: {
        starterCreatures: [],
        correctAssertions: [],
        litterSize: 1,
        scaffolding: {
          onOpen: 'Run generations. Observe how the allele frequencies change (or don\'t).',
          onWrongHypothesis: {},
        },
      },
      solo: {
        starterCreatures: [],
        correctAssertions: [],
        litterSize: 1,
        validationTier: 'loose',
        hints: [],
      },
    },
    unlocks: {
      nextChapterId: spec.nextChapterId ?? undefined,
      mentors: spec.unlockMentors,
    },
    trophyBlobPreset: {
      sex: 'F',
      genotype: { ...NEUTRAL_FEMALE, tail: ['T', 't'] },
      defaultName: `${spec.title} Trophy`,
    },
    interactionMode: {
      kind: 'population-sandbox',
      focusGeneId: spec.focusGeneId,
      initialDominantFreq: spec.initialDominantFreq,
      populationSize: spec.populationSize,
      generationsToExplore: spec.generationsToExplore,
      force: spec.force,
    },
  }
}
