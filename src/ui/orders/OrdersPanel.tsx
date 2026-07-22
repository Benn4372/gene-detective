import { motion } from 'framer-motion'
import { useGameStore, useVillageCreatures } from '../../state/gameStore'
import {
  lessons,
  orderTemplates,
  characterById,
  blobSpecies,
} from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { CreatureCard } from '../shared/CreatureCard'
import { LessonRunner } from '../lessons/LessonRunner'
import { useState } from 'react'

export function OrdersPanel() {
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const startLesson = useGameStore(s => s.startLesson)
  const setCurrentLesson = useGameStore(s => s.setCurrentLesson)
  const unlockedLessons = useGameStore(s => s.unlockedLessons)
  const completedLessons = useGameStore(s => s.completedLessons)
  const unlockedChars = useGameStore(s => s.unlockedCharacters)
  const completedOrders = useGameStore(s => s.completedOrders)
  const villageCreatures = useVillageCreatures()
  const fulfillOrder = useGameStore(s => s.fulfillOrder)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // If a lesson is in progress, the runner takes over the whole panel.
  if (currentLessonId && !completedLessons.includes(currentLessonId)) {
    return (
      <div>
        <button
          onClick={() => setCurrentLesson(null)}
          className="text-sm text-purple-600 hover:underline mb-4"
        >
          ← Back to orders
        </button>
        <LessonRunner onClose={() => setCurrentLesson(null)} />
      </div>
    )
  }

  // Lessons the player can start (unlocked & not completed).
  const availableLessons = lessons.filter(
    l => unlockedLessons.includes(l.id) && !completedLessons.includes(l.id),
  )
  const doneLessons = lessons.filter(l => completedLessons.includes(l.id))

  // Orders whose owning character is unlocked and which aren't done yet.
  const availableOrders = orderTemplates.filter(
    o => unlockedChars.includes(o.characterId) && !completedOrders.includes(o.id),
  )
  const selectedOrder = selectedOrderId
    ? orderTemplates.find(o => o.id === selectedOrderId)
    : null
  const selectedChar = selectedOrder ? characterById[selectedOrder.characterId] : null

  const matchingCreatures = selectedOrder
    ? villageCreatures.filter(c => {
        const phen = computePhenotype(c, blobSpecies)
        return Object.entries(selectedOrder.requiredPhenotype).every(
          ([t, v]) => phen[t] === v,
        )
      })
    : []

  return (
    <div className="space-y-8">
      {/* Lessons block */}
      {availableLessons.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            🎓 New lessons
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

      {/* Orders block */}
      {unlockedChars.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            📋 Available orders
          </h3>
          {availableOrders.length === 0 ? (
            <div className="text-slate-500 italic text-sm">
              No new orders right now. Complete more lessons to unlock characters.
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
                    onClick={() => setSelectedOrderId(o.id)}
                    className={
                      'text-left p-4 bg-white rounded-lg border transition-all ' +
                      (selectedOrderId === o.id
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-slate-200 hover:shadow-md')
                    }
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
                    <div className="text-xs font-mono text-slate-500">Needs: {traits}</div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Selected order → delivery panel */}
      {selectedOrder && selectedChar && (
        <section className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-semibold mb-3">Deliver a matching blob</h3>
          {matchingCreatures.length === 0 ? (
            <div className="text-slate-500 text-sm">
              No village blobs match this order yet. Breed one — check the ❤️ Breed
              button.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {matchingCreatures.map(c => (
                <div key={c.id}>
                  <CreatureCard creature={c} compact hideDetails />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const ok = fulfillOrder(selectedOrder.id, c.id)
                      if (ok) setSelectedOrderId(null)
                    }}
                    className="mt-2 w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Deliver
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Completed lessons — collapsed footer for revisit */}
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
