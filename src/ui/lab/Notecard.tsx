import type { Creature } from '../../engine/types'
import { blobSpecies } from '../../content'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { computePhenotype } from '../../engine/phenotype'

interface Props {
  creature: Creature
  visibleGeneIds: string[]
  selected?: boolean
  onSelect?(): void
}

// A per-blob notecard used inside a Lab session. Has:
//  - The blob visualization + observed phenotype (facts)
//  - A per-gene guess input (unvalidated — no help)
//  - A freeform text-area for the player's own notes
export function Notecard({ creature, visibleGeneIds, selected, onSelect }: Props) {
  const notes = useGameStore(s => s.notes[creature.id] ?? '')
  const setNote = useGameStore(s => s.setNote)
  const hypotheses = useGameStore(s => s.hypotheses[creature.id] ?? EMPTY)
  const setHypothesis = useGameStore(s => s.setHypothesis)

  const phenotype = computePhenotype(creature, blobSpecies)
  const name = creature.ownerName ?? `Blob #${creature.id.slice(-4)}`

  return (
    <div
      onClick={onSelect}
      className={
        'rounded-xl border-2 bg-white p-3 transition-colors ' +
        (onSelect ? 'cursor-pointer ' : '') +
        (selected ? 'border-purple-500 shadow-md' : 'border-slate-200')
      }
    >
      <div className="flex items-start gap-3">
        <BlobRenderer creature={creature} species={blobSpecies} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
            <SexBadge sex={creature.sex} />
            <span className="truncate">{name}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {visibleGeneIds.map(gId => {
              const gene = blobSpecies.genes.find(g => g.id === gId)
              if (!gene) return null
              const val = phenotype[gene.expressesTraits[0]!]
              return (
                <div key={gId}>
                  {gene.name}: <span className="font-mono">{val}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {visibleGeneIds.map(gId => {
          const gene = blobSpecies.genes.find(g => g.id === gId)
          if (!gene) return null
          const value = hypotheses[gId] ?? ''
          const dominant = [...gene.alleles].sort(
            (a, b) => b.dominanceRank - a.dominanceRank,
          )[0]!.symbol
          const recessive = [...gene.alleles].sort(
            (a, b) => a.dominanceRank - b.dominanceRank,
          )[0]!.symbol
          const placeholder = `${dominant}${dominant} / ${dominant}${recessive} / ${recessive}${recessive}`
          return (
            <div key={gId} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-16">{gene.name}:</span>
              <input
                type="text"
                value={value}
                onChange={e => setHypothesis(creature.id, gId, e.target.value)}
                placeholder={placeholder}
                maxLength={4}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-center font-mono text-sm"
              />
            </div>
          )
        })}

        <textarea
          value={notes}
          onChange={e => setNote(creature.id, e.target.value)}
          placeholder="Notes… (jot down whatever helps you keep track)"
          rows={2}
          className="w-full mt-1 px-2 py-1 border border-slate-300 rounded text-sm resize-none"
        />
      </div>
    </div>
  )
}

const EMPTY: Record<string, string> = Object.freeze({}) as Record<string, string>
