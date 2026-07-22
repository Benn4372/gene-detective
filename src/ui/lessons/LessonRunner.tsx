import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { lessonById, blobSpecies } from '../../content'
import { CreatureCard } from '../shared/CreatureCard'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { NotebookPanel } from '../notebook/NotebookPanel'
import { GlossaryAccordion, ParagraphedText } from '../glossary/GlossaryAccordion'
import { computePhenotype } from '../../engine/phenotype'

export function LessonRunner({ onClose }: { onClose?(): void } = {}) {
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

  // Traits the lesson actually cares about — used to hide unrelated ones from cards.
  const visibleTraitIds = useMemo(() => {
    if (!lesson) return []
    const set = new Set<string>()
    for (const geneId of geneIds) {
      const gene = blobSpecies.genes.find(g => g.id === geneId)
      gene?.expressesTraits.forEach(t => set.add(t))
    }
    return [...set]
  }, [lesson, geneIds])

  if (!lesson || !lessonCreatures) {
    return (
      <div className="p-4 text-slate-500">
        No lesson active.{' '}
        <button
          onClick={() => (onClose ?? (() => setCurrentLesson(null)))()}
          className="text-purple-600 hover:underline"
        >
          Close
        </button>
      </div>
    )
  }

  const mother = creatures[lessonCreatures.motherId]
  const father = creatures[lessonCreatures.fatherId]
  if (!mother || !father) return null

  // The most recent litter from this specific pair (shown as real blobs, replacing any prior).
  const latestLitter = [...crossHistoryAll]
    .reverse()
    .find(
      r =>
        (r.motherId === mother.id || r.motherId === father.id) &&
        (r.fatherId === mother.id || r.fatherId === father.id),
    )

  const HINT_THRESHOLD = 4
  const thresholdMet = breedsSince >= HINT_THRESHOLD
  const hasMoreHints = hintsShown < lesson.hints.length
  const showHintPanel = thresholdMet && hasMoreHints
  const nextHint = lesson.hints[hintsShown - 1]

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

        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
            >
              <div className="font-semibold">🎉 Lesson complete!</div>
              <div className="text-sm mt-1">
                Both parents have been awarded to your village. Check the Orders panel
                for new jobs.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <div className="text-xs text-slate-500 mb-2">Mother</div>
            <CreatureCard creature={mother} visibleTraitIds={visibleTraitIds} />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-2">Father</div>
            <CreatureCard creature={father} visibleTraitIds={visibleTraitIds} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => breed(mother.id, father.id, lesson.litterSize)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 shadow-sm"
          >
            ❤️ Breed the pair (litter of {lesson.litterSize})
          </motion.button>
          <span className="text-xs text-slate-500">
            Watch what phenotypes appear — that's your evidence.
          </span>
        </div>

        {latestLitter && (
          <div className="mb-6 p-4 bg-white/80 border border-slate-200 rounded-lg">
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
                      transition={{ delay: idx * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
                      className="flex flex-col items-center"
                    >
                      <BlobRenderer creature={child} species={blobSpecies} size={72} />
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

        <NotebookPanel
          motherId={mother.id}
          fatherId={father.id}
          geneIds={geneIds}
        />
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
