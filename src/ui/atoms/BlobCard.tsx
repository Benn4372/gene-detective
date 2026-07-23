import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'
import { SexBadge } from './SexBadge'

interface Props {
  creature: Creature
  onClick?(): void
  selected?: boolean
  visibleTraitIds?: string[]
  compact?: boolean
  size?: number
  hidePhenotype?: boolean
}

// A single blob's identity card. Adaptable: pass `compact` for a small picker
// tile, or omit for a full display with observed phenotype list.
export function BlobCard({
  creature,
  onClick,
  selected,
  visibleTraitIds,
  compact,
  size,
  hidePhenotype,
}: Props) {
  const phenotype = computePhenotype(creature, blobSpecies)
  const name = creature.ownerName ?? `Blob #${creature.id.slice(-4)}`
  const blobSize = size ?? (compact ? 60 : 100)
  const traits = visibleTraitIds
    ? blobSpecies.traits.filter(t => visibleTraitIds.includes(t.id))
    : blobSpecies.traits

  return (
    <div
      onClick={onClick}
      className={
        'rounded-xl border-2 p-3 transition-all bg-[color:var(--paper)] ' +
        (onClick ? 'cursor-pointer ' : '') +
        (selected
          ? 'border-amber-500 shadow-md ring-2 ring-amber-100 '
          : 'border-stone-300 hover:border-stone-400 ')
      }
    >
      <div className="flex flex-col items-center gap-2">
        <BlobRenderer creature={creature} species={blobSpecies} size={blobSize} />
        <div className="flex items-center gap-1 text-sm font-medium text-stone-800">
          <SexBadge sex={creature.sex} />
          <span className="truncate max-w-[120px]">{name}</span>
        </div>
        {!compact && !hidePhenotype && traits.length > 0 && (
          <div className="text-xs text-stone-600 text-center">
            {traits.map(t => {
              const val = phenotype[t.id]
              // Hide traits that don't apply to this creature — otherwise
              // an antennae-only Ch 1 blob lists 15 traits at "absent".
              if (!val || val === 'absent') return null
              return (
                <div key={t.id}>
                  {t.name}: <span className="font-mono text-stone-800">{val}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
