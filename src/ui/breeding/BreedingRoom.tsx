import { useState } from 'react'
import { useGameStore } from '../../state/gameStore'
import { CreatureCard } from '../shared/CreatureCard'

export function BreedingRoom() {
  const creatures = useGameStore(s => s.creatures)
  const breed = useGameStore(s => s.breed)
  const [motherId, setMotherId] = useState<string | null>(null)
  const [fatherId, setFatherId] = useState<string | null>(null)
  const [lastLitter, setLastLitter] = useState<string[]>([])

  const females = Object.values(creatures).filter(c => c.sex === 'F')
  const males = Object.values(creatures).filter(c => c.sex === 'M')

  const canBreed = motherId && fatherId && motherId !== fatherId

  const handleBreed = () => {
    if (!canBreed || !motherId || !fatherId) return
    const record = breed(motherId, fatherId)
    if (record) setLastLitter(record.offspringIds)
  }

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Breeding Room</h2>
      <p className="text-sm text-slate-500 mb-6">
        Pick a mother and a father from your stable. Their offspring go into your stable.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-pink-700 mb-3">Mother (♀)</h3>
          {females.length === 0 ? (
            <div className="text-slate-500 italic">No females in stable.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {females.map(c => (
                <CreatureCard
                  key={c.id}
                  creature={c}
                  compact
                  onClick={() => setMotherId(c.id)}
                  selected={motherId === c.id}
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-blue-700 mb-3">Father (♂)</h3>
          {males.length === 0 ? (
            <div className="text-slate-500 italic">No males in stable.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {males.map(c => (
                <CreatureCard
                  key={c.id}
                  creature={c}
                  compact
                  onClick={() => setFatherId(c.id)}
                  selected={fatherId === c.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleBreed}
        disabled={!canBreed}
        className={
          'px-6 py-3 rounded-lg font-medium shadow-sm ' +
          (canBreed
            ? 'bg-pink-600 text-white hover:bg-pink-700'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed')
        }
      >
        ❤️ Breed
      </button>

      {lastLitter.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-3">
            Litter of {lastLitter.length}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {lastLitter.map(id => {
              const child = creatures[id]
              return child ? (
                <CreatureCard key={id} creature={child} compact />
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
