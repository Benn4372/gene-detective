import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { missionById, characterById, blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { SexBadge } from '../atoms/SexBadge'
import { Modal } from '../atoms/Modal'
import { Workbench } from '../workbench/Workbench'
import { PedigreeViewer } from '../pedigree/PedigreeViewer'
import { MissionNotebook } from './MissionNotebook'
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
  const [lastRejectedId, setLastRejectedId] = useState<string | null>(null)

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

  // Reset picker + seed the first F/M starter pair on mission change ONLY.
  // Previously this depended on pool.length, which fired the effect after
  // every breed and yanked the player's picks back to the starters — so
  // newly-bred blobs could never be used as parents in a follow-up cross.
  //
  // Seeded once per mission id, only after starters exist. Once seeded we
  // never overwrite the player's picks, no matter how the pool changes.
  const missionKey = activeMissionId ?? ''
  const seededForRef = useRef<string>('')
  useEffect(() => {
    if (seededForRef.current === missionKey) return
    const starterPool = pool.filter(c => !c.parentIds)
    if (starterPool.length === 0) return // wait for starters to spawn
    seededForRef.current = missionKey
    setDeliverOpen(false)
    setMotherId(starterPool.find(c => c.sex === 'F')?.id ?? null)
    setFatherId(starterPool.find(c => c.sex === 'M')?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionKey, pool.length])

  if (!mission || !client) {
    return <div className="min-h-screen p-6 text-stone-500 italic">No mission open.</div>
  }

  // Only bred offspring (with parentIds) count as deliverables; the two
  // starter samples belong to the lab and never leave.
  const deliverableOffspring = offspring.filter(c => !!c.parentIds)

  const targetText = Object.entries(mission.targetPhenotype)
    .map(([t, v]) => {
      const trait = blobSpecies.traits.find(x => x.id === t)
      return `${trait?.name ?? t}: ${phenotypeLabel(t, v)}`
    })
    .join(' · ')

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
            <div className="text-xs text-stone-700 mt-2 font-mono">
              <strong className="text-amber-800">Wanted phenotype:</strong>{' '}
              {targetText}
              {mission.breedBudget ? ` · Budget: ${mission.breedBudget} crosses` : ''}
            </div>
          </div>
        </div>

        {/* Breed-mode-only lab rules copy. Deduce/predict missions use their
            own panels and don't touch the sample bench. */}
        {mission.mode === 'breed' && (
          <div className="mb-4 rounded p-3 bg-stone-100 border border-stone-200 text-sm text-stone-700">
            <strong>Lab rules:</strong> the samples on the bench are unknown —
            no notebook validation here, only the client's wanted phenotype
            to check against. Pick a pair, breed, inspect the offspring, and
            deliver one whose phenotype matches. Starter samples belong to
            the lab and can't be delivered; only offspring you breed can.
          </div>
        )}

        {mission.mode === 'breed' && (
          <>
            {/* Sample notecards — horizontal scroll for benches with 4
                starters, so cards can be reasonably sized without wrapping. */}
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
                Samples
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {starters.map(c => (
                  <div key={c.id} className="flex-shrink-0">
                    <Notecard
                      creature={c}
                      visibleGeneIds={mission.visibleGeneIds}
                    />
                  </div>
                ))}
              </div>
            </div>

            {offspring.length > 0 && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Bred offspring ({offspring.length})
                </div>
                {/* Horizontal scroll — a mission with a budget of 20 and 6
                    offspring per cross piles up 100+ blobs. Row scroll keeps
                    them in one strip so the Deliver button stays on-screen. */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {offspring.map(c => (
                    <div key={c.id} className="flex-shrink-0">
                      <Notecard
                        creature={c}
                        visibleGeneIds={mission.visibleGeneIds}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Interaction area — depends on mission mode. */}
        {mission.mode === 'breed' && (
          <>
            {/* Notebook first (guesses + notes + live Punnett), Workbench
                (bench + latest litter + execute) below. Matches chapter flow. */}
            <div className="mb-4">
              <MissionNotebook
                blobs={pool}
                visibleGeneIds={mission.visibleGeneIds}
              />
            </div>
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
          </>
        )}

        {mission.mode === 'deduce-only' && mission.deducePedigree && (
          <DeduceOnlyPanel pedigree={mission.deducePedigree} />
        )}

        {mission.mode === 'predict-only' && mission.predictPrompt && (
          <PredictOnlyPanel prompt={mission.predictPrompt} />
        )}
      </div>

      <DeliverPicker
        open={deliverOpen}
        onClose={() => {
          setDeliverOpen(false)
          setLastRejectedId(null)
        }}
        offspring={deliverableOffspring}
        starterCount={starters.length}
        visibleGeneIds={mission.visibleGeneIds}
        lastRejectedId={lastRejectedId}
        targetText={targetText}
        onDeliver={id => {
          const ok = submit(mission.id, id)
          if (ok) {
            setDeliverOpen(false)
            setLastRejectedId(null)
          } else {
            setLastRejectedId(id)
          }
        }}
      />
    </div>
  )
}

// -- Deduce-only panel ---------------------------------------------------

function DeduceOnlyPanel({
  pedigree,
}: {
  pedigree: NonNullable<import('../../content/types').Mission['deducePedigree']>
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [scratchpad, setScratchpad] = useState('')
  const solvedRef = useRef(false)
  const completeMissionByPuzzle = useGameStore(s => s.completeMissionByPuzzle)
  const activeMissionId = useGameStore(s => s.activeMissionId)
  const allCorrect = useMemo(() => {
    return Object.entries(pedigree.correctGenotypes).every(
      ([nodeId, want]) =>
        (answers[nodeId] ?? '').split('').sort().join('') ===
        want.split('').sort().join(''),
    )
  }, [answers, pedigree.correctGenotypes])
  useEffect(() => {
    if (allCorrect && !solvedRef.current && activeMissionId) {
      solvedRef.current = true
      setTimeout(() => {
        completeMissionByPuzzle(activeMissionId)
      }, 900)
    }
  }, [allCorrect, activeMissionId, completeMissionByPuzzle])
  return (
    <div className="space-y-3">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        Each blob's phenotype is drawn from what's actually there. Amber-bordered
        nodes show the recessive phenotype for the tracked gene. Fill in every
        node's genotype; when they all match the family record, the case closes.
      </div>
      <PedigreeViewer
        nodes={pedigree.nodes}
        focusGeneId={pedigree.focusGeneId}
        hypotheses={answers}
        onHypothesisChange={(id, v) =>
          setAnswers(prev => ({ ...prev, [id]: v }))
        }
        correctGenotypes={pedigree.correctGenotypes}
      />
      <div className="rounded-lg bg-[color:var(--paper)] border border-stone-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-stone-700 font-serif">
            📓 Scratchpad
          </h3>
          <div className="text-xs text-stone-500 italic">
            Free notes. No answer-checking.
          </div>
        </div>
        <textarea
          value={scratchpad}
          onChange={e => setScratchpad(e.target.value)}
          placeholder='e.g. "III-1 shows recessive → parents must both carry ‘a’"'
          rows={4}
          className="w-full px-2 py-1 border border-stone-300 rounded text-xs bg-white text-stone-700 resize-none leading-snug"
        />
      </div>
      {allCorrect && (
        <div className="rounded p-3 bg-emerald-50 border border-emerald-300 text-sm text-emerald-800">
          ✓ Every genotype matches. Filing the report…
        </div>
      )}
    </div>
  )
}

// -- Predict-only panel --------------------------------------------------

function PredictOnlyPanel({
  prompt,
}: {
  prompt: NonNullable<import('../../content/types').Mission['predictPrompt']>
}) {
  const [dominantPct, setDominantPct] = useState('')
  const [recessivePct, setRecessivePct] = useState('')
  const [feedback, setFeedback] = useState<null | 'ok' | 'off'>(null)
  const completeMissionByPuzzle = useGameStore(s => s.completeMissionByPuzzle)
  const activeMissionId = useGameStore(s => s.activeMissionId)
  const expected = useMemo(() => computeExpectedRatio(prompt), [prompt])
  const check = () => {
    const dom = parseFloat(dominantPct)
    const rec = parseFloat(recessivePct)
    if (!Number.isFinite(dom) || !Number.isFinite(rec)) {
      setFeedback('off')
      return
    }
    const domOK = Math.abs(dom - expected.dominant) <= prompt.tolerance
    const recOK = Math.abs(rec - expected.recessive) <= prompt.tolerance
    if (domOK && recOK) {
      setFeedback('ok')
      if (activeMissionId) {
        setTimeout(() => {
          completeMissionByPuzzle(activeMissionId)
        }, 900)
      }
    } else {
      setFeedback('off')
    }
  }
  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-5">
      <div className="text-sm text-stone-800 italic mb-3">{prompt.question}</div>
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Cross: {prompt.motherGenotype} × {prompt.fatherGenotype}
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="flex items-center gap-2 text-sm">
          Dominant phenotype %
          <input
            type="text"
            value={dominantPct}
            onChange={e => setDominantPct(e.target.value)}
            className="w-16 text-center border-2 border-stone-300 rounded font-mono px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Recessive phenotype %
          <input
            type="text"
            value={recessivePct}
            onChange={e => setRecessivePct(e.target.value)}
            className="w-16 text-center border-2 border-stone-300 rounded font-mono px-2 py-1"
          />
        </label>
        <button
          onClick={check}
          className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
        >
          Submit prediction
        </button>
      </div>
      {feedback === 'ok' && (
        <div className="text-sm text-emerald-700">
          ✓ Within tolerance. Case closed.
        </div>
      )}
      {feedback === 'off' && (
        <div className="text-sm text-rose-700">
          Off — try again. (Punnett math should give exact fractions.)
        </div>
      )}
    </div>
  )
}

function computeExpectedRatio(prompt: {
  motherGenotype: string
  fatherGenotype: string
}) {
  // Simple 2-allele monohybrid: mother "Aa" × father "aa" style.
  const m = prompt.motherGenotype.split('')
  const f = prompt.fatherGenotype.split('')
  const outcomes: string[] = []
  for (const a of m) for (const b of f) outcomes.push(a + b)
  let dominant = 0
  for (const o of outcomes) {
    // Any uppercase letter present = dominant phenotype (for 2-allele model).
    if (/[A-Z]/.test(o)) dominant++
  }
  const dominantPct = (dominant / outcomes.length) * 100
  return { dominant: dominantPct, recessive: 100 - dominantPct }
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
        belong to the lab and never leave.
      </div>
      <div className="mb-3 text-sm rounded p-2 bg-amber-50 border border-amber-200">
        <strong className="text-amber-800">Wanted phenotype:</strong>{' '}
        <span className="font-mono text-stone-800">{targetText}</span>
      </div>
      <div className="mb-4 text-sm text-stone-700 italic">
        Delivered blobs go straight to the client — no take-backs. Pick the
        one you think matches.
      </div>
      {lastRejectedId && (
        <div className="mb-3 p-2 text-xs bg-rose-50 border border-rose-200 rounded text-rose-900">
          That one wasn't what the client wanted. Look at the sample cards
          again and pick a different one.
        </div>
      )}
      {offspring.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-stone-700">
          No offspring bred yet. Cross a sample pair to produce your first offspring.
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
                  className="rounded-lg border-2 border-stone-300 bg-white p-3 flex flex-col items-center"
                >
                  <BlobRenderer creature={c} species={blobSpecies} size={72} />
                  <div className="flex items-center gap-1 text-xs mt-2 text-stone-700">
                    <SexBadge sex={c.sex} />
                    <span className="font-mono">
                      {visibleGeneIds.map(t => phenotypeLabel(t, phen[t])).join(' · ')}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeliver(c.id)}
                    className="mt-3 w-full px-3 py-2 bg-emerald-600 text-white text-sm rounded font-medium hover:bg-emerald-700"
                  >
                    Deliver this one
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
