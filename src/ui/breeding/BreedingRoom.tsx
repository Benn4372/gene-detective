import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, useVillageCreatures } from '../../state/gameStore'
import { CreatureCard } from '../shared/CreatureCard'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'

export function BreedingRoom() {
  const villageCreatures = useVillageCreatures()
  const breed = useGameStore(s => s.breed)
  const [motherId, setMotherId] = useState<string | null>(null)
  const [fatherId, setFatherId] = useState<string | null>(null)
  const [lastLitter, setLastLitter] = useState<string[]>([])
  const creatures = useGameStore(s => s.creatures)

  const females = villageCreatures.filter(c => c.sex === 'F')
  const males = villageCreatures.filter(c => c.sex === 'M')

  const canBreed = motherId && fatherId && motherId !== fatherId

  const handleBreed = () => {
    if (!canBreed || !motherId || !fatherId) return
    const record = breed(motherId, fatherId)
    if (record) setLastLitter(record.offspringIds)
  }

  if (villageCreatures.length === 0) {
    return (
      <div className="text-slate-500 italic text-sm">
        Your village is empty. Complete Lesson 1 to earn your first pair of blobs.
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-6">
        Pick a mother and a father from your village. Their offspring join the village.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-pink-700 mb-3">Mother (♀)</h3>
          {females.length === 0 ? (
            <div className="text-slate-500 italic text-sm">No females yet.</div>
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
            <div className="text-slate-500 italic text-sm">No males yet.</div>
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
        ❤️ Breed
      </motion.button>

      {lastLitter.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-3">
            Latest litter ({lastLitter.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {lastLitter.map((id, idx) => {
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
                    <BlobRenderer creature={child} species={blobSpecies} size={80} />
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <SexBadge sex={child.sex} />
                      <span className="font-mono text-slate-600">
                        {blobSpecies.traits.map(t => phen[t.id]).join(' · ')}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
