import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, useLabCreatures } from '../../state/gameStore'
import { orderTemplateById, characterById, blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { Notecard } from './Notecard'
import { PhenotypeTally } from '../shared/PhenotypeTally'
import { Modal } from '../shared/Modal'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import type { Creature } from '../../engine/types'

export function LabPanel() {
  const activeLabOrderId = useGameStore(s => s.activeLabOrderId)
  const labCreatures = useLabCreatures(activeLabOrderId)
  const breed = useGameStore(s => s.breed)
  const fulfillOrder = useGameStore(s => s.fulfillOrder)
  const closeLab = useGameStore(s => s.closeLab)
  const [selectedM, setSelectedM] = useState<string | null>(null)
  const [selectedF, setSelectedF] = useState<string | null>(null)
  const [deliverOpen, setDeliverOpen] = useState(false)

  const order = activeLabOrderId ? orderTemplateById[activeLabOrderId] : null
  const character = order ? characterById[order.characterId] : null

  useEffect(() => {
    setSelectedM(null)
    setSelectedF(null)
    setDeliverOpen(false)
  }, [activeLabOrderId])

  // Starters have no parentIds — everything else is a bred offspring.
  const starters = useMemo(() => labCreatures.filter(c => !c.parentIds), [labCreatures])
  const offspring = useMemo(() => labCreatures.filter(c => c.parentIds), [labCreatures])
  const females = useMemo(() => labCreatures.filter(c => c.sex === 'F'), [labCreatures])
  const males = useMemo(() => labCreatures.filter(c => c.sex === 'M'), [labCreatures])

  const canBreed = selectedM && selectedF
  const handleBreed = () => {
    if (!selectedM || !selectedF) return
    breed(selectedF, selectedM, 1)
  }

  if (!order || !character) {
    return <div className="text-slate-500 italic">No lab open.</div>
  }

  // A blob is deliverable if:
  //   (1) it's a bred offspring (never one of the starter samples), AND
  //   (2) its phenotype matches every required trait.
  const isDeliverable = (c: Creature) => {
    if (!c.parentIds) return false
    const phen = computePhenotype(c, blobSpecies)
    return Object.entries(order.requiredPhenotype).every(([t, v]) => phen[t] === v)
  }

  const deliverable = offspring.filter(isDeliverable)

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
        <div className="text-sm text-slate-700 italic">"{character.voice.orderIntro}"</div>
        <div className="text-sm text-slate-700 mt-1">{order.flavorText}</div>
      </div>

      <div className="mb-4 p-3 rounded bg-slate-100 border border-slate-200 text-sm text-slate-700">
        <strong>Lab rules:</strong> two unknown blobs are on the bench. Their
        genotypes are a mystery — you'll have to figure them out on your own,
        with no validation. Breed to test hypotheses, fill in the notecards, and
        deliver a bred offspring that matches the target. The two starter
        samples themselves can never be delivered — they belong to the lab.
      </div>

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
                <Notecard
                  key={c.id}
                  creature={c}
                  visibleGeneIds={order.visibleGeneIds}
                  selected={selectedF === c.id}
                  onSelect={() => setSelectedF(c.id)}
                />
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
                <Notecard
                  key={c.id}
                  creature={c}
                  visibleGeneIds={order.visibleGeneIds}
                  selected={selectedM === c.id}
                  onSelect={() => setSelectedM(c.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {offspring.length > 0 && (
        <div className="mb-6">
          <PhenotypeTally
            offspring={offspring}
            visibleTraitIds={order.visibleGeneIds}
            label={`Running totals across ${offspring.length} bred offspring`}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
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

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDeliverOpen(true)}
            className="px-6 py-3 rounded-lg font-medium shadow-sm bg-green-600 text-white hover:bg-green-700"
          >
            📦 Deliver a blob…
          </motion.button>
          <button
            onClick={closeLab}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Pause and leave lab
          </button>
        </div>
      </div>

      <DeliverPicker
        open={deliverOpen}
        onClose={() => setDeliverOpen(false)}
        deliverable={deliverable}
        offspringCount={offspring.length}
        starterCount={starters.length}
        targetText={targetText}
        visibleGeneIds={order.visibleGeneIds}
        onDeliver={id => {
          const ok = fulfillOrder(order.id, id)
          if (ok) setDeliverOpen(false)
        }}
      />
    </div>
  )
}

interface DeliverProps {
  open: boolean
  onClose(): void
  deliverable: Creature[]
  offspringCount: number
  starterCount: number
  targetText: string
  visibleGeneIds: string[]
  onDeliver(id: string): void
}

function DeliverPicker({
  open,
  onClose,
  deliverable,
  offspringCount,
  starterCount,
  targetText,
  visibleGeneIds,
  onDeliver,
}: DeliverProps) {
  return (
    <Modal open={open} onClose={onClose} title="Deliver a blob" icon="📦">
      <div className="mb-3 text-sm text-slate-600">
        Only bred offspring can be delivered — the {starterCount} starter
        samples belong to the lab and never leave.
      </div>
      <div className="mb-4 text-sm">
        <strong>Target phenotype:</strong>{' '}
        <span className="font-mono">{targetText}</span>
      </div>
      {deliverable.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-slate-700">
          {offspringCount === 0
            ? 'No offspring bred yet. Cross the sample pair to produce your first offspring.'
            : `None of your ${offspringCount} bred offspring match the target yet. Keep crossing.`}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {deliverable.map(c => {
              const phen = computePhenotype(c, blobSpecies)
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg border-2 border-green-300 bg-green-50 p-3 flex flex-col items-center"
                >
                  <BlobRenderer creature={c} species={blobSpecies} size={72} />
                  <div className="flex items-center gap-1 text-xs mt-2 text-slate-700">
                    <SexBadge sex={c.sex} />
                    <span className="font-mono">
                      {visibleGeneIds.map(t => phen[t]).join(' · ')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeliver(c.id)}
                    className="mt-3 w-full px-3 py-2 bg-green-600 text-white text-sm rounded font-medium hover:bg-green-700"
                  >
                    Deliver this one ✓
                  </motion.button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </Modal>
  )
}
