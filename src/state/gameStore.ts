import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Creature } from '../engine/types'
import { cross as engineCross } from '../engine/cross'
import { makeRandom } from '../engine/random'
import { computePhenotype } from '../engine/phenotype'
import { validateHypothesis, canonicalizeHypothesis } from '../engine/validators'
import { blobSpecies, lessonById, orderTemplateById } from '../content'
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
  }
}

interface GameActions {
  startLesson(lessonId: string): void
  setCurrentLesson(lessonId: string | null): void
  breed(
    motherId: string,
    fatherId: string,
    litterSize?: number,
  ): CrossRecord | null
  setHypothesis(creatureId: string, geneId: string, text: string): void
  showNextHint(lessonId: string): void
  acceptOrder(orderTemplateId: string): void
  fulfillOrder(orderTemplateId: string, creatureId: string): boolean
  releaseCreature(creatureId: string): void
  renameCreature(creatureId: string, name: string): void
  setDifficultyTier(tier: DifficultyTier): void
  completeCurrentLesson(): void
  reset(): void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState(),

      startLesson(lessonId) {
        const lesson = lessonById[lessonId]
        if (!lesson) return
        // If we've already set up creatures for this lesson, just reactivate.
        const existing = get().lessonCreatures[lessonId]
        if (existing) {
          set({ currentLessonId: lessonId, breedsSinceLastNotebookProgress: 0 })
          return
        }
        // Otherwise create the starter creatures.
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
        set({ currentLessonId: lessonId, breedsSinceLastNotebookProgress: 0 })
      },

      breed(motherId, fatherId, litterSize) {
        const state = get()
        const mom = state.creatures[motherId]
        const dad = state.creatures[fatherId]
        if (!mom || !dad) return null
        if (mom.sex === dad.sex) return null

        // Enforce storage cap; if full, refuse and let UI show a message.
        const currentSize = Object.keys(state.creatures).length
        const lesson = state.currentLessonId ? lessonById[state.currentLessonId] : null
        const requestedLitter = litterSize ?? lesson?.litterSize ?? 6
        if (currentSize + requestedLitter > state.stableCap) {
          return null
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
        // Re-run validation for any pending hypotheses on the two parents — new
        // evidence may have just made a previously-insufficient hypothesis pass.
        get().setHypothesis(motherId, '', '')
        get().setHypothesis(fatherId, '', '')
        return record
      },

      setHypothesis(creatureId, geneId, text) {
        const state = get()
        const creature = state.creatures[creatureId]
        if (!creature) return

        // Special call form: geneId === '' means "re-validate everything for this creature".
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

          // Find the correct genotype for this creature+gene by looking up the current lesson.
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

        // Check if the current lesson is now complete.
        if (state.currentLessonId) {
          const lesson = lessonById[state.currentLessonId]
          if (lesson && lesson.correctAssertions.every(a => {
            const assignments = get().lessonCreatures[lesson.id]
            if (!assignments) return false
            const cId = assignments[a.creatureRole === 'mother' ? 'motherId' : 'fatherId']
            return get().validated[cId]?.[a.geneId]
          })) {
            get().completeCurrentLesson()
          }
        }
      },

      showNextHint(lessonId) {
        set(s => ({
          hintsShownForLesson: {
            ...s.hintsShownForLesson,
            [lessonId]: (s.hintsShownForLesson[lessonId] ?? 0) + 1,
          },
        }))
      },

      acceptOrder(orderTemplateId) {
        const t = orderTemplateById[orderTemplateId]
        if (!t) return
        set(s => ({
          activeOrders: s.activeOrders.includes(orderTemplateId)
            ? s.activeOrders
            : [...s.activeOrders, orderTemplateId],
        }))
      },

      fulfillOrder(orderTemplateId, creatureId) {
        const t = orderTemplateById[orderTemplateId]
        const state = get()
        const creature = state.creatures[creatureId]
        if (!t || !creature) return false
        const phenotype = computePhenotype(creature, blobSpecies)
        for (const [traitId, expected] of Object.entries(t.requiredPhenotype)) {
          if (phenotype[traitId] !== expected) return false
        }
        const { [creatureId]: _removed, ...remainingCreatures } = state.creatures
        set(s => ({
          creatures: remainingCreatures,
          coins: s.coins + t.coinReward,
          activeOrders: s.activeOrders.filter(id => id !== orderTemplateId),
          completedOrders: [...s.completedOrders, orderTemplateId],
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

      reset() {
        set(initialState())
      },

      completeCurrentLesson() {
        const state = get()
        const lessonId = state.currentLessonId
        if (!lessonId) return
        if (state.completedLessons.includes(lessonId)) return
        const lesson = lessonById[lessonId]
        if (!lesson) return

        // Unlock next lesson if there is one.
        const allLessons = Object.values(lessonById).sort((a, b) => a.order - b.order)
        const idx = allLessons.findIndex(l => l.id === lessonId)
        const nextLesson = allLessons[idx + 1]
        const newUnlocked = nextLesson
          ? Array.from(new Set([...state.unlockedLessons, nextLesson.id]))
          : state.unlockedLessons

        const newChars = Array.from(new Set([
          ...state.unlockedCharacters,
          ...(lesson.unlocks.characters ?? []),
        ]))
        const newTraits = Array.from(new Set([
          ...state.unlockedTraits,
          ...(lesson.unlocks.traits ?? []),
        ]))

        set({
          completedLessons: [...state.completedLessons, lessonId],
          unlockedLessons: newUnlocked,
          unlockedCharacters: newChars,
          unlockedTraits: newTraits,
        })
      },
    }),
    {
      name: 'gene-detective-save-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// -- helpers ---------------------------------------------------------------

function findCorrectGenotype(
  state: GameState,
  creatureId: string,
  geneId: string,
): string | null {
  // For MVP: only lesson creatures have correct genotypes tracked.
  // Look through all lessons to find which creature this is and what genotype the lesson asserts.
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

// Convenience selectors
export function useCurrentLesson() {
  return useGameStore(s => (s.currentLessonId ? lessonById[s.currentLessonId] : null))
}
