import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { SexBadge } from '../atoms/SexBadge'
import { Modal } from '../atoms/Modal'
import { Workbench } from '../workbench/Workbench'
import { Notecard } from '../mission/Notecard'
import { MissionNotebook } from '../mission/MissionNotebook'

// The Field Assignments Runner. Procedurally-rolled breeding puzzles: pick
// two of the four starters, breed until you get an offspring whose phenotype
// matches the assignment target, then deliver. Unlimited crosses, no scoring.
// After each successful delivery, offer to roll another.
export function FieldAssignmentsRunner() {
  const assignment = useGameStore(s => s.fieldAssignment)
  const creatures = useGameStore(s => s.creatures)
  const roll = useGameStore(s => s.rollFieldAssignment)
  const clear = useGameStore(s => s.clearFieldAssignment)
  const submit = useGameStore(s => s.submitFieldAssignmentBlob)
  const [motherId, setMotherId] = useState<string | null>(null)
  const [fatherId, setFatherId] = useState<string | null>(null)
  const [deliverOpen, setDeliverOpen] = useState(false)
  const [lastRejectedId, setLastRejectedId] = useState<string | null>(null)
  const [completedFlash, setCompletedFlash] = useState(false)

  // Auto-roll a puzzle the first time the player enters if there isn't one.
  useEffect(() => {
    if (!assignment) roll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pool = every field-scoped creature (starters + bred offspring).
  const pool: Creature[] = useMemo(() => {
    return Object.values(creatures).filter(
      c => typeof c.scope !== 'string' && c.scope.kind === 'field-assignment',
    )
  }, [creatures])

  const starters = useMemo(() => pool.filter(c => !c.parentIds), [pool])
  const offspring = useMemo(() => pool.filter(c => !!c.parentIds), [pool])

  // Seed the picker to the first F/M pair only once per puzzle (keyed by
  // starterIds identity) — subsequent breeds don't reset the player's choice.
  const starterKey = assignment?.starterIds.join(',') ?? ''
  const seededForRef = useRef<string>('')
  useEffect(() => {
    if (seededForRef.current === starterKey) return
    if (starters.length === 0) return
    seededForRef.current = starterKey
    setDeliverOpen(false)
    setMotherId(starters.find(c => c.sex === 'F')?.id ?? null)
    setFatherId(starters.find(c => c.sex === 'M')?.id ?? null)
  }, [starterKey, starters])

  if (!assignment) {
    return (
      <div className="min-h-screen p-6 text-stone-500 italic">
        Rolling a fresh puzzle...
      </div>
    )
  }

  const target = assignment.targetPhenotype
  const targetText = Object.entries(target)
    .map(([tid, val]) => {
      const trait = blobSpecies.traits.find(t => t.id === tid)
      return `${trait?.name ?? tid}: ${phenotypeLabel(tid, val)}`
    })
    .join(' · ')

  const isDeliverable = (c: Creature) => {
    if (!c.parentIds) return false
    const phen = computePhenotype(c, blobSpecies)
    return Object.entries(target).every(([tid, v]) => phen[tid] === v)
  }
  const deliverableOffspring = offspring.filter(isDeliverable)

  const visibleGeneIds = Object.keys(target)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={clear}
            className="text-sm text-stone-500 hover:text-stone-800"
          >
            ← Return to Station
          </button>
          <button
            onClick={() => {
              if (!window.confirm('Skip this puzzle and roll a new one?')) return
              roll()
              seededForRef.current = ''
            }}
            className="text-xs uppercase tracking-wide text-stone-400 hover:text-amber-600 border border-stone-300 hover:border-amber-300 rounded px-2 py-1"
          >
            🎲 Roll new puzzle
          </button>
        </div>

        <div className="text-xs uppercase tracking-widest text-stone-500">
          Field Assignment
        </div>
        <h1 className="text-2xl font-bold text-stone-800 font-serif mb-3">
          Procedural breeding puzzle
        </h1>

        {/* Wanted phenotype */}
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">
            Wanted phenotype ({Object.keys(target).length} features)
          </div>
          <div className="text-sm font-mono text-stone-800">{targetText}</div>
          <div className="text-xs text-stone-600 italic mt-2">
            Pick a pair from the four samples below, breed, inspect the
            offspring. Deliver one whose phenotype matches. Unlimited crosses.
          </div>
        </div>

        {/* Sample notecards — horizontal scroll for the 4-blob bench */}
        <div className="mb-4">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
            Samples
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {starters.map(c => (
              <div key={c.id} className="flex-shrink-0">
                <Notecard creature={c} visibleGeneIds={visibleGeneIds} />
              </div>
            ))}
          </div>
        </div>

        {offspring.length > 0 && (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
              Bred offspring ({offspring.length})
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {offspring.map(c => (
                <div key={c.id} className="flex-shrink-0">
                  <Notecard creature={c} visibleGeneIds={visibleGeneIds} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <MissionNotebook blobs={pool} visibleGeneIds={visibleGeneIds} />
        </div>

        <Workbench
          pool={pool}
          motherId={motherId}
          fatherId={fatherId}
          onSelectMother={setMotherId}
          onSelectFather={setFatherId}
          visibleGeneIds={visibleGeneIds}
          litterSize={4}
        />

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
        onClose={() => {
          setDeliverOpen(false)
          setLastRejectedId(null)
        }}
        offspring={deliverableOffspring}
        starterCount={starters.length}
        visibleGeneIds={visibleGeneIds}
        lastRejectedId={lastRejectedId}
        targetText={targetText}
        onDeliver={id => {
          const ok = submit(id)
          if (ok) {
            setDeliverOpen(false)
            setLastRejectedId(null)
            setCompletedFlash(true)
          } else {
            setLastRejectedId(id)
          }
        }}
      />

      {/* Win modal — offer to roll another */}
      <Modal
        open={completedFlash}
        onClose={() => {
          setCompletedFlash(false)
          clear()
        }}
        title="Delivered!"
        icon="🎉"
        z={70}
      >
        <div className="text-sm text-stone-700 mb-4">
          The blob matched every wanted feature. Roll another puzzle, or head
          back to the Station.
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setCompletedFlash(false)
              clear()
            }}
            className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-100"
          >
            Return to Station
          </button>
          <button
            onClick={() => {
              setCompletedFlash(false)
              roll()
              seededForRef.current = ''
            }}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            🎲 Roll another
          </button>
        </div>
      </Modal>
    </div>
  )
}

interface DeliverProps {
  open: boolean
  onClose(): void
  offspring: Creature[]
  starterCount: number
  visibleGeneIds: string[]
  lastRejectedId: string | null
  targetText: string
  onDeliver(id: string): void
}

function DeliverPicker({
  open,
  onClose,
  offspring,
  starterCount,
  visibleGeneIds,
  lastRejectedId,
  targetText,
  onDeliver,
}: DeliverProps) {
  return (
    <Modal open={open} onClose={onClose} title="Deliver a blob" icon="📦" z={60}>
      <div className="mb-3 text-sm text-stone-600">
        Only bred offspring can be delivered — the {starterCount} starter samples
        belong to the field lab and never leave.
      </div>
      <div className="mb-3 text-sm rounded p-2 bg-amber-50 border border-amber-200">
        <strong className="text-amber-800">Wanted phenotype:</strong>{' '}
        <span className="font-mono text-stone-800">{targetText}</span>
      </div>
      {offspring.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-stone-700">
          No offspring match yet. Keep crossing.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {offspring.map(c => {
              const phen = computePhenotype(c, blobSpecies)
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={
                    'rounded-lg border-2 p-2 flex flex-col items-center cursor-pointer bg-white ' +
                    (lastRejectedId === c.id
                      ? 'border-rose-400 shadow-md'
                      : 'border-stone-300 hover:border-emerald-400')
                  }
                  onClick={() => onDeliver(c.id)}
                >
                  <BlobRenderer creature={c} species={blobSpecies} size={72} />
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <SexBadge sex={c.sex} />
                    <span className="font-mono text-stone-700">
                      {visibleGeneIds.map(t => phenotypeLabel(t, phen[t])).join(' · ')}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </Modal>
  )
}
