import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { lessonById } from '../../content'
import { CreatureCard } from '../shared/CreatureCard'
import { NotebookPanel } from '../notebook/NotebookPanel'
import { GlossaryAccordion, ParagraphedText } from '../glossary/GlossaryAccordion'

export function LessonRunner() {
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const setCurrentLesson = useGameStore(s => s.setCurrentLesson)
  const lessonCreatures = useGameStore(s =>
    currentLessonId ? s.lessonCreatures[currentLessonId] : undefined,
  )
  const creatures = useGameStore(s => s.creatures)
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

  if (!lesson || !lessonCreatures) {
    return (
      <div className="p-4 text-slate-500">
        No lesson active.{' '}
        <button
          onClick={() => setCurrentLesson(null)}
          className="text-purple-600 hover:underline"
        >
          Back to lessons list
        </button>
      </div>
    )
  }

  const mother = creatures[lessonCreatures.motherId]
  const father = creatures[lessonCreatures.fatherId]
  if (!mother || !father) return null

  const canShowHintButton = breedsSince >= 4 && hintsShown < lesson.hints.length
  const nextHint = lesson.hints[hintsShown - 1] // showing 1..N shown, hint 0 is first

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl">
      <div className="lg:col-span-3">
        <button
          onClick={() => setCurrentLesson(null)}
          className="text-sm text-purple-600 hover:underline mb-2"
        >
          ← Back to lessons
        </button>
        <div className="text-xs text-slate-500 uppercase tracking-wide">
          Lesson {lesson.order} · {lesson.concept}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{lesson.title}</h2>

        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="text-slate-700 text-sm leading-relaxed">
            <ParagraphedText text={lesson.intro} />
          </div>
        </div>

        {isCompleted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <div className="font-semibold">🎉 Lesson complete!</div>
            <div className="text-sm mt-1">
              You've deduced both genotypes with real evidence. New content unlocked —
              check the Lessons list, Codex, and Orders.
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs text-slate-500 mb-2">Mother</div>
            <CreatureCard creature={mother} />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-2">Father</div>
            <CreatureCard creature={father} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => breed(mother.id, father.id, lesson.litterSize)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 shadow-sm"
          >
            ❤️ Breed the pair (litter of {lesson.litterSize})
          </button>
          <span className="text-xs text-slate-500">
            Watch what phenotypes appear — that's your evidence.
          </span>
        </div>

        <NotebookPanel
          motherId={mother.id}
          fatherId={father.id}
          geneIds={geneIds}
        />
      </div>

      <aside className="lg:col-span-1 space-y-4">
        <GlossaryAccordion termIds={lesson.pinnedGlossaryTerms} />
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Stuck?
          </h3>
          {hintsShown > 0 && nextHint && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
              <div className="text-xs font-medium uppercase tracking-wide text-amber-700 mb-1">
                Hint {hintsShown}: {nextHint.stage}
              </div>
              {nextHint.text}
            </div>
          )}
          <button
            onClick={() => currentLessonId && showNextHint(currentLessonId)}
            disabled={!canShowHintButton}
            className={
              'w-full px-3 py-2 rounded text-sm font-medium ' +
              (canShowHintButton
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed')
            }
          >
            {hintsShown < lesson.hints.length
              ? canShowHintButton
                ? `Show hint ${hintsShown + 1} of ${lesson.hints.length}`
                : `Breed ${4 - breedsSince} more time(s) to unlock a hint`
              : 'No more hints'}
          </button>
        </div>
      </aside>
    </div>
  )
}
