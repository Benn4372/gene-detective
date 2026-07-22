import { lessons } from '../../content'
import { useGameStore } from '../../state/gameStore'

export function LessonsList() {
  const unlocked = useGameStore(s => s.unlockedLessons)
  const completed = useGameStore(s => s.completedLessons)
  const startLesson = useGameStore(s => s.startLesson)

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Lessons</h2>
      <p className="text-sm text-slate-500 mb-6">
        Each lesson teaches one new concept. Concepts unlock in order — complete a lesson
        to unlock the next one and to get new traits available in the shop.
      </p>
      <div className="space-y-3">
        {lessons.map(lesson => {
          const isUnlocked = unlocked.includes(lesson.id)
          const isDone = completed.includes(lesson.id)
          return (
            <div
              key={lesson.id}
              className={
                'rounded-lg border p-4 flex items-center justify-between ' +
                (isUnlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60')
              }
            >
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  Lesson {lesson.order}
                </div>
                <div className="text-lg font-semibold text-slate-800">{lesson.title}</div>
                <div className="text-sm text-slate-600 mt-1">{lesson.concept}</div>
              </div>
              <div className="flex items-center gap-2">
                {isDone && <span className="text-green-600 text-sm">✓ Done</span>}
                {isUnlocked ? (
                  <button
                    onClick={() => startLesson(lesson.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 text-sm"
                  >
                    {isDone ? 'Revisit' : 'Start'}
                  </button>
                ) : (
                  <span className="text-slate-400 text-sm">🔒 Locked</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
