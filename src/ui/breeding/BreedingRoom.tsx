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
  const releaseCreature = useGameStore(s => s.releaseCreature)
  const renameCreature = useGameStore(s => s.renameCreature)
  const creatures = useGameStore(s => s.creatures)

  const [motherId, setMotherId] = useState<string | null>(null)
  const [fatherId, setFatherId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const females = villageCreatures.filter(c => c.sex === 'F' && c.id !== pendingId)
  const males = villageCreatures.filter(c => c.sex === 'M' && c.id !== pendingId)
  const canBreed = !pendingId && motherId && fatherId && motherId !== fatherId

  const pendingChild = pendingId ? creatures[pendingId] : null

  const handleBreed = () => {
    if (!canBreed || !motherId || !fatherId) return
    const record = breed(motherId, fatherId, 1)
    if (record && record.offspringIds[0]) {
      setPendingId(record.offspringIds[0])
      setRenameValue('')
    }
  }

  const handleKeep = () => {
    if (!pendingId) return
    // Rename if the player typed something; otherwise leave the auto-name.
    if (renameValue.trim()) renameCreature(pendingId, renameValue.trim())
    setPendingId(null)
    setRenameValue('')
  }

  const handleRelease = () => {
    if (!pendingId) return
    releaseCreature(pendingId)
    setPendingId(null)
    setRenameValue('')
  }

  if (villageCreatures.length < 2) {
    return (
      <div className="text-slate-500 italic text-sm">
        You need at least two blobs (one female, one male) to breed. Complete
        Lesson 1 to earn your first pair.
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-6">
        Pick a mother and a father from your village. Each cross gives you one
        offspring — you can Keep it (it joins the village) or Release it.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-pink-700 mb-3">Mother (♀)</h3>
          {females.length === 0 ? (
            <div className="text-slate-500 italic text-sm">No females available.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {females.map(c => (
                <CreatureCard
                  key={c.id}
                  creature={c}
                  compact
                  hideDetails
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
            <div className="text-slate-500 italic text-sm">No males available.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {males.map(c => (
                <CreatureCard
                  key={c.id}
                  creature={c}
                  compact
                  hideDetails
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
        ❤️ Breed (one offspring)
      </motion.button>

      <AnimatePresence>
        {pendingChild && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mt-6 p-6 bg-white rounded-xl border-2 border-pink-300 shadow-lg text-center"
          >
            <div className="text-sm text-slate-500 mb-3">A new blob!</div>
            <div className="flex justify-center mb-3">
              <BlobRenderer creature={pendingChild} species={blobSpecies} size={120} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2 text-sm">
              <SexBadge sex={pendingChild.sex} />
              <span className="font-mono text-slate-700">
                {blobSpecies.traits
                  .map(t => `${t.name}: ${computePhenotype(pendingChild, blobSpecies)[t.id]}`)
                  .join(' · ')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 mb-4">
              <input
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                placeholder="Optional name"
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleKeep}
                className="px-5 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
              >
                ✓ Keep in village
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRelease}
                className="px-5 py-2 bg-slate-200 text-slate-700 rounded font-medium hover:bg-slate-300"
              >
                Release
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
