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

  // All creatures scoped to this lesson (starters + any bred offspring).
  const lessonPool: Creature[] = useMemo(() => {
    if (!currentLessonId) return []
    return Object.values(creatures).filter(
      c => typeof c.scope !== 'string' && c.scope.kind === 'lesson' && c.scope.lessonId === currentLessonId,
    )
  }, [creatures, currentLessonId])

  // Breeding picker state: defaults to the two starters.
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

  // Everyone in the pool, split by sex, so the picker is grid-friendly.
  const females = lessonPool.filter(c => c.sex === 'F')
  const males = lessonPool.filter(c => c.sex === 'M')

  const canBreed =
    motherPick !== null && fatherPick !== null && motherPick !== fatherPick
  const handleBreed = () => {
    if (!canBreed || !motherPick || !fatherPick) return
    breed(motherPick, fatherPick, lesson.litterSize)
  }

  // Latest litter from ANY cross in this lesson (for the reveal panel).
  const lessonCrosses = crossHistoryAll.filter(r => {
    const m = creatures[r.motherId]
    const f = creatures[r.fatherId]
    return (
      m && f &&
      typeof m.scope !== 'string' && m.scope.kind === 'lesson' && m.scope.lessonId === lesson.id
    )
  })
  const latestLitter = lessonCrosses[lessonCrosses.length - 1]

  // All offspring bred in this lesson (for cumulative phenotype tally).
  const allOffspring: Creature[] = []
  for (const record of lessonCrosses) {
    for (const oId of record.offspringIds) {
      const child = creatures[oId]
      if (child) allOffspring.push(child)
    }
  }

  const HINT_THRESHOLD = 4
  const thresholdMet = breedsSince >= HINT_THRESHOLD
  const hasMoreHints = hintsShown < lesson.hints.length
  const showHintPanel = thresholdMet && hasMoreHints
  const nextHint = lesson.hints[hintsShown - 1]

  const isStarter = (id: string) =>
    id === lessonCreatures.motherId || id === lessonCreatures.fatherId

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="text-xs text-slate-500 uppercase tracking-wide">
          Lesson {lesson.order} · {lesson.concept}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{lesson.title}</h2>

        <div className="bg-white/80 rounded-lg border border-slate-200 p-6 mb-6">
          <div className="text-slate-700 text-sm leading-relaxed">
            <ParagraphedText text={lesson.intro} />
          </div>
        </div>

        {isCompleted && (
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-100 to-pink-100 border-2 border-amber-300 rounded-lg text-slate-800">
            <div className="text-2xl mb-1">🎉</div>
            <div className="font-semibold text-lg">Lesson complete!</div>
            <div className="text-sm mt-1 text-slate-700">
              {lesson.awardsStarterBlobs
                ? 'Your two starter blobs will be added to the village when you return.'
                : 'Concept mastered. No new blobs this time — put your knowledge to use in the orders.'}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentLesson(null)}
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
            >
              Return to orders →
            </motion.button>
          </div>
        )}

        {/* The two "mystery" starter blobs — the ones whose genotypes the
            notebook is asking about. */}
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
          The mystery blobs
        </h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-2">Mother</div>
            <CreatureCard creature={starterMother} visibleTraitIds={visibleTraitIds} />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-2">Father</div>
            <CreatureCard creature={starterFather} visibleTraitIds={visibleTraitIds} />
          </div>
        </div>

        <NotebookPanel
          motherId={starterMother.id}
          fatherId={starterFather.id}
          geneIds={geneIds}
        />

        {/* Breeding picker — defaults to starter pair but you can breed any
            F + M in the pool (including offspring, for backcrosses). */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Breeding
          </h3>
          <div className="text-xs text-slate-500 mb-3">
            Pick any mother and any father from the pool below. Starters are the
            two mystery blobs above; offspring appear once you've bred at least
            once.
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-pink-700 font-semibold mb-2">Female (♀)</div>
              <div className="grid grid-cols-3 gap-2">
                {females.map(c => (
                  <PoolCard
                    key={c.id}
                    creature={c}
                    starter={isStarter(c.id)}
                    selected={motherPick === c.id}
                    onSelect={() => setMotherPick(c.id)}
                    visibleTraitIds={visibleTraitIds}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-700 font-semibold mb-2">Male (♂)</div>
              <div className="grid grid-cols-3 gap-2">
                {males.map(c => (
                  <PoolCard
                    key={c.id}
                    creature={c}
                    starter={isStarter(c.id)}
                    selected={fatherPick === c.id}
                    onSelect={() => setFatherPick(c.id)}
                    visibleTraitIds={visibleTraitIds}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: canBreed ? 1.03 : 1 }}
            whileTap={{ scale: canBreed ? 0.97 : 1 }}
            onClick={handleBreed}
            disabled={!canBreed}
            className={
              'px-6 py-3 rounded-lg font-medium shadow-sm ' +
              (canBreed
                ? 'bg-pink-600 text-white hover:bg-pink-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed')
            }
          >
            ❤️ Cross selected pair (litter of {lesson.litterSize})
          </motion.button>

          {latestLitter && (
            <div className="mt-6 p-4 bg-white/80 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 mb-3">
                Latest litter ({latestLitter.offspringIds.length} offspring)
              </div>
              <div className="flex flex-wrap gap-3">
                <AnimatePresence mode="popLayout">
                  {latestLitter.offspringIds.map((id, idx) => {
                    const child = creatures[id]
                    if (!child) return null
                    const phen = computePhenotype(child, blobSpecies)
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.5, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ delay: idx * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                        className="flex flex-col items-center"
                      >
                        <BlobRenderer creature={child} species={blobSpecies} size={64} />
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <SexBadge sex={child.sex} />
                          <span className="font-mono text-slate-600">
                            {visibleTraitIds.map(t => phen[t]).join(' · ')}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {allOffspring.length > 0 && (
            <div className="mt-4">
              <PhenotypeTally
                offspring={allOffspring}
                visibleTraitIds={visibleTraitIds}
              />
            </div>
          )}
        </div>
      </div>

      <aside className="lg:col-span-1 space-y-4">
        <GlossaryAccordion termIds={lesson.pinnedGlossaryTerms} />
        <AnimatePresence>
          {showHintPanel && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg border border-slate-200 p-4"
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
      </aside>
    </div>
  )
}

// Compact selectable card used inside the lesson breeding picker.
function PoolCard({
  creature,
  starter,
  selected,
  onSelect,
  visibleTraitIds,
}: {
  creature: Creature
  starter: boolean
  selected: boolean
  onSelect(): void
  visibleTraitIds: string[]
}) {
  const phen = computePhenotype(creature, blobSpecies)
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        'flex flex-col items-center rounded border p-1 bg-white text-xs transition-colors ' +
        (selected
          ? 'border-purple-500 ring-2 ring-purple-200'
          : 'border-slate-200 hover:border-slate-400')
      }
    >
      <BlobRenderer creature={creature} species={blobSpecies} size={54} />
      {starter && (
        <span className="mt-0.5 text-[9px] uppercase tracking-wide text-emerald-700 font-semibold">
          starter
        </span>
      )}
      <div className="font-mono text-[10px] text-slate-600 mt-0.5">
        {visibleTraitIds.map(t => phen[t]).join(' · ')}
      </div>
    </button>
  )
}
