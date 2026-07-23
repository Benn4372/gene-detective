import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { missionById, characterById, blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { SexBadge } from '../atoms/SexBadge'
import { Modal } from '../atoms/Modal'
import { Workbench } from '../workbench/Workbench'
import { Notecard } from './Notecard'

// A single self-contained mission puzzle. Two starter samples on the bench,
// a Workbench for breeding, and a "Deliver a blob…" button that opens a
// picker of only the phenotype-matching bred offspring.
export function MissionRunner() {
  const activeMissionId = useGameStore(s => s.activeMissionId)
  const creatures = useGameStore(s => s.creatures)
  const closeMission = useGameStore(s => s.closeMission)
  const submit = useGameStore(s => s.submitMissionBlob)
  const [motherId, setMotherId] = useState<string | null>(null)
  const [fatherId, setFatherId] = useState<string | null>(null)
  const [deliverOpen, setDeliverOpen] = useState(false)

  const mission = activeMissionId ? missionById[activeMissionId] : null
  const client = mission ? characterById[mission.clientCharacterId] : null

  // Pool = everything in this mission's scope.
  const pool: Creature[] = useMemo(() => {
    if (!activeMissionId) return []
    return Object.values(creatures).filter(
      c =>
        typeof c.scope !== 'string' &&
        c.scope.kind === 'mission' &&
        c.scope.missionId === activeMissionId,
    )
  }, [creatures, activeMissionId])

  const starters = useMemo(() => pool.filter(c => !c.parentIds), [pool])
  const offspring = useMemo(() => pool.filter(c => !!c.parentIds), [pool])

  // Default the workbench picker to the two starters on first load.
  useEffect(() => {
    setMotherId(null)
    setFatherId(null)
    setDeliverOpen(false)
    const s = pool.filter(c => !c.parentIds)
    const f = s.find(c => c.sex === 'F')
    const m = s.find(c => c.sex === 'M')
    if (f) setMotherId(f.id)
    if (m) setFatherId(m.id)
  }, [activeMissionId, pool.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mission || !client) {
    return <div className="min-h-screen p-6 text-stone-500 italic">No mission open.</div>
  }

  const targetText = Object.entries(mission.targetPhenotype)
    .map(([t, v]) => `${t}=${v}`)
    .join(', ')

  const isDeliverable = (c: Creature) => {
    if (!c.parentIds) return false
    const phen = computePhenotype(c, blobSpecies)
    return Object.entries(mission.targetPhenotype).every(
      ([t, v]) => phen[t] === v,
    )
  }
  const deliverable = offspring.filter(isDeliverable)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={closeMission}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Back to Missions Board
        </button>

        <div className="text-xs uppercase tracking-widest text-stone-500">
          Mission
        </div>
        <h1 className="text-2xl font-bold text-stone-800 font-serif mb-3">
          Case from {client.name}
        </h1>

        {/* Client brief */}
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <div className="text-4xl flex-shrink-0">{client.emoji}</div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">
              {client.name}
            </div>
            <div className="text-sm text-stone-800 italic">"{mission.clientBrief}"</div>
            <div className="text-xs text-stone-600 mt-2 font-mono">
              Target phenotype: {targetText}
              {mission.breedBudget ? ` · Budget: ${mission.breedBudget} crosses` : ''}
            </div>
          </div>
        </div>

        <div className="mb-4 rounded p-3 bg-stone-100 border border-stone-200 text-sm text-stone-700">
          <strong>Lab rules:</strong> two unknown samples are on the bench. Their
          genotypes are a mystery — you'll have to figure them out on your own,
          with no notebook validation to help. Breed to test hypotheses, fill in
          the notecards, and deliver a bred offspring that matches the target.
          The two starter samples belong to the lab and can never be delivered.
        </div>

        {/* Sample notecards */}
        <div className="mb-4">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
            Samples
          </div>
          <div className="flex gap-2 flex-wrap">
            {starters.map(c => (
              <Notecard
                key={c.id}
                creature={c}
                visibleGeneIds={mission.visibleGeneIds}
              />
            ))}
          </div>
        </div>

        {/* Bred offspring — collapsed notecards */}
        {offspring.length > 0 && (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
              Bred offspring ({offspring.length})
            </div>
            <div className="flex gap-2 flex-wrap">
              {offspring.map(c => (
                <Notecard
                  key={c.id}
                  creature={c}
                  visibleGeneIds={mission.visibleGeneIds}
                />
              ))}
            </div>
          </div>
        )}

        {/* Workbench for breeding */}
        <Workbench
          pool={pool}
          motherId={motherId}
          fatherId={fatherId}
          onSelectMother={setMotherId}
          onSelectFather={setFatherId}
          visibleGeneIds={mission.visibleGeneIds}
          litterSize={1}
          breedBudgetHint={
            mission.breedBudget
              ? `Target ≤${mission.breedBudget} crosses for full mastery`
              : undefined
          }
        />

        {/* Deliver button */}
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDeliverOpen(true)}
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm"
          >
            📦 Deliver a blob…
          </motion.button>
        </div>
      </div>

      <DeliverPicker
        open={deliverOpen}
        onClose={() => setDeliverOpen(false)}
        deliverable={deliverable}
        offspringCount={offspring.length}
        starterCount={starters.length}
        targetText={targetText}
        visibleGeneIds={mission.visibleGeneIds}
        onDeliver={id => {
          const ok = submit(mission.id, id)
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
    <Modal open={open} onClose={onClose} title="Deliver a blob" icon="📦" z={60}>
      <div className="mb-3 text-sm text-stone-600">
        Only bred offspring can be delivered — the {starterCount} starter samples
        belong to the lab and never leave.
      </div>
      <div className="mb-4 text-sm">
        <strong>Target phenotype:</strong>{' '}
        <span className="font-mono">{targetText}</span>
      </div>
      {deliverable.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-stone-700">
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
                  className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 flex flex-col items-center"
                >
                  <BlobRenderer creature={c} species={blobSpecies} size={72} />
                  <div className="flex items-center gap-1 text-xs mt-2 text-stone-700">
                    <SexBadge sex={c.sex} />
                    <span className="font-mono">
                      {visibleGeneIds.map(t => phen[t]).join(' · ')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeliver(c.id)}
                    className="mt-3 w-full px-3 py-2 bg-emerald-600 text-white text-sm rounded font-medium hover:bg-emerald-700"
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
