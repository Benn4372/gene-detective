import { useState } from 'react'
import { useGameStore } from '../../state/gameStore'
import {
  orderTemplates,
  characterById,
  blobSpecies,
} from '../../content'
import { CreatureCard } from '../shared/CreatureCard'
import { computePhenotype } from '../../engine/phenotype'

export function OrdersBoard() {
  const unlockedChars = useGameStore(s => s.unlockedCharacters)
  const completedOrders = useGameStore(s => s.completedOrders)
  const creatures = useGameStore(s => s.creatures)
  const fulfillOrder = useGameStore(s => s.fulfillOrder)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const available = orderTemplates.filter(
    o => unlockedChars.includes(o.characterId) && !completedOrders.includes(o.id),
  )
  const selected = selectedOrderId ? orderTemplates.find(o => o.id === selectedOrderId) : null
  const character = selected ? characterById[selected.characterId] : null

  const matchingCreatures = selected
    ? Object.values(creatures).filter(c => {
        const phen = computePhenotype(c, blobSpecies)
        return Object.entries(selected.requiredPhenotype).every(
          ([traitId, expected]) => phen[traitId] === expected,
        )
      })
    : []

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Orders</h2>
      <p className="text-sm text-slate-500 mb-6">
        Complete an order by delivering a blob that matches. Coins are your budget for
        buying new blobs later (shop coming in the next phase).
      </p>

      {unlockedChars.length === 0 ? (
        <div className="text-slate-500 italic">
          Complete Lesson 1 to unlock your first character and their orders.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {available.map(o => {
            const char = characterById[o.characterId]!
            const traits = Object.entries(o.requiredPhenotype)
              .map(([t, v]) => `${t}=${v}`)
              .join(', ')
            return (
              <button
                key={o.id}
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
                    <div className="text-xs text-slate-500">Tier {o.tier} · 🪙 {o.coinReward}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-700 mb-2">{o.flavorText}</div>
                <div className="text-xs font-mono text-slate-500">Needs: {traits}</div>
              </button>
            )
          })}
          {available.length === 0 && (
            <div className="text-slate-500 italic">
              No new orders right now. Check back after unlocking more characters.
            </div>
          )}
        </div>
      )}

      {selected && character && (
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-semibold mb-3">Deliver a match</h3>
          {matchingCreatures.length === 0 ? (
            <div className="text-slate-500 text-sm">
              No blobs in your stable match this order yet. Breed one that does.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {matchingCreatures.map(c => (
                <div key={c.id}>
                  <CreatureCard creature={c} compact />
                  <button
                    onClick={() => {
                      const ok = fulfillOrder(selected.id, c.id)
                      if (ok) setSelectedOrderId(null)
                    }}
                    className="mt-2 w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Deliver
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
