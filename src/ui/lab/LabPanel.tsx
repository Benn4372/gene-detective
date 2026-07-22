import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, useLabCreatures } from '../../state/gameStore'
import { orderTemplateById, characterById, blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { Notecard } from './Notecard'

// Self-contained puzzle for a single order. Player starts with two unknown
// "sample" blobs, breeds them one at a time, and tries to produce a blob
// matching the target phenotype — with only their own notes to help.
export function LabPanel() {
  const activeLabOrderId = useGameStore(s => s.activeLabOrderId)
  const labCreatures = useLabCreatures(activeLabOrderId)
  const breed = useGameStore(s => s.breed)
  const fulfillOrder = useGameStore(s => s.fulfillOrder)
  const closeLab = useGameStore(s => s.closeLab)
  const [selectedM, setSelectedM] = useState<string | null>(null)
  const [selectedF, setSelectedF] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const order = activeLabOrderId ? orderTemplateById[activeLabOrderId] : null
  const character = order ? characterById[order.characterId] : null

  // Reset selection when order changes.
  useEffect(() => {
    setSelectedM(null)
    setSelectedF(null)
    setBanner(null)
  }, [activeLabOrderId])

  const females = useMemo(() => labCreatures.filter(c => c.sex === 'F'), [labCreatures])
  const males = useMemo(() => labCreatures.filter(c => c.sex === 'M'), [labCreatures])

  const canBreed = selectedM && selectedF
  const handleBreed = () => {
    if (!selectedM || !selectedF) return
    breed(selectedF, selectedM, 1)
    setBanner('New offspring below — check its phenotype.')
    setTimeout(() => setBanner(null), 3000)
  }

  if (!order || !character) {
    return <div className="text-slate-500 italic">No lab open.</div>
  }

  // A blob is "deliverable" if its phenotype matches every required trait.
  const isDeliverable = (creatureId: string) => {
    const c = labCreatures.find(x => x.id === creatureId)
    if (!c) return false
    const phen = computePhenotype(c, blobSpecies)
    return Object.entries(order.requiredPhenotype).every(
      ([t, v]) => phen[t] === v,
    )
  }

  const targetText = Object.entries(order.requiredPhenotype)
    .map(([t, v]) => `${t}=${v}`)
    .join(', ')

  return (
    <div>
      {/* Client brief */}
      <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{character.emoji}</span>
          <div>
            <div className="font-semibold text-slate-800">{character.name}</div>
            <div className="text-xs text-slate-500">
              🪙 {order.coinReward} · target phenotype:{' '}
              <span className="font-mono">{targetText}</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-700 italic">
          "{character.voice.orderIntro}"
        </div>
        <div className="text-sm text-slate-700 mt-1">{order.flavorText}</div>
      </div>

      <div className="mb-4 p-3 rounded bg-slate-100 border border-slate-200 text-sm text-slate-700">
        <strong>Lab rules:</strong> two unknown blobs are on the bench. Their
        genotypes are a mystery — you'll have to figure them out on your own,
        with no validation. Breed to test hypotheses, fill in the notecards, and
        deliver a blob that matches the target.
      </div>

      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-sm text-green-800"
          >
            {banner}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-pink-700 font-semibold mb-2">
            Females (♀)
          </div>
          {females.length === 0 ? (
            <div className="text-slate-500 italic text-sm">None yet.</div>
          ) : (
            <div className="space-y-3">
              {females.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Notecard
                      creature={c}
                      visibleGeneIds={order.visibleGeneIds}
                      selected={selectedF === c.id}
                      onSelect={() => setSelectedF(c.id)}
                    />
                  </div>
                  {isDeliverable(c.id) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fulfillOrder(order.id, c.id)}
                      className="px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 whitespace-nowrap"
                    >
                      Deliver ✓
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold mb-2">
            Males (♂)
          </div>
          {males.length === 0 ? (
            <div className="text-slate-500 italic text-sm">None yet.</div>
          ) : (
            <div className="space-y-3">
              {males.map(c => (
                <div key={c.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Notecard
                      creature={c}
                      visibleGeneIds={order.visibleGeneIds}
                      selected={selectedM === c.id}
                      onSelect={() => setSelectedM(c.id)}
                    />
                  </div>
                  {isDeliverable(c.id) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fulfillOrder(order.id, c.id)}
                      className="px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 whitespace-nowrap"
                    >
                      Deliver ✓
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
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
          ❤️ Cross selected pair (1 offspring)
        </motion.button>
        <button
          onClick={closeLab}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Pause and return to orders →
        </button>
      </div>
    </div>
  )
}
