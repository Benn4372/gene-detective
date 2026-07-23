import { useMemo } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Creature, CreatureScope } from '../engine/types'
import { cross as engineCross } from '../engine/cross'
import { makeRandom } from '../engine/random'
import { computePhenotype } from '../engine/phenotype'
import { validateHypothesis, canonicalizeHypothesis } from '../engine/validators'
import { setEnvironmentTemperature } from '../engine/environment'
import { blobSpecies, chapterById, chapters, missionById } from '../content'
import type { ChapterStage, CrossRecord, DifficultyTier, GameState } from './types'

// -- id helpers ------------------------------------------------------------

let idCounter = 0
function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

// -- scope helpers ---------------------------------------------------------

function chapterScope(chapterId: string, stage: 'guided' | 'solo' | 'master'): CreatureScope {
  return { kind: 'chapter', chapterId, stage }
}
function missionScope(missionId: string): CreatureScope {
  return { kind: 'mission', missionId }
}
function isChapterScope(scope: CreatureScope, chapterId?: string): boolean {
  if (typeof scope === 'string') return false
  if (scope.kind !== 'chapter') return false
  return chapterId ? scope.chapterId === chapterId : true
}
function isMissionScope(scope: CreatureScope, missionId?: string): boolean {
  if (typeof scope === 'string') return false
  if (scope.kind !== 'mission') return false
  return missionId ? scope.missionId === missionId : true
}
function isTrophyScope(scope: CreatureScope): boolean {
  return scope === 'trophy'
}

// -- initial state ---------------------------------------------------------

function initialState(): GameState {
  const firstChapterId = chapters[0]?.id ?? 'ch01'
  return {
    difficultyTier: 'curious',
    unlockedChapters: [firstChapterId],
    completedChapters: [],
    currentChapterId: null,
    currentChapterStage: 'show',
    justCompletedChapterId: null,
    hintsShownForChapter: {},
    breedsSinceLastNotebookProgress: 0,
    unlockedTraits: [],
    unlockedAlleles: [],
    unlockedTools: ['punnett-2x2'],
    unlockedMentors: ['dr-mendel'],
    activeMissionId: null,
    completedMissions: [],
    creatures: {},
    chapterCreatures: {},
    missionCreatures: {},
    trophyBlobs: {},
    hypotheses: {},
    validated: {},
    notes: {},
    crossHistory: [],
    solvedGenes: [],
    activeScreen: { kind: 'station' },
    codexOpen: false,
    hasSeenStation: false,
    environmentTemperature: 50,
  }
}

// -- actions surface -------------------------------------------------------

interface GameActions {
  reset(): void
  setDifficultyTier(tier: DifficultyTier): void
  // Notebook
  setHypothesis(creatureId: string, geneId: string, text: string): void
  setNote(creatureId: string, text: string): void
  showNextHint(chapterId: string): void
  // Breeding — used by Workbench in any context.
  breed(motherId: string, fatherId: string, litterSize?: number): CrossRecord | null
  // Chapter flow
  startChapter(chapterId: string): void
  advanceChapterStage(next: ChapterStage): void
  completeChapter(): void
  exitChapter(): void
  clearJustCompleted(): void
  awardTrophyBlob(chapterId: string, creatureId: string): void
  // Mission flow
  openMission(missionId: string): void
  closeMission(): void
  submitMissionBlob(missionId: string, creatureId: string): boolean
  // Non-breed missions (deduce-only, predict-only) complete without an actual
  // creature delivery — the mission ends when the puzzle is solved instead.
  completeMissionByPuzzle(missionId: string): void
  // UI
  setActiveScreen(next: GameState['activeScreen']): void
  toggleCodex(): void
  markStationSeen(): void
  setEnvironmentTemperature(t: number): void
}

// -- store -----------------------------------------------------------------

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      reset() {
        set(initialState())
      },

      setDifficultyTier(tier) {
        set({ difficultyTier: tier })
      },

      // -- Notebook ------------------------------------------------------

      setHypothesis(creatureId, geneId, text) {
        const state = get()
        const creature = state.creatures[creatureId]
        if (!creature) return

        const geneIds = geneId
          ? [geneId]
          : Object.keys(state.hypotheses[creatureId] ?? {})

        const hypotheses = { ...state.hypotheses }
        const validated = { ...state.validated }
        let progressed = false
        let anyValidated = false

        for (const g of geneIds) {
          const raw = geneId ? text : (state.hypotheses[creatureId]?.[g] ?? '')
          const canonical = canonicalizeHypothesis(blobSpecies, g, raw)
          if (!hypotheses[creatureId]) hypotheses[creatureId] = {}
          hypotheses[creatureId] = { ...hypotheses[creatureId], [g]: canonical }

          const correct = findCorrectGenotype(state, creatureId, g)
          const wasValidated = state.validated[creatureId]?.[g] ?? false
          let isValid = false
          if (correct) {
            isValid = validateHypothesis({
              creature,
              geneId: g,
              hypothesizedGenotype: canonical,
              correctGenotype: correct,
              species: blobSpecies,
              creatures: state.creatures,
              crossHistory: state.crossHistory,
              tier: findValidationTier(state) ?? 'medium',
            })
          }
          if (!validated[creatureId]) validated[creatureId] = {}
          validated[creatureId] = { ...validated[creatureId], [g]: isValid }
          if (isValid) anyValidated = true
          if (isValid && !wasValidated) progressed = true
        }

        const solved = new Set(state.solvedGenes)
        if (anyValidated) {
          for (const g of geneIds) if (validated[creatureId]?.[g]) solved.add(g)
        }

        set({
          hypotheses,
          validated,
          solvedGenes: [...solved],
          breedsSinceLastNotebookProgress: progressed
            ? 0
            : state.breedsSinceLastNotebookProgress,
        })
      },

      setNote(creatureId, text) {
        set(s => ({ notes: { ...s.notes, [creatureId]: text } }))
      },

      showNextHint(chapterId) {
        set(s => ({
          hintsShownForChapter: {
            ...s.hintsShownForChapter,
            [chapterId]: (s.hintsShownForChapter[chapterId] ?? 0) + 1,
          },
        }))
      },

      // -- Breeding ------------------------------------------------------

      breed(motherId, fatherId, litterSize) {
        const state = get()
        const mom = state.creatures[motherId]
        const dad = state.creatures[fatherId]
        if (!mom || !dad) return null
        if (mom.sex === dad.sex) return null

        // Offspring inherit their parents' scope (both parents will always
        // share a scope in a valid session).
        const offspringScope: CreatureScope = isTrophyScope(mom.scope)
          ? 'trophy' // shouldn't happen — trophies don't breed — but harmless
          : mom.scope

        const requestedLitter = litterSize ?? defaultLitterSize(state)

        const rng = makeRandom()
        const offspring = engineCross(mom, dad, blobSpecies, rng, {
          litterSize: requestedLitter,
        })
        const newCreatures: Record<string, Creature> = {}
        const offspringIds: string[] = []
        for (const child of offspring) {
          const id = nextId('c')
          offspringIds.push(id)
          newCreatures[id] = {
            id,
            speciesId: blobSpecies.id,
            sex: child.sex,
            genotype: child.genotype,
            age: 0,
            parentIds: [mom.id, dad.id],
            scope: offspringScope,
          }
        }
        const record: CrossRecord = {
          id: nextId('x'),
          motherId,
          fatherId,
          offspringIds,
          timestamp: Date.now(),
        }
        set(s => ({
          creatures: { ...s.creatures, ...newCreatures },
          crossHistory: [...s.crossHistory, record],
          breedsSinceLastNotebookProgress:
            s.breedsSinceLastNotebookProgress + 1,
        }))
        // Re-validate hypotheses on the parents — new evidence may finally
        // distinguish AA from Aa.
        get().setHypothesis(motherId, '', '')
        get().setHypothesis(fatherId, '', '')
        return record
      },

      // -- Chapter flow --------------------------------------------------

      startChapter(chapterId) {
        const chapter = chapterById[chapterId]
        if (!chapter) return
        const existing = get().chapterCreatures[chapterId]
        // If the player already has this chapter set up, resume where they were.
        if (existing) {
          set({
            currentChapterId: chapterId,
            currentChapterStage: 'show',
            breedsSinceLastNotebookProgress: 0,
            activeScreen: { kind: 'chapter', chapterId },
          })
          return
        }
        // Otherwise create starters for the guided stage (the first stage that
        // needs real creatures). Solo + master stages reuse the same starters
        // unless we later decide otherwise.
        const starters = chapter.stages.guided.starterCreatures
        const newCreatures: Record<string, Creature> = {}
        let motherId = ''
        let fatherId = ''
        for (const starter of starters) {
          const id = nextId('c')
          newCreatures[id] = {
            id,
            speciesId: blobSpecies.id,
            ownerName: starter.defaultName,
            sex: starter.sex,
            genotype: starter.genotype,
            age: 1,
            scope: chapterScope(chapterId, 'guided'),
          }
          if (starter.role === 'mother') motherId = id
          if (starter.role === 'father') fatherId = id
        }
        set(state => ({
          creatures: { ...state.creatures, ...newCreatures },
          chapterCreatures: {
            ...state.chapterCreatures,
            [chapterId]: { motherId, fatherId },
          },
          currentChapterId: chapterId,
          currentChapterStage: 'show',
          breedsSinceLastNotebookProgress: 0,
          activeScreen: { kind: 'chapter', chapterId },
        }))
      },

      advanceChapterStage(next) {
        set({ currentChapterStage: next, breedsSinceLastNotebookProgress: 0 })
      },

      completeChapter() {
        const state = get()
        const chapterId = state.currentChapterId
        if (!chapterId) return
        if (state.completedChapters.includes(chapterId)) return
        const chapter = chapterById[chapterId]
        if (!chapter) return

        const nextCompleted = [...state.completedChapters, chapterId]
        const newUnlocked = new Set(state.unlockedChapters)
        if (chapter.unlocks.nextChapterId) newUnlocked.add(chapter.unlocks.nextChapterId)

        const newTraits = Array.from(new Set([
          ...state.unlockedTraits,
          ...(chapter.unlocks.traits ?? []),
        ]))
        const newAlleles = Array.from(new Set([
          ...state.unlockedAlleles,
          ...(chapter.unlocks.alleles ?? []),
        ]))
        const newTools = Array.from(new Set([
          ...state.unlockedTools,
          ...(chapter.unlocks.tools ?? []),
        ]))
        const newMentors = Array.from(new Set([
          ...state.unlockedMentors,
          ...(chapter.unlocks.mentors ?? []),
        ]))

        set({
          completedChapters: nextCompleted,
          unlockedChapters: [...newUnlocked],
          unlockedTraits: newTraits,
          unlockedAlleles: newAlleles,
          unlockedTools: newTools,
          unlockedMentors: newMentors,
          justCompletedChapterId: chapterId,
        })
      },

      exitChapter() {
        const state = get()
        const chapterId = state.currentChapterId
        if (!chapterId) {
          set({ activeScreen: { kind: 'station' } })
          return
        }
        const wasCompleted = state.completedChapters.includes(chapterId)
        if (!wasCompleted) {
          // Player leaving mid-chapter — keep the pool intact so they can resume.
          set({
            currentChapterId: null,
            activeScreen: { kind: 'station' },
          })
          return
        }
        // Chapter completed — discard the scratch pool.
        const nextCreatures: Record<string, Creature> = {}
        for (const [id, c] of Object.entries(state.creatures)) {
          if (isChapterScope(c.scope, chapterId)) {
            // If this creature is the chosen trophy, keep it as scope 'trophy'.
            const isTrophy = state.trophyBlobs[chapterId] === id
            if (isTrophy) nextCreatures[id] = { ...c, scope: 'trophy' }
          } else {
            nextCreatures[id] = c
          }
        }
        const nextHistory = state.crossHistory.filter(
          r => nextCreatures[r.motherId] && nextCreatures[r.fatherId],
        )
        const { [chapterId]: _drop, ...remainingChapterCreatures } =
          state.chapterCreatures
        set({
          creatures: nextCreatures,
          crossHistory: nextHistory,
          chapterCreatures: remainingChapterCreatures,
          currentChapterId: null,
          activeScreen: { kind: 'station' },
        })
      },

      clearJustCompleted() {
        set({ justCompletedChapterId: null })
      },

      awardTrophyBlob(chapterId, creatureId) {
        // If the chapter declares a trophyBlobPreset, materialize a fresh
        // trophy-scoped creature from that preset and use its id instead
        // of whichever mystery-pair blob the player highlighted.
        const chapter = chapterById[chapterId]
        if (chapter?.trophyBlobPreset) {
          const preset = chapter.trophyBlobPreset
          const id = nextId('c')
          set(s => ({
            creatures: {
              ...s.creatures,
              [id]: {
                id,
                speciesId: blobSpecies.id,
                ownerName: preset.defaultName,
                sex: preset.sex,
                genotype: preset.genotype,
                age: 1,
                scope: 'trophy',
              },
            },
            trophyBlobs: { ...s.trophyBlobs, [chapterId]: id },
          }))
          return
        }
        set(s => ({ trophyBlobs: { ...s.trophyBlobs, [chapterId]: creatureId } }))
      },

      // -- Mission flow --------------------------------------------------

      openMission(missionId) {
        const mission = missionById[missionId]
        if (!mission) return
        const state = get()
        const existing = state.missionCreatures[missionId]
        if (existing) {
          set({
            activeMissionId: missionId,
            activeScreen: { kind: 'mission', missionId },
          })
          return
        }
        const [s1, s2] = mission.labStarters
        const id1 = nextId('c')
        const id2 = nextId('c')
        const newCreatures: Record<string, Creature> = {
          [id1]: {
            id: id1,
            speciesId: blobSpecies.id,
            ownerName: s1.defaultName,
            sex: s1.sex,
            genotype: s1.genotype,
            age: 1,
            scope: missionScope(missionId),
          },
          [id2]: {
            id: id2,
            speciesId: blobSpecies.id,
            ownerName: s2.defaultName,
            sex: s2.sex,
            genotype: s2.genotype,
            age: 1,
            scope: missionScope(missionId),
          },
        }
        set(s => ({
          creatures: { ...s.creatures, ...newCreatures },
          missionCreatures: {
            ...s.missionCreatures,
            [missionId]: { sample1Id: id1, sample2Id: id2 },
          },
          activeMissionId: missionId,
          activeScreen: { kind: 'mission', missionId },
        }))
      },

      closeMission() {
        set({ activeMissionId: null, activeScreen: { kind: 'missions-board' } })
      },

      completeMissionByPuzzle(missionId) {
        const state = get()
        if (state.completedMissions.includes(missionId)) return
        // Clear this mission's pool + related history, same as breed-mode
        // submit does, so re-opening starts fresh.
        const nextCreatures: Record<string, Creature> = {}
        const nextNotes = { ...state.notes }
        const nextHypotheses = { ...state.hypotheses }
        const nextValidated = { ...state.validated }
        for (const [id, c] of Object.entries(state.creatures)) {
          if (isMissionScope(c.scope, missionId)) {
            delete nextNotes[id]
            delete nextHypotheses[id]
            delete nextValidated[id]
          } else {
            nextCreatures[id] = c
          }
        }
        const nextHistory = state.crossHistory.filter(
          r => nextCreatures[r.motherId] && nextCreatures[r.fatherId],
        )
        const { [missionId]: _drop, ...remainingMissionCreatures } =
          state.missionCreatures
        set({
          creatures: nextCreatures,
          notes: nextNotes,
          hypotheses: nextHypotheses,
          validated: nextValidated,
          crossHistory: nextHistory,
          missionCreatures: remainingMissionCreatures,
          completedMissions: [...state.completedMissions, missionId],
          activeMissionId: null,
          activeScreen: { kind: 'missions-board' },
        })
      },

      submitMissionBlob(missionId, creatureId) {
        const mission = missionById[missionId]
        const state = get()
        const creature = state.creatures[creatureId]
        if (!mission || !creature) return false
        // Only mission-scoped bred offspring (not starters) can be submitted.
        if (!isMissionScope(creature.scope, missionId)) return false
        if (!creature.parentIds) return false
        const phenotype = computePhenotype(creature, blobSpecies)
        for (const [traitId, expected] of Object.entries(mission.targetPhenotype)) {
          if (phenotype[traitId] !== expected) return false
        }
        // Clear this mission's pool + related history.
        const nextCreatures: Record<string, Creature> = {}
        const nextNotes = { ...state.notes }
        const nextHypotheses = { ...state.hypotheses }
        const nextValidated = { ...state.validated }
        for (const [id, c] of Object.entries(state.creatures)) {
          if (isMissionScope(c.scope, missionId)) {
            delete nextNotes[id]
            delete nextHypotheses[id]
            delete nextValidated[id]
          } else {
            nextCreatures[id] = c
          }
        }
        const nextHistory = state.crossHistory.filter(
          r => nextCreatures[r.motherId] && nextCreatures[r.fatherId],
        )
        const { [missionId]: _drop, ...remainingMissionCreatures } =
          state.missionCreatures
        set({
          creatures: nextCreatures,
          notes: nextNotes,
          hypotheses: nextHypotheses,
          validated: nextValidated,
          crossHistory: nextHistory,
          missionCreatures: remainingMissionCreatures,
          completedMissions: [...state.completedMissions, missionId],
          activeMissionId: null,
          activeScreen: { kind: 'missions-board' },
        })
        return true
      },

      // -- UI ------------------------------------------------------------

      setActiveScreen(next) {
        set({ activeScreen: next })
      },

      toggleCodex() {
        set(s => ({ codexOpen: !s.codexOpen }))
      },

      markStationSeen() {
        set({ hasSeenStation: true })
      },

      setEnvironmentTemperature(t) {
        const clamped = Math.max(0, Math.min(100, t))
        setEnvironmentTemperature(clamped)
        set({ environmentTemperature: clamped })
      },
    }),
    {
      name: 'gene-detective-save-v4',
      version: 5,
      storage: createJSONStorage(() => localStorage),
      // v4 → v5 added environmentTemperature and per-chapter interaction
      // modes. All existing v4 fields survive unchanged; the merge below
      // supplies defaults for any newly-added top-level keys.
      migrate: (persisted) => persisted as GameState,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameState>
        return {
          ...current,
          ...p,
          environmentTemperature: p.environmentTemperature ?? 50,
        }
      },
    },
  ),
)

// -- helpers ----------------------------------------------------------------

function defaultLitterSize(state: GameState): number {
  const activeChapter = state.currentChapterId
    ? chapterById[state.currentChapterId]
    : null
  if (activeChapter) {
    const stageDef =
      state.currentChapterStage === 'master'
        ? activeChapter.stages.master
        : state.currentChapterStage === 'solo'
          ? activeChapter.stages.solo
          : activeChapter.stages.guided
    return stageDef?.litterSize ?? 6
  }
  // Mission and everything else: one at a time.
  return 1
}

function findCorrectGenotype(
  state: GameState,
  creatureId: string,
  geneId: string,
): string | null {
  // Look up whichever chapter this creature is starring in, then find the
  // matching correctAssertion for the current stage.
  for (const [chapterId, assignments] of Object.entries(state.chapterCreatures)) {
    const chapter = chapterById[chapterId]
    if (!chapter) continue
    const role: 'mother' | 'father' | null =
      assignments.motherId === creatureId
        ? 'mother'
        : assignments.fatherId === creatureId
          ? 'father'
          : null
    if (!role) continue
    // Try current stage first, else fall back to solo (canonical answer).
    const stageDef =
      state.currentChapterStage === 'guided'
        ? chapter.stages.guided
        : state.currentChapterStage === 'master' && chapter.stages.master
          ? chapter.stages.master
          : chapter.stages.solo
    const a = stageDef.correctAssertions.find(
      x => x.creatureRole === role && x.geneId === geneId,
    )
    if (a) return a.correctGenotype
  }
  return null
}

function findValidationTier(state: GameState): 'loose' | 'medium' | 'strict' | null {
  const chapter = state.currentChapterId ? chapterById[state.currentChapterId] : null
  if (!chapter) return null
  if (state.currentChapterStage === 'solo') return chapter.stages.solo.validationTier
  if (state.currentChapterStage === 'guided') return 'loose'
  return 'medium'
}

// -- Selectors --------------------------------------------------------------

export function useTrophyBlobs(): Creature[] {
  const trophyBlobs = useGameStore(s => s.trophyBlobs)
  const creatures = useGameStore(s => s.creatures)
  return useMemo(
    () =>
      Object.values(trophyBlobs)
        .map(id => creatures[id])
        .filter((c): c is Creature => !!c),
    [trophyBlobs, creatures],
  )
}

export function useCurrentChapter() {
  return useGameStore(s =>
    s.currentChapterId ? chapterById[s.currentChapterId] : null,
  )
}
