import { blobSpecies } from '../../content'

interface Props {
  // Optional override of chromosome states. Any missing chromosome defaults
  // to 'normal'. Used by Ch 24-26 to illustrate aberrations.
  states?: Record<string, KaryotypeState>
}

export type KaryotypeState =
  | 'normal'
  | 'trisomy'
  | 'monosomy'
  | 'deletion'
  | 'duplication'
  | 'translocation'
  | 'inversion'

// A tiny karyotype schematic — one bar per chromosome, colored by state.
// Not a diploid-pair view (yet); one bar per species chromosome, sized by
// its lengthCM.
export function KaryotypeViewer({ states = {} }: Props) {
  const maxLen = Math.max(...blobSpecies.chromosomes.map(c => c.lengthCM))
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-3">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Karyotype
      </div>
      <div className="space-y-2">
        {blobSpecies.chromosomes.map(c => {
          const state = states[c.id] ?? 'normal'
          const w = Math.max(20, Math.round((c.lengthCM / maxLen) * 240))
          const { color, label } = describe(state)
          return (
            <div key={c.id} className="flex items-center gap-3">
              <div className="text-xs w-14 font-mono text-stone-600">
                {c.id}
              </div>
              <div className="flex-1">
                <div
                  className="h-4 rounded"
                  style={{ width: `${w}px`, backgroundColor: color }}
                  title={label}
                />
              </div>
              <div className="text-[10px] uppercase tracking-wide text-stone-500 w-24">
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function describe(state: KaryotypeState) {
  switch (state) {
    case 'normal': return { color: '#7c3aed', label: 'normal' }
    case 'trisomy': return { color: '#f59e0b', label: 'trisomy (×3)' }
    case 'monosomy': return { color: '#dc2626', label: 'monosomy (×1)' }
    case 'deletion': return { color: '#dc2626', label: 'deletion' }
    case 'duplication': return { color: '#0891b2', label: 'duplication' }
    case 'translocation': return { color: '#a855f7', label: 'translocation' }
    case 'inversion': return { color: '#059669', label: 'inversion' }
  }
}
