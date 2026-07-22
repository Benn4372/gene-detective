import type { Creature } from '../../engine/types'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { blobSpecies } from '../../content'
import { computePhenotype } from '../../engine/phenotype'

interface Props {
  creature: Creature
  onClick?(): void
  selected?: boolean
  compact?: boolean
}

export function CreatureCard({ creature, onClick, selected, compact }: Props) {
  const phenotype = computePhenotype(creature, blobSpecies)
  const name = creature.ownerName ?? `Blob #${creature.id.slice(-4)}`
  const size = compact ? 60 : 100

  return (
    <div
      onClick={onClick}
      className={
        'rounded-lg border p-3 transition-all bg-white ' +
        (onClick ? 'cursor-pointer hover:shadow-md ' : '') +
        (selected ? 'border-purple-500 ring-2 ring-purple-200 ' : 'border-slate-200 ')
      }
    >
      <div className="flex flex-col items-center gap-2">
        <BlobRenderer creature={creature} species={blobSpecies} size={size} />
        <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
          <SexBadge sex={creature.sex} />
          <span>{name}</span>
        </div>
        {!compact && (
          <div className="text-xs text-slate-500 text-center">
            {blobSpecies.traits.map(t => {
              const val = phenotype[t.id]
              const isRecessive = val === val?.toLowerCase()
              return (
                <div key={t.id}>
                  {t.name}: <span className="font-mono">{val ?? '—'}</span>
                  {' '}
                  <span className="text-slate-400">
                    {isRecessive ? '(recessive)' : '(dominant)'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
