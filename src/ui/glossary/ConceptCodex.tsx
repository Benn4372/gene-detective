import { useMemo, useState } from 'react'
import { glossaryTerms } from '../../content'
import { useGameStore } from '../../state/gameStore'
import { lessons } from '../../content'
import { ParagraphedText } from './GlossaryAccordion'

// All terms unlocked by any completed lesson + the currently-active lesson.
function unlockedTermIds(completed: string[], current: string | null): Set<string> {
  const ids = new Set<string>()
  for (const lesson of lessons) {
    const isActive = current === lesson.id
    const isDone = completed.includes(lesson.id)
    if (isActive || isDone) {
      lesson.pinnedGlossaryTerms.forEach(id => ids.add(id))
    }
  }
  return ids
}

export function ConceptCodex() {
  const completed = useGameStore(s => s.completedLessons)
  const current = useGameStore(s => s.currentLessonId)
  const unlocked = useMemo(() => unlockedTermIds(completed, current), [completed, current])
  const [selected, setSelected] = useState<string | null>(null)

  const visible = glossaryTerms.filter(t => unlocked.has(t.id))
  const selectedTerm = selected ? glossaryTerms.find(t => t.id === selected) : null

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Concept Codex</h2>
      <p className="text-sm text-slate-500 mb-6">
        Every term you've unlocked through lessons, in one place.
      </p>

      {visible.length === 0 ? (
        <div className="text-slate-500 italic">
          Complete lessons to unlock glossary entries.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-1">
            {visible.map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={
                  'block w-full text-left px-3 py-2 rounded text-sm ' +
                  (selected === t.id
                    ? 'bg-purple-100 text-purple-800 font-medium'
                    : 'text-slate-700 hover:bg-slate-50')
                }
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="md:col-span-2">
            {selectedTerm ? (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{selectedTerm.name}</h3>
                <div className="text-sm text-slate-700 leading-relaxed">
                  <ParagraphedText text={selectedTerm.overview} />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                    Full article
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <ParagraphedText text={selectedTerm.fullArticle} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic">Pick a term to read it.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
