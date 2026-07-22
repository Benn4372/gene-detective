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

export interface OrderTemplate {
  id: string
  characterId: string
  tier: 1 | 2 | 3
  requiredPhenotype: Record<string, string>
  coinReward: number
  flavorText: string
}
