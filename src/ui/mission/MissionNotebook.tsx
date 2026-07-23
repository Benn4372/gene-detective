import { useState } from 'react'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { GenotypeInput } from '../atoms/GenotypeInput'
import { SexBadge } from '../atoms/SexBadge'
import { computePhenotype } from '../../engine/phenotype'

interface Props {
  blobs: Creature[]
  visibleGeneIds: string[]
}

// Mission notebook. Unlike the chapter one, this NEVER validates — missions
// hide the answer entirely, so we don't want a green checkmark telling the
// player they're right. Player clicks any blob to focus its note row; a
// dropdown of every blob in the mission's pool (starters + bred offspring)
// keeps the panel size sane even when the pool grows.
export function MissionNotebook({ blobs, visibleGeneIds }: Props) {
  const [focusId, setFocusId] = useState<string>(blobs[0]?.id ?? '')
  const focused = blobs.find(b => b.id === focusId) ?? blobs[0]
  if (!focused) return null
  const phen = computePhenotype(focused, blobSpecies)
  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-700 font-serif">
          📓 Field Notebook
        </h3>
        <div className="text-xs text-stone-500 italic">
          Notes only — no answer-checking in missions.
        </div>
      </div>

      {/* Blob picker — thumbnails you click to switch focus. */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blobs.map(b => {
          const isFocus = b.id === focused.id
          const name = b.ownerName ?? `#${b.id.slice(-4)}`
          return (
            <button
              key={b.id}
              onClick={() => setFocusId(b.id)}
              className={
                'flex flex-col items-center rounded-lg border-2 bg-white p-2 transition-colors ' +
                (isFocus
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-100'
                  : 'border-stone-300 hover:border-stone-400')
              }
            >
              <BlobRenderer creature={b} species={blobSpecies} size={44} />
              <div className="flex items-center gap-1 text-[10px] text-stone-600 mt-1">
                <SexBadge sex={b.sex} />
                <span className="truncate max-w-[70px]">{name}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Focused blob's notes row */}
      <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          Notes on{' '}
          <span className="text-stone-800 font-semibold">
            {focused.ownerName ?? `Blob #${focused.id.slice(-4)}`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {visibleGeneIds.map(geneId => {
            const gene = blobSpecies.genes.find(g => g.id === geneId)
            if (!gene) return null
            const trait = gene.expressesTraits[0]
            const observedPhen = trait ? phen[trait] : undefined
            return (
              <div key={geneId}>
                <div className="text-xs font-semibold text-stone-700 mb-1">
                  {gene.name}
                </div>
                <GenotypeInput
                  creatureId={focused.id}
                  geneId={geneId}
                  noValidation
                />
                {observedPhen && observedPhen !== 'absent' && (
                  <div className="text-[10px] text-stone-500 mt-1">
                    observed phenotype:{' '}
                    <span className="font-mono">{observedPhen}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
