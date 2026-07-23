import type { Creature } from '../engine/types'

export type DifficultyTier = 'curious' | 'student' | 'researcher'

export type ChapterStage = 'show' | 'guided' | 'solo' | 'master' | 'outro'

export interface CrossRecord {
  id: string
  motherId: string
  fatherId: string
  offspringIds: string[]
  timestamp: number
}

export interface GameState {
  // -- Player-side progression ---------------------------------------------
  difficultyTier: DifficultyTier
  // Chapter progression
  unlockedChapters: string[]
  completedChapters: string[]
  currentChapterId: string | null
  currentChapterStage: ChapterStage
  // Chapter with a "just now completed the outro" flag — the UI can flash a
  // celebration once and then clear it.
  justCompletedChapterId: string | null
  // Per-chapter, how many solo-stage hints have been shown.
  hintsShownForChapter: Record<string, number>
  // Rolling counter for hint gating within the current chapter.
  breedsSinceLastNotebookProgress: number

  // What the player can use in the world
  unlockedTraits: string[]
  unlockedAlleles: string[]
  unlockedTools: string[]
  unlockedMentors: string[]

  // -- Missions ------------------------------------------------------------
  activeMissionId: string | null
  completedMissions: string[]

  // -- Creatures -----------------------------------------------------------
  creatures: Record<string, Creature>
  // Per-chapter starter creature assignments (motherId / fatherId).
  // Keyed by chapterId, keeps solo-stage's mystery pair reference.
  chapterCreatures: Record<string, { motherId: string; fatherId: string }>
  // Per-mission starter creature assignments — mission's sample-1 / sample-2.
  missionCreatures: Record<string, { sample1Id: string; sample2Id: string }>
  // Blob figurines shown on the Trophy Shelf, one per completed chapter.
  trophyBlobs: Record<string, string> // chapterId → creatureId

  // -- Notebook ------------------------------------------------------------
  hypotheses: Record<string, Record<string, string>>
  validated: Record<string, Record<string, boolean>>
  notes: Record<string, string>
  crossHistory: CrossRecord[]
  solvedGenes: string[]

  // -- UI-visible state that survives remounts ----------------------------
  // Which nav destination is currently open at the top of the Station stack.
  activeScreen:
    | { kind: 'station' }
    | { kind: 'chapter'; chapterId: string }
    | { kind: 'mission'; missionId: string }
    | { kind: 'missions-board' }
    | { kind: 'trophy-shelf' }
    | { kind: 'settings' }
  // Trait Codex drawer (right-side slide-in) — global, persisted.
  codexOpen: boolean
  // Runs the "auto-open Chapter Book on first-ever load" effect exactly once.
  hasSeenStation: boolean
  // Ambient temperature (0=cold, 100=hot). Used from Ch11 onwards by
  // temperature-sensitive traits. Default 50 (temperate).
  environmentTemperature: number
}
