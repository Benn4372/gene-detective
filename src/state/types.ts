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

  // Freeform per-creature notes (used mainly in labs, but works anywhere).
  notes: Record<string, string>

  // Which order's lab modal is currently open (null = no lab open).
  activeLabOrderId: string | null

  // Which lesson (if any) has just been marked complete but hasn't been
  // acknowledged by the UI yet. The auto-close runs when this transitions
  // from null → an id, then the UI clears it.
  justCompletedLessonId: string | null

  // Which nav modal is currently open. Persisted so it survives HMR/strict-mode
  // remounts that would otherwise wipe local component state.
  activeModal: 'orders' | 'breed' | 'shop' | null
  // Set true after the auto-open effect fires so subsequent App mounts don't
  // re-open the modal against the player's wishes.
  hasAutoOpened: boolean
}
