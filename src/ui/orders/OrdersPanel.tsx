import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { lessons, orderTemplates, characterById } from '../../content'
import { LessonRunner } from '../lessons/LessonRunner'

export function OrdersPanel() {
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const startLesson = useGameStore(s => s.startLesson)
  const unlockedLessons = useGameStore(s => s.unlockedLessons)
  const completedLessons = useGameStore(s => s.completedLessons)
  const unlockedChars = useGameStore(s => s.unlockedCharacters)
  const completedOrders = useGameStore(s => s.completedOrders)
  const openLab = useGameStore(s => s.openLab)

  // Runner takes over the whole panel as long as a lesson is active — even
  // after it's been completed, so the player can keep reading the glossary
  // and dismiss on their own terms.
  if (currentLessonId) {
    return <LessonRunner />
  }

  const availableLessons = lessons.filter(
    l => unlockedLessons.includes(l.id) && !completedLessons.includes(l.id),
  )
  const doneLessons = lessons.filter(l => completedLessons.includes(l.id))

  const availableOrders = orderTemplates.filter(
    o => unlockedChars.includes(o.characterId) && !completedOrders.includes(o.id),
  )

  // A lesson is "gated" when it isn't yet unlocked but the previous lesson is
  // complete — pending some orders. Surface that in the UI.
  const gatedLessons = lessons.filter(l => {
    if (unlockedLessons.includes(l.id) || completedLessons.includes(l.id)) return false
    // Find the previous lesson
    const sorted = [...lessons].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex(x => x.id === l.id)
    const prev = idx > 0 ? sorted[idx - 1] : null
    return !!prev && completedLessons.includes(prev.id)
  })

  return (
    <div className="space-y-8">
      {availableLessons.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            🎓 New lesson
          </h3>
          <div className="space-y-3">
            {availableLessons.map(l => (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => startLesson(l.id)}
                className="w-full text-left rounded-xl border-2 border-purple-300 bg-purple-50 p-5 hover:bg-purple-100 hover:border-purple-400 transition-colors"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Lesson {l.order}
                </div>
                <div className="text-lg font-bold text-slate-800">{l.title}</div>
                <div className="text-sm text-slate-600 mt-1">{l.concept}</div>
                <div className="mt-2 text-xs text-purple-700 font-medium">
                  Start lesson →
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {unlockedChars.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            📋 Available orders
          </h3>
          {availableOrders.length === 0 ? (
            <div className="text-slate-500 italic text-sm">
              No new orders right now. Complete more lessons to unlock new characters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableOrders.map(o => {
                const char = characterById[o.characterId]!
                const traits = Object.entries(o.requiredPhenotype)
                  .map(([t, v]) => `${t}=${v}`)
                  .join(', ')
                return (
                  <motion.button
                    key={o.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openLab(o.id)}
                    className="text-left p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{char.emoji}</span>
                      <div>
                        <div className="font-semibold text-slate-800">{char.name}</div>
                        <div className="text-xs text-slate-500">
                          Tier {o.tier} · 🪙 {o.coinReward}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-700 italic mb-1">
                      "{char.voice.orderIntro}"
                    </div>
                    <div className="text-sm text-slate-700 mb-2">{o.flavorText}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-slate-500">
                        target: {traits}
                      </div>
                      <div className="text-xs text-purple-700 font-medium">
                        Enter the lab →
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </section>
      )}

      {gatedLessons.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            🔒 Locked lessons
          </h3>
          <div className="space-y-3">
            {gatedLessons.map(l => {
              const sorted = [...lessons].sort((a, b) => a.order - b.order)
              const idx = sorted.findIndex(x => x.id === l.id)
              const prev = idx > 0 ? sorted[idx - 1] : null
              const pending = prev
                ? prev.gateOrderIds.filter(id => !completedOrders.includes(id))
                : []
              return (
                <div
                  key={l.id}
                  className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lesson {l.order}
                  </div>
                  <div className="text-lg font-bold text-slate-800">{l.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{l.concept}</div>
                  <div className="text-xs text-slate-500 mt-2">
                    {pending.length > 0
                      ? `Complete ${pending.length} more order${pending.length === 1 ? '' : 's'} to unlock.`
                      : 'Ready to unlock.'}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {doneLessons.length > 0 && (
        <section className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            ✓ Completed lessons
          </h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {doneLessons.map(l => (
              <li key={l.id}>
                Lesson {l.order}: {l.title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
