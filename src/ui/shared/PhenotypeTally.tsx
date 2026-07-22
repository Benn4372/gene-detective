import type { Creature } from '../../engine/types'
import { computePhenotype } from '../../engine/phenotype'
import { blobSpecies } from '../../content'

interface Props {
  offspring: Creature[]
  visibleTraitIds: string[]
  label?: string
}

// Rolling per-trait phenotype counts across every observed offspring,
// shown with percentages so ratios (1:1, 3:1, 9:3:3:1, etc.) become visible.
export function PhenotypeTally({ offspring, visibleTraitIds, label }: Props) {
  if (offspring.length === 0) return null

  const counts: Record<string, Record<string, number>> = {}
  for (const child of offspring) {
    const phen = computePhenotype(child, blobSpecies)
    for (const traitId of visibleTraitIds) {
      if (!counts[traitId]) counts[traitId] = {}
      const val = phen[traitId] ?? '—'
      counts[traitId][val] = (counts[traitId][val] ?? 0) + 1
    }
  }

  const total = offspring.length
  return (
    <div className="text-xs bg-slate-50 border border-slate-200 rounded p-3">
      <div className="uppercase tracking-wide text-slate-500 mb-2">
        {label ?? `Running totals · ${total} offspring across all crosses`}
      </div>
      <div className="space-y-1">
        {visibleTraitIds.map(traitId => {
          const trait = blobSpecies.traits.find(t => t.id === traitId)
          if (!trait) return null
          const values = counts[traitId] ?? {}
          const entries = Object.entries(values).sort(([a], [b]) => a.localeCompare(b))
          return (
            <div key={traitId}>
              <span className="font-semibold text-slate-700">{trait.name}:</span>{' '}
              {entries.length === 0 ? (
                <span className="text-slate-400">no data</span>
              ) : (
                entries.map(([val, n]) => (
                  <span key={val} className="font-mono ml-2">
                    {val}×{n}{' '}
                    <span className="text-slate-500">
                      ({Math.round((n / total) * 100)}%)
                    </span>
                  </span>
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
