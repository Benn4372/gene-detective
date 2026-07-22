import { useMemo } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Creature, CreatureScope } from '../engine/types'
import { cross as engineCross } from '../engine/cross'
import { makeRandom } from '../engine/random'
import { computePhenotype } from '../engine/phenotype'
import { validateHypothesis, canonicalizeHypothesis } from '../engine/validators'
import {
  blobSpecies,
  lessonById,
  lessons,
  orderTemplateById,
} from '../content'
import type { CrossRecord, DifficultyTier, GameState } from './types'

let idCounter = 0
function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

function initialState(): GameState {
  return {
    coins: 0,
    difficultyTier: 'curious',
    unlockedLessons: ['lesson-1'],
    completedLessons: [],
    currentLessonId: null,
    unlockedTraits: ['antennae'],
    unlockedCharacters: [],
    hintsShownForLesson: {},
    breedsSinceLastNotebookProgress: 0,
    creatures: {},
    stableCap: 25,
    hypotheses: {},
    validated: {},
    crossHistory: [],
    solvedGenes: [],
    activeOrders: [],
    completedOrders: [],
    lessonCreatures: {},
    notes: {},
    activeLabOrderId: null,
    justCompletedLessonId: null,
    activeModal: null,
    hasAutoOpened: false,
  }
}

interface GameActions {
  startLesson(lessonId: string): void
  setCurrentLesson(lessonId: string | null): void
  clearJustCompleted(): void
  breed(
    motherId: string,
    fatherId: string,
    litterSize?: number,
  ): CrossRecord | null
  setHypothesis(creatureId: string, geneId: string, text: string): void
  setNote(creatureId: string, text: string): void
  showNextHint(lessonId: string): void
  openLab(orderTemplateId: string): void
  closeLab(): void
  fulfillOrder(orderTemplateId: string, creatureId: string): boolean
  releaseCreature(creatureId: string): void
  renameCreature(creatureId: string, name: string): void
  setDifficultyTier(tier: DifficultyTier): void
  setActiveModal(modal: 'orders' | 'breed' | 'shop' | null): void
  markAutoOpened(): void
  reset(): void
}

// -- scope helpers ---------------------------------------------------------

function lessonScope(lessonId: string): CreatureScope {
  return { kind: 'lesson', lessonId }
}
function labScope(orderId: string): CreatureScope {
  return { kind: 'lab', orderId }
}
function isLessonScope(scope: CreatureScope, lessonId?: string): boolean {
  if (typeof scope === 'string') return false
  if (scope.kind !== 'lesson') return false
  return lessonId ? scope.lessonId === lessonId : true
}
function isLabScope(scope: CreatureScope, orderId?: string): boolean {
  if (typeof scope === 'string') return false
  if (scope.kind !== 'lab') return false
  return orderId ? scope.orderId === orderId : true
}
function isVillageScope(scope: CreatureScope): boolean {
  return scope === 'village'
}

// Determine which lessons should be unlocked given the current completion +
// gate-order state. A lesson unlocks when the PREVIOUS lesson is completed
// AND all of that previous lesson's gate orders are done. Lesson 1 is always
// unlocked.
function recomputeUnlockedLessons(
  completedLessons: string[],
  completedOrders: string[],
): string[] {
  const sorted = [...lessons].sort((a, b) => a.order - b.order)
  const unlocked = new Set<string>([sorted[0]!.id])
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i]!
    const next = sorted[i + 1]!
    const curDone = completedLessons.includes(cur.id)
    const gatesDone = cur.gateOrderIds.every(id => completedOrders.includes(id))
    if (curDone && gatesDone) unlocked.add(next.id)
  }
  return [...unlocked]
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      startLesson(lessonId) {
        const lesson = lessonById[lessonId]
        if (!lesson) return
        const existing = get().lessonCreatures[lessonId]
        if (existing) {
          set({ currentLessonId: lessonId, breedsSinceLastNotebookProgress: 0 })
          return
        }
        const newCreatures: Record<string, Creature> = {}
        let motherId = ''
        let fatherId = ''
        for (const starter of lesson.starterCreatures) {
          const id = nextId('c')
          const creature: Creature = {
            id,
            speciesId: blobSpecies.id,
            ownerName: starter.defaultName,
            sex: starter.sex,
            genotype: starter.genotype,
            age: 1,
            scope: lessonScope(lessonId),
          }
          newCreatures[id] = creature
          if (starter.role === 'mother') motherId = id
          if (starter.role === 'father') fatherId = id
        }
        set(state => ({
          creatures: { ...state.creatures, ...newCreatures },
          lessonCreatures: {
            ...state.lessonCreatures,
            [lessonId]: { motherId, fatherId },
          },
          currentLessonId: lessonId,
          breedsSinceLastNotebookProgress: 0,
        }))
      },

      setCurrentLesson(lessonId) {
        const prev = get().currentLessonId
        if (prev && prev !== lessonId) {
          // Leaving a lesson — run cleanup (promotes starters if this lesson
          // awardsStarterBlobs; discards everything otherwise, but only if the
          // lesson was completed).
          finishLessonInternal(prev, set, get)
        }
        set({ currentLessonId: lessonId, breedsSinceLastNotebookProgress: 0 })
      },

      clearJustCompleted() {
        set({ justCompletedLessonId: null })
      },

      breed(motherId, fatherId, litterSize) {
        const state = get()
        const mom = state.creatures[motherId]
        const dad = state.creatures[fatherId]
        if (!mom || !dad) return null
        if (mom.sex === dad.sex) return null

        // Determine offspring scope. If either parent is non-village-scoped,
        // offspring inherit that scope. Village breeding produces village-scoped
        // offspring.
        const nonVillageParentScope =
          !isVillageScope(mom.scope) ? mom.scope
          : !isVillageScope(dad.scope) ? dad.scope
          : null
        const offspringScope: CreatureScope = nonVillageParentScope ?? 'village'

        // Default litter size depends on context.
        const lesson = state.currentLessonId ? lessonById[state.currentLessonId] : null
        let requestedLitter = litterSize
        if (requestedLitter === undefined) {
          if (isLessonScope(offspringScope)) requestedLitter = lesson?.litterSize ?? 6
          else if (isLabScope(offspringScope)) requestedLitter = 1
          else requestedLitter = 1 // village breeding is one at a time
        }

        // Only village creatures count against the stable cap.
        if (offspringScope === 'village') {
          const villageSize = Object.values(state.creatures).filter(
            c => isVillageScope(c.scope),
          ).length
          if (villageSize + requestedLitter > state.stableCap) return null
        }

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
        // Re-validate any pending hypotheses on the parents — new evidence may
        // just have made a previously-insufficient hypothesis pass.
        get().setHypothesis(motherId, '', '')
        get().setHypothesis(fatherId, '', '')
        return record
      },

      setHypothesis(creatureId, geneId, text) {
        const state = get()
        const creature = state.creatures[creatureId]
        if (!creature) return

        const geneIds = geneId ? [geneId] : Object.keys(state.hypotheses[creatureId] ?? {})

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
              tier: (state.currentLessonId
                ? lessonById[state.currentLessonId]?.validationTier
                : 'medium') ?? 'medium',
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

        if (state.currentLessonId) {
          const lesson = lessonById[state.currentLessonId]
          if (
            lesson &&
            lesson.correctAssertions.every(a => {
              const assignments = get().lessonCreatures[lesson.id]
              if (!assignments) return false
              const cId = assignments[a.creatureRole === 'mother' ? 'motherId' : 'fatherId']
              return get().validated[cId]?.[a.geneId]
            })
          ) {
            completeCurrentLessonInternal(set, get)
          }
        }
      },

      setNote(creatureId, text) {
        set(s => ({ notes: { ...s.notes, [creatureId]: text } }))
      },

      showNextHint(lessonId) {
        set(s => ({
          hintsShownForLesson: {
            ...s.hintsShownForLesson,
            [lessonId]: (s.hintsShownForLesson[lessonId] ?? 0) + 1,
          },
        }))
      },

      openLab(orderTemplateId) {
        const template = orderTemplateById[orderTemplateId]
        if (!template) return
        const state = get()
        // Reuse existing lab creatures for this order if they already exist.
        const hasExisting = Object.values(state.creatures).some(c =>
          isLabScope(c.scope, orderTemplateId),
        )
        if (!hasExisting) {
          const newCreatures: Record<string, Creature> = {}
          for (const starter of template.labStarters) {
            const id = nextId('c')
            newCreatures[id] = {
              id,
              speciesId: blobSpecies.id,
              ownerName: starter.defaultName,
              sex: starter.sex,
              genotype: starter.genotype,
              age: 1,
              scope: labScope(orderTemplateId),
            }
          }
          set(s => ({
            creatures: { ...s.creatures, ...newCreatures },
            activeLabOrderId: orderTemplateId,
          }))
        } else {
          set({ activeLabOrderId: orderTemplateId })
        }
      },

      closeLab() {
        set({ activeLabOrderId: null })
      },

      fulfillOrder(orderTemplateId, creatureId) {
        const template = orderTemplateById[orderTemplateId]
        const state = get()
        const creature = state.creatures[creatureId]
        if (!template || !creature) return false
        // Deliveries only accept a blob from THIS order's lab pool.
        if (!isLabScope(creature.scope, orderTemplateId)) return false
        const phenotype = computePhenotype(creature, blobSpecies)
        for (const [traitId, expected] of Object.entries(template.requiredPhenotype)) {
          if (phenotype[traitId] !== expected) return false
        }
        // Drop every creature in this order's lab pool + their notes/hypotheses.
        const nextCreatures: Record<string, Creature> = {}
        const nextNotes: Record<string, string> = { ...state.notes }
        const nextHypotheses = { ...state.hypotheses }
        const nextValidated = { ...state.validated }
        for (const [id, c] of Object.entries(state.creatures)) {
          if (isLabScope(c.scope, orderTemplateId)) {
            delete nextNotes[id]
            delete nextHypotheses[id]
            delete nextValidated[id]
          } else {
            nextCreatures[id] = c
          }
        }
        // Prune cross history whose participants no longer exist.
        const nextHistory = state.crossHistory.filter(
          r => nextCreatures[r.motherId] && nextCreatures[r.fatherId],
        )
        const nextCompletedOrders = [...state.completedOrders, orderTemplateId]
        const nextUnlockedLessons = recomputeUnlockedLessons(
          state.completedLessons,
          nextCompletedOrders,
        )
        set(s => ({
          creatures: nextCreatures,
          notes: nextNotes,
          hypotheses: nextHypotheses,
          validated: nextValidated,
          crossHistory: nextHistory,
          coins: s.coins + template.coinReward,
          activeOrders: s.activeOrders.filter(id => id !== orderTemplateId),
          completedOrders: nextCompletedOrders,
          activeLabOrderId: null,
          unlockedLessons: nextUnlockedLessons,
        }))
        return true
      },

      releaseCreature(creatureId) {
        set(s => {
          if (!s.creatures[creatureId]) return {}
          const { [creatureId]: _, ...rest } = s.creatures
          return { creatures: rest }
        })
      },

      renameCreature(creatureId, name) {
        set(s => {
          const creature = s.creatures[creatureId]
          if (!creature) return {}
          return {
            creatures: {
              ...s.creatures,
              [creatureId]: { ...creature, ownerName: name },
            },
          }
        })
      },

      setDifficultyTier(tier) {
        set({ difficultyTier: tier })
      },

      setActiveModal(modal) {
        set({ activeModal: modal })
      },

      markAutoOpened() {
        set({ hasAutoOpened: true })
      },

      reset() {
        set(initialState())
      },
    }),
    {
      name: 'gene-detective-save-v3',
      version: 3,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// -- lesson-completion logic (kept outside the action object so setHypothesis
//    can call it without going through the action lookup) ------------------

// Mark the lesson complete: unlock rewards, note completion. Do NOT touch
// currentLessonId or activeModal — the runner stays open so the player can
// keep reading. Creature cleanup happens later in finishLessonInternal when
// the player leaves the runner.
function completeCurrentLessonInternal(
  set: (partial: Partial<GameState>) => void,
  get: () => GameState & GameActions,
): void {
  const state = get()
  const lessonId = state.currentLessonId
  if (!lessonId) return
  if (state.completedLessons.includes(lessonId)) return
  const lesson = lessonById[lessonId]
  if (!lesson) return

  const nextCompletedLessons = [...state.completedLessons, lessonId]
  const nextUnlockedLessons = recomputeUnlockedLessons(
    nextCompletedLessons,
    state.completedOrders,
  )
  const newChars = Array.from(new Set([
    ...state.unlockedCharacters,
    ...(lesson.unlocks.characters ?? []),
  ]))
  const newTraits = Array.from(new Set([
    ...state.unlockedTraits,
    ...(lesson.unlocks.traits ?? []),
  ]))

  set({
    completedLessons: nextCompletedLessons,
    unlockedLessons: nextUnlockedLessons,
    unlockedCharacters: newChars,
    unlockedTraits: newTraits,
    justCompletedLessonId: lessonId,
  })
}

// Called when the player leaves an active lesson (Return-to-orders / X close).
// If the lesson was completed:
//   - and lesson.awardsStarterBlobs → promote the two starters to the village,
//     discard other lesson-scoped offspring for this lesson.
//   - otherwise → discard the whole lesson pool.
// If the lesson was NOT completed, keep the pool intact so the player can
// resume where they left off.
function finishLessonInternal(
  lessonId: string,
  set: (partial: Partial<GameState>) => void,
  get: () => GameState & GameActions,
): void {
  const state = get()
  const lesson = lessonById[lessonId]
  if (!lesson) return
  const wasCompleted = state.completedLessons.includes(lessonId)
  if (!wasCompleted) return

  const assignments = state.lessonCreatures[lessonId]
  const keepIds = new Set<string>()
  if (lesson.awardsStarterBlobs && assignments) {
    keepIds.add(assignments.motherId)
    keepIds.add(assignments.fatherId)
  }

  const nextCreatures: Record<string, Creature> = {}
  for (const [id, c] of Object.entries(state.creatures)) {
    if (isLessonScope(c.scope, lessonId)) {
      if (keepIds.has(id)) nextCreatures[id] = { ...c, scope: 'village' }
    } else {
      nextCreatures[id] = c
    }
  }
  const nextHistory = state.crossHistory.filter(
    r => nextCreatures[r.motherId] && nextCreatures[r.fatherId],
  )
  const { [lessonId]: _drop, ...remainingLessonCreatures } = state.lessonCreatures
  set({
    creatures: nextCreatures,
    crossHistory: nextHistory,
    lessonCreatures: remainingLessonCreatures,
    justCompletedLessonId: null,
  })
}

// -- read helpers ----------------------------------------------------------

function findCorrectGenotype(
  state: GameState,
  creatureId: string,
  geneId: string,
): string | null {
  for (const [lessonId, assignments] of Object.entries(state.lessonCreatures)) {
    const lesson = lessonById[lessonId]
    if (!lesson) continue
    if (assignments.motherId === creatureId) {
      const a = lesson.correctAssertions.find(
        x => x.creatureRole === 'mother' && x.geneId === geneId,
      )
      if (a) return a.correctGenotype
    }
    if (assignments.fatherId === creatureId) {
      const a = lesson.correctAssertions.find(
        x => x.creatureRole === 'father' && x.geneId === geneId,
      )
      if (a) return a.correctGenotype
    }
  }
  return null
}

// Village creatures (the player's permanent collection).
export function useVillageCreatures(): Creature[] {
  const creatures = useGameStore(s => s.creatures)
  return useMemo(
    () => Object.values(creatures).filter(c => isVillageScope(c.scope)),
    [creatures],
  )
}

// Lab creatures for a specific order (i.e., the current lab session's pool).
export function useLabCreatures(orderId: string | null): Creature[] {
  const creatures = useGameStore(s => s.creatures)
  return useMemo(
    () =>
      orderId
        ? Object.values(creatures).filter(c => isLabScope(c.scope, orderId))
        : [],
    [creatures, orderId],
  )
}

export function useCurrentLesson() {
  return useGameStore(s => (s.currentLessonId ? lessonById[s.currentLessonId] : null))
}
