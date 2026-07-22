import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { lessonById, blobSpecies } from '../../content'
import { CreatureCard } from '../shared/CreatureCard'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { NotebookPanel } from '../notebook/NotebookPanel'
import { GlossaryAccordion, ParagraphedText } from '../glossary/GlossaryAccordion'
import { PhenotypeTally } from '../shared/PhenotypeTally'
import { computePhenotype } from '../../engine/phenotype'
import { Modal } from '../shared/Modal'
import type { Creature } from '../../engine/types'

export function LessonRunner() {
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const setCurrentLesson = useGameStore(s => s.setCurrentLesson)
  const lessonCreatures = useGameStore(s =>
    currentLessonId ? s.lessonCreatures[currentLessonId] : undefined,
  )
  const creatures = useGameStore(s => s.creatures)
  const crossHistoryAll = useGameStore(s => s.crossHistory)
  const breed = useGameStore(s => s.breed)
  const keptIds = useGameStore(s => s.keptIds)
  const toggleKept = useGameStore(s => s.toggleKept)
  const justCompletedLessonId = useGameStore(s => s.justCompletedLessonId)
  const clearJustCompleted = useGameStore(s => s.clearJustCompleted)
  const hintsShown = useGameStore(s =>
    currentLessonId ? (s.hintsShownForLesson[currentLessonId] ?? 0) : 0,
  )
  const breedsSince = useGameStore(s => s.breedsSinceLastNotebookProgress)
  const showNextHint = useGameStore(s => s.showNextHint)
  const isCompleted = useGameStore(s =>
    currentLessonId ? s.completedLessons.includes(currentLessonId) : false,
  )

  const lesson = currentLessonId ? lessonById[currentLessonId] : null

  const geneIds = useMemo(
    () => (lesson ? [...new Set(lesson.correctAssertions.map(a => a.geneId))] : []),
    [lesson],
  )
  const visibleTraitIds = useMemo(() => {
    if (!lesson) return []
    const set = new Set<string>()
    for (const geneId of geneIds) {
      const gene = blobSpecies.genes.find(g => g.id === geneId)
      gene?.expressesTraits.forEach(t => set.add(t))
    }
    return [...set]
  }, [lesson, geneIds])

  const lessonPool: Creature[] = useMemo(() => {
    if (!currentLessonId) return []
    return Object.values(creatures).filter(
      c =>
        typeof c.scope !== 'string' &&
        c.scope.kind === 'lesson' &&
        c.scope.lessonId === currentLessonId,
    )
  }, [creatures, currentLessonId])

  const [motherPick, setMotherPick] = useState<string | null>(null)
  const [fatherPick, setFatherPick] = useState<string | null>(null)
  useEffect(() => {
    if (lessonCreatures) {
      setMotherPick(prev => prev ?? lessonCreatures.motherId)
      setFatherPick(prev => prev ?? lessonCreatures.fatherId)
    }
  }, [lessonCreatures])

  if (!lesson || !lessonCreatures) {
    return (
      <div className="p-4 text-slate-500">
        No lesson active.{' '}
        <button
          onClick={() => setCurrentLesson(null)}
          className="text-purple-600 hover:underline"
        >
          Back to orders
        </button>
      </div>
    )
  }

  const starterMother = creatures[lessonCreatures.motherId]
  const starterFather = creatures[lessonCreatures.fatherId]
  if (!starterMother || !starterFather) return null

  // Cross history filtered to this lesson.
  const lessonCrosses = crossHistoryAll.filter(r => {
    const m = creatures[r.motherId]
    return (
      m &&
      typeof m.scope !== 'string' &&
      m.scope.kind === 'lesson' &&
      m.scope.lessonId === lesson.id
    )
  })
  const latestLitter = lessonCrosses[lessonCrosses.length - 1]
  const latestLitterIds = new Set(latestLitter?.offspringIds ?? [])

  // Every offspring bred in this lesson, for the running tally.
  const allOffspring: Creature[] = []
  for (const record of lessonCrosses) {
    for (const oId of record.offspringIds) {
      const child = creatures[oId]
      if (child) allOffspring.push(child)
    }
  }

  const starterIds = new Set([lessonCreatures.motherId, lessonCreatures.fatherId])
  const keptSet = new Set(keptIds)

  // Picker visibility: starters + kept + latest litter (dedup).
  const pickerPool = lessonPool.filter(
    c =>
      starterIds.has(c.id) || keptSet.has(c.id) || latestLitterIds.has(c.id),
  )
  const pickerFemales = pickerPool.filter(c => c.sex === 'F')
  const pickerMales = pickerPool.filter(c => c.sex === 'M')

  const canBreed =
    motherPick !== null && fatherPick !== null && motherPick !== fatherPick
  const handleBreed = () => {
    if (!canBreed || !motherPick || !fatherPick) return
    breed(motherPick, fatherPick, lesson.litterSize)
  }

  const HINT_THRESHOLD = 4
  const thresholdMet = breedsSince >= HINT_THRESHOLD
  const hasMoreHints = hintsShown < lesson.hints.length
  const showHintPanel = thresholdMet && hasMoreHints
  const nextHint = lesson.hints[hintsShown - 1]

  const showCompletionPopup = justCompletedLessonId === currentLessonId

  return (
    <div>
      {/* Title */}
      <div className="text-xs text-slate-500 uppercase tracking-wide">
        Lesson {lesson.order} · {lesson.concept}
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">{lesson.title}</h2>

      {/* Intro (collapsed to short) */}
      <details className="bg-white/70 rounded-lg border border-slate-200 p-4 mb-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          📖 Read the intro
        </summary>
        <div className="text-slate-700 text-sm leading-relaxed mt-3">
          <ParagraphedText text={lesson.intro} />
        </div>
      </details>

      {isCompleted && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-center justify-between">
          <span>
            <strong>✓ Lesson complete!</strong> Keep exploring or head back to orders.
          </span>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentLesson(null)}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700"
          >
            Return to orders →
          </motion.button>
        </div>
      )}

      {/* Mystery blobs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Mother (mystery)</div>
          <CreatureCard creature={starterMother} visibleTraitIds={visibleTraitIds} />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Father (mystery)</div>
          <CreatureCard creature={starterFather} visibleTraitIds={visibleTraitIds} />
        </div>
      </div>

      {/* Notebook */}
      <NotebookPanel
        motherId={starterMother.id}
        fatherId={starterFather.id}
        geneIds={geneIds}
      />

      {/* Breeding picker + prominent Breed CTA */}
      <div className="mt-4 rounded-xl border-2 border-pink-200 bg-pink-50/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Breeding
          </h3>
          <span className="text-xs text-slate-500">
            Pick any ♀ and any ♂ from the pool — offspring only stay in the picker
            for one round unless you click <span className="text-emerald-600 font-bold">✓</span> to keep them.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <PickerColumn
            label="Female (♀)"
            color="text-pink-700"
            list={pickerFemales}
            selectedId={motherPick}
            onSelect={setMotherPick}
            starterIds={starterIds}
            keptSet={keptSet}
            latestLitterIds={latestLitterIds}
            toggleKept={toggleKept}
            visibleTraitIds={visibleTraitIds}
          />
          <PickerColumn
            label="Male (♂)"
            color="text-blue-700"
            list={pickerMales}
            selectedId={fatherPick}
            onSelect={setFatherPick}
            starterIds={starterIds}
            keptSet={keptSet}
            latestLitterIds={latestLitterIds}
            toggleKept={toggleKept}
            visibleTraitIds={visibleTraitIds}
          />
        </div>
        <motion.button
          whileHover={{ scale: canBreed ? 1.02 : 1 }}
          whileTap={{ scale: canBreed ? 0.97 : 1 }}
          onClick={handleBreed}
          disabled={!canBreed}
          className={
            'w-full px-6 py-4 rounded-lg font-bold text-lg shadow-md transition-colors ' +
            (canBreed
              ? 'bg-pink-600 text-white hover:bg-pink-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed')
          }
        >
          ❤️ Breed selected pair (litter of {lesson.litterSize})
        </motion.button>

        {latestLitter && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 mb-2">
              Latest litter · {latestLitter.offspringIds.length} offspring
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {latestLitter.offspringIds.map((id, idx) => {
                  const child = creatures[id]
                  if (!child) return null
                  const phen = computePhenotype(child, blobSpecies)
                  const kept = keptSet.has(id)
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ delay: idx * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                      className="relative flex flex-col items-center"
                    >
                      <BlobRenderer creature={child} species={blobSpecies} size={56} />
                      <div className="flex items-center gap-1 text-[10px] mt-0.5">
                        <SexBadge sex={child.sex} />
                        <span className="font-mono text-slate-600">
                          {visibleTraitIds.map(t => phen[t]).join(' · ')}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleKept(id)}
                        title={kept ? 'Kept — click to release' : 'Keep in picker'}
                        className={
                          'absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center border ' +
                          (kept
                            ? 'bg-green-500 text-white border-green-600'
                            : 'bg-white text-slate-400 border-slate-300 hover:text-green-600 hover:border-green-400')
                        }
                      >
                        ✓
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {allOffspring.length > 0 && (
          <div className="mt-3">
            <PhenotypeTally
              offspring={allOffspring}
              visibleTraitIds={visibleTraitIds}
            />
          </div>
        )}
      </div>

      {/* Glossary at the bottom (collapsed by default) */}
      <details className="mt-4 rounded-lg border border-slate-200 bg-white/70 p-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          📚 Concept glossary ({lesson.pinnedGlossaryTerms.length} terms)
        </summary>
        <div className="mt-3">
          <GlossaryAccordion termIds={lesson.pinnedGlossaryTerms} title="" />
        </div>
      </details>

      {/* Hint panel appears inline once threshold met */}
      <AnimatePresence>
        {showHintPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-white rounded-lg border border-slate-200 p-4"
          >
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Stuck?
            </h3>
            {hintsShown > 0 && nextHint && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-700 mb-1">
                  Hint {hintsShown} · {nextHint.stage}
                </div>
                {nextHint.text}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => currentLessonId && showNextHint(currentLessonId)}
              className="w-full px-3 py-2 rounded text-sm font-medium bg-amber-500 text-white hover:bg-amber-600"
            >
              Show hint {hintsShown + 1} of {lesson.hints.length}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congrats popup — shown once per completion */}
      <Modal
        open={showCompletionPopup}
        onClose={clearJustCompleted}
        title="Lesson complete!"
        icon="🎉"
        z={80}
      >
        <div className="text-center py-4">
          <div className="text-5xl mb-3">🎊</div>
          <div className="text-lg font-semibold text-slate-800 mb-2">
            You cracked Lesson {lesson.order}: {lesson.title}
          </div>
          <div className="text-sm text-slate-600 mb-6">
            {lesson.awardsStarterBlobs
              ? 'The two starter blobs will join your village when you return.'
              : 'Concept mastered. Take your new understanding into the orders.'}
          </div>
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clearJustCompleted}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
            >
              Continue exploring
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                clearJustCompleted()
                setCurrentLesson(null)
              }}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              Return to orders →
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Compact picker column: shows small blob thumbnails with select-on-click and
// a keep-toggle for offspring.
function PickerColumn({
  label,
  color,
  list,
  selectedId,
  onSelect,
  starterIds,
  keptSet,
  latestLitterIds,
  toggleKept,
  visibleTraitIds,
}: {
  label: string
  color: string
  list: Creature[]
  selectedId: string | null
  onSelect(id: string): void
  starterIds: Set<string>
  keptSet: Set<string>
  latestLitterIds: Set<string>
  toggleKept(id: string): void
  visibleTraitIds: string[]
}) {
  if (list.length === 0) {
    return (
      <div>
        <div className={'text-xs font-semibold mb-2 ' + color}>{label}</div>
        <div className="text-slate-500 italic text-xs">None available.</div>
      </div>
    )
  }
  return (
    <div>
      <div className={'text-xs font-semibold mb-2 ' + color}>{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {list.map(c => {
          const isStarter = starterIds.has(c.id)
          const kept = keptSet.has(c.id)
          const isLatest = latestLitterIds.has(c.id)
          const phen = computePhenotype(c, blobSpecies)
          return (
            <div key={c.id} className="relative">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={
                  'w-full flex flex-col items-center rounded border p-1 bg-white text-xs transition-colors ' +
                  (selectedId === c.id
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-slate-400')
                }
              >
                <BlobRenderer creature={c} species={blobSpecies} size={48} />
                {isStarter && (
                  <span className="text-[9px] uppercase tracking-wide text-emerald-700 font-semibold">
                    starter
                  </span>
                )}
                <div className="font-mono text-[10px] text-slate-600 truncate max-w-[70px]">
                  {visibleTraitIds.map(t => phen[t]).join(' · ')}
                </div>
              </button>
              {!isStarter && (isLatest || kept) && (
                <button
                  onClick={() => toggleKept(c.id)}
                  title={kept ? 'Kept — click to release' : 'Keep in picker across breeds'}
                  className={
                    'absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center border ' +
                    (kept
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-slate-400 border-slate-300 hover:text-green-600 hover:border-green-400')
                  }
                >
                  ✓
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
