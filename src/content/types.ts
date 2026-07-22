import type { Genotype, Sex } from '../engine/types'

export interface GlossaryTerm {
  id: string
  name: string
  overview: string
  fullArticle: string
  relatedTerms?: string[]
}

export interface LessonStarterCreature {
  role: 'mother' | 'father'
  sex: Sex
  genotype: Genotype
  defaultName: string
}

export interface NotebookAssertion {
  creatureRole: 'mother' | 'father'
  geneId: string
  correctGenotype: string
}

export interface Hint {
  stage: 'reframe' | 'point' | 'suggest'
  text: string
}

export interface Lesson {
  id: string
  slug: string
  order: number
  title: string
  concept: string
  intro: string
  pinnedGlossaryTerms: string[]
  starterCreatures: LessonStarterCreature[]
  litterSize: number
  correctAssertions: NotebookAssertion[]
  validationTier: 'loose' | 'medium' | 'strict'
  hints: Hint[]
  unlocks: {
    traits?: string[]
    orderTypes?: string[]
    characters?: string[]
  }
  // Orders that must be completed after this lesson before the NEXT lesson
  // unlocks. Empty array means the next lesson unlocks immediately.
  gateOrderIds: string[]
  // If true, the two starter creatures are promoted to the player's village
  // when the lesson completes. Otherwise the whole lesson pool is discarded on
  // exit — only Lesson 1 is intended to seed the village.
  awardsStarterBlobs?: boolean
}

export interface Character {
  id: string
  name: string
  emoji: string
  bio: string
  voice: {
    orderIntro: string
    orderComplete: string
  }
  specialty: string[]
  unlockedFrom?: string
}

export interface LabStarterCreature {
  sex: Sex
  genotype: Genotype
  defaultName: string
}

export interface OrderTemplate {
  id: string
  characterId: string
  tier: 1 | 2 | 3
  requiredPhenotype: Record<string, string>
  coinReward: number
  flavorText: string
  // The two "unknown" blobs the player starts the lab with when they take this
  // order. Genotypes chosen so the target phenotype is actually reachable.
  labStarters: [LabStarterCreature, LabStarterCreature]
  // Which genes are in play for this puzzle (i.e. show up in each notecard as
  // guess inputs and appear on the offspring's phenotype).
  visibleGeneIds: string[]
}
