import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { SexBadge } from '../atoms/SexBadge'
import { PunnettGrid } from './PunnettGrid'
import { PunnettGridDihybrid } from './PunnettGridDihybrid'
import { PunnettDistribution } from './PunnettDistribution'
import { PhenotypeTally } from '../atoms/PhenotypeTally'
import type { CrossRecord } from '../../state/types'

interface Props {
  pool: Creature[]
  motherId: string | null
  fatherId: string | null
  onSelectMother(id: string | null): void
  onSelectFather(id: string | null): void
  visibleGeneIds: string[]
  litterSize?: number
  onCrossComplete?(record: CrossRecord): void
  // Extra label to hint the player about scarcity — e.g. "3 crosses left"
  breedBudgetHint?: string
  // Set false to hide the Punnett grid entirely — used by Ch 1 before
  // Ch 2 teaches the Punnett square as a tool.
  showPunnett?: boolean
}

// The primary breeding interaction. Wraps parent picker + Punnett grid(s) +
// Execute cross + offspring tray + rolling phenotype tally. Used inside both
// Chapter Runner (solo/master stages) and Mission Runner.
export function Workbench({
  pool,
  motherId,
  fatherId,
  onSelectMother,
  onSelectFather,
  visibleGeneIds,
  litterSize,
  onCrossComplete,
  breedBudgetHint,
  showPunnett = true,
}: Props) {
  const breed = useGameStore(s => s.breed)
  const crossHistory = useGameStore(s => s.crossHistory)
  const creatures = useGameStore(s => s.creatures)
  const envTemp = useGameStore(s => s.environmentTemperature ?? 50)
  const setEnvTemp = useGameStore(s => s.setEnvironmentTemperature)

  // Show a temperature slider when any tracked gene is temperature-sensitive.
  // Introduced in Ch11; hidden for chapters that don't touch it.
  const hasEnvGene = useMemo(
    () =>
      visibleGeneIds.some(id => {
        const g = blobSpecies.genes.find(x => x.id === id)
        return g?.environmentalThreshold !== undefined
      }),
    [visibleGeneIds],
  )

  const poolIds = useMemo(() => new Set(pool.map(c => c.id)), [pool])
  const females = pool.filter(c => c.sex === 'F')
  const males = pool.filter(c => c.sex === 'M')

  // Filter crossHistory down to crosses whose participants are still in the
  // current pool — accurate rolling stats even after other creatures churn.
  const relevantCrosses = useMemo(
    () =>
      crossHistory.filter(r => poolIds.has(r.motherId) && poolIds.has(r.fatherId)),
    [crossHistory, poolIds],
  )
  const latestCross = relevantCrosses[relevantCrosses.length - 1]

  // Every offspring bred in this session (for the tally).
  const allOffspring: Creature[] = []
  for (const r of relevantCrosses) {
    for (const oId of r.offspringIds) {
      const c = creatures[oId]
      if (c) allOffspring.push(c)
    }
  }

  const canCross =
    motherId !== null && fatherId !== null && motherId !== fatherId
  const handleCross = () => {
    if (!canCross || !motherId || !fatherId) return
    const record = breed(motherId, fatherId, litterSize)
    if (record && onCrossComplete) onCrossComplete(record)
  }

  // When there's only one female and one male available, showing a full
  // picker of blob cards is just repeating what the mystery-pair block
  // already showed above. Hide it entirely in that case.
  const showPicker = females.length > 1 || males.length > 1

  return (
    <div className="space-y-4">
      {/* Latest litter reveal — pinned near the top so it stays visible as
          the primary result of the last cross. Ordered above the pickers +
          Punnett + Execute so the player sees "what happened" first, then
          scrolls into "what to try next" below. */}
      {latestCross && (
        <div className="rounded-lg bg-white border border-stone-300 p-3">
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
            Latest litter · {latestCross.offspringIds.length} offspring
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {latestCross.offspringIds.map((id, idx) => {
                const child = creatures[id]
                if (!child) return null
                const phen = computePhenotype(child, blobSpecies)
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.5, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      delay: idx * 0.05,
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="flex flex-col items-center"
                  >
                    <BlobRenderer creature={child} species={blobSpecies} size={64} />
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <SexBadge sex={child.sex} />
                      <span className="font-mono text-stone-600">
                        {visibleGeneIds.map(t => phen[t]).join(' · ')}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Running tally across every offspring bred so far this stage. */}
      {allOffspring.length > 0 && (
        <PhenotypeTally
          offspring={allOffspring}
          visibleTraitIds={visibleGeneIds}
          label={`Running totals across ${allOffspring.length} offspring`}
        />
      )}

      {showPicker && (
        <div className="grid grid-cols-2 gap-4">
          <PickerColumn
            label="Mother ♀"
            creatures={females}
            selectedId={motherId}
            onSelect={onSelectMother}
            visibleGeneIds={visibleGeneIds}
            hue="rose"
          />
          <PickerColumn
            label="Father ♂"
            creatures={males}
            selectedId={fatherId}
            onSelect={onSelectFather}
            visibleGeneIds={visibleGeneIds}
            hue="sky"
          />
        </div>
      )}

      {/* Environmental slider — only shown for temp-sensitive traits. */}
      {hasEnvGene && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wide text-orange-800">
              🌡 Ambient temperature
            </div>
            <div className="text-xs font-mono text-orange-800">
              {envTemp}°{' '}
              <span className="italic text-orange-600">
                ({envTemp < 40 ? 'cold' : envTemp < 70 ? 'temperate' : 'warm'})
              </span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={envTemp}
            onChange={e => setEnvTemp(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="text-[10px] text-orange-800 italic mt-1">
            Some traits only show at warm temperatures. Drag the slider and see
            what changes.
          </div>
        </div>
      )}

      {/* Punnett — variant chosen by number of tracked genes.
          1 gene → 2×2, 2 genes → 4×4 dihybrid, 3+ → distribution chart.
          Hidden entirely until Ch 2 unlocks the tool. */}
      {showPunnett && motherId && fatherId && visibleGeneIds.length > 0 && (
        <div className="rounded-lg bg-stone-50 border border-stone-300 p-3">
          {visibleGeneIds.length === 1 && (
            <PunnettGrid
              motherId={motherId}
              fatherId={fatherId}
              geneId={visibleGeneIds[0]!}
            />
          )}
          {visibleGeneIds.length === 2 && (
            <PunnettGridDihybrid
              motherId={motherId}
              fatherId={fatherId}
              geneIds={[visibleGeneIds[0]!, visibleGeneIds[1]!]}
            />
          )}
          {visibleGeneIds.length >= 3 && (
            <PunnettDistribution
              motherId={motherId}
              fatherId={fatherId}
              geneIds={visibleGeneIds}
            />
          )}
        </div>
      )}

      {/* Execute + budget hint */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: canCross ? 1.03 : 1 }}
          whileTap={{ scale: canCross ? 0.97 : 1 }}
          onClick={handleCross}
          disabled={!canCross}
          className={
            'px-6 py-3 rounded-lg font-medium shadow-sm text-lg ' +
            (canCross
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed')
          }
        >
          🧬 Execute cross
        </motion.button>
        {breedBudgetHint && (
          <div className="text-sm text-stone-600 italic">{breedBudgetHint}</div>
        )}
      </div>

    </div>
  )
}

function PickerColumn({
  label,
  creatures,
  selectedId,
  onSelect,
  visibleGeneIds,
  hue,
}: {
  label: string
  creatures: Creature[]
  selectedId: string | null
  onSelect(id: string | null): void
  visibleGeneIds: string[]
  hue: 'rose' | 'sky'
}) {
  const labelCls =
    hue === 'rose' ? 'text-rose-700' : 'text-sky-700'
  return (
    <div>
      <div className={'text-xs uppercase tracking-wide font-semibold mb-2 ' + labelCls}>
        {label}
      </div>
      {creatures.length === 0 ? (
        <div className="text-stone-500 italic text-sm">None available.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {creatures.map(c => {
            const phen = computePhenotype(c, blobSpecies)
            const isSel = selectedId === c.id
            const name = c.ownerName ?? `Blob #${c.id.slice(-4)}`
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(isSel ? null : c.id)}
                className={
                  'flex flex-col items-center rounded-lg border-2 bg-white p-2 transition-colors ' +
                  (isSel
                    ? 'border-amber-500 shadow-md ring-2 ring-amber-100'
                    : 'border-stone-300 hover:border-stone-400')
                }
              >
                <BlobRenderer creature={c} species={blobSpecies} size={54} />
                <div className="text-[10px] text-stone-500 truncate max-w-[90px]">
                  {name}
                </div>
                <div className="font-mono text-[10px] text-stone-700 mt-0.5">
                  {visibleGeneIds.map(t => phen[t]).join(' · ')}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
