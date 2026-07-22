import type { Creature } from '../engine/types'

export type DifficultyTier = 'curious' | 'student' | 'researcher'

export interface CrossRecord {
  id: string
  motherId: string
  fatherId: string
  offspringIds: string[]
  timestamp: number
}

export interface GameState {
  // Player
  coins: number
  difficultyTier: DifficultyTier
  unlockedLessons: string[]
  completedLessons: string[]
  currentLessonId: string | null
  unlockedTraits: string[]
  unlockedCharacters: string[]
  hintsShownForLesson: Record<string, number>
  breedsSinceLastNotebookProgress: number

  // Stable
  creatures: Record<string, Creature>
  stableCap: number

  // Notebook
  hypotheses: Record<string, Record<string, string>>
  validated: Record<string, Record<string, boolean>>
  crossHistory: CrossRecord[]
  solvedGenes: string[]

  // Orders
  activeOrders: string[]
  completedOrders: string[]

  // Lesson-scoped creature assignments (creatureId is looked up in `creatures`)
  lessonCreatures: Record<string, { motherId: string; fatherId: string }>
}
