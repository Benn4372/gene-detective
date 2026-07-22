import { useState } from 'react'
import type { Creature } from '../../engine/types'
import { blobSpecies } from '../../content'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { computePhenotype } from '../../engine/phenotype'
import { Modal } from '../shared/Modal'

interface Props {
  creature: Creature
  visibleGeneIds: string[]
  selected?: boolean
  onSelect?(): void
}

// Compact card for a lab blob. Shows just the blob + the player's genotype
// guesses in italic above it. Clicking the blob toggles selection for
// breeding; clicking the small "📝 notes" button opens the full editor.
export function Notecard({ creature, visibleGeneIds, selected, onSelect }: Props) {
  const [notesOpen, setNotesOpen] = useState(false)
  const hypotheses = useGameStore(s => s.hypotheses[creature.id] ?? EMPTY)

  const guessLine = visibleGeneIds
    .map(gId => hypotheses[gId])
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <div
        onClick={onSelect}
        className={
          'flex flex-col items-center rounded-lg border-2 bg-white p-2 transition-colors relative min-w-[110px] ' +
          (onSelect ? 'cursor-pointer ' : '') +
          (selected
            ? 'border-purple-500 shadow-md'
            : 'border-slate-200 hover:border-slate-400')
        }
      >
        <div className="text-xs italic text-slate-500 font-mono h-4 min-h-[1rem]">
          {guessLine || ' '}
        </div>
        <BlobRenderer creature={creature} species={blobSpecies} size={64} />
        <div className="flex items-center gap-1 text-xs mt-1">
          <SexBadge sex={creature.sex} />
          <span className="text-slate-600 truncate max-w-[70px]">
            {creature.ownerName ?? `#${creature.id.slice(-4)}`}
          </span>
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            setNotesOpen(true)
          }}
          title="Open notes"
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-xs flex items-center justify-center"
        >
          📝
        </button>
      </div>

      <NotecardEditor
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        creature={creature}
        visibleGeneIds={visibleGeneIds}
      />
    </>
  )
}

const EMPTY: Record<string, string> = Object.freeze({}) as Record<string, string>

// Full notecard editor — the expanded view opened from a compact card.
function NotecardEditor({
  open,
  onClose,
  creature,
  visibleGeneIds,
}: {
  open: boolean
  onClose(): void
  creature: Creature
  visibleGeneIds: string[]
}) {
  const notes = useGameStore(s => s.notes[creature.id] ?? '')
  const setNote = useGameStore(s => s.setNote)
  const hypotheses = useGameStore(s => s.hypotheses[creature.id] ?? EMPTY)
  const setHypothesis = useGameStore(s => s.setHypothesis)

  const phenotype = computePhenotype(creature, blobSpecies)
  const name = creature.ownerName ?? `Blob #${creature.id.slice(-4)}`

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={name}
      icon={creature.sex === 'F' ? '♀' : '♂'}
      z={70}
    >
      <div className="flex gap-4 mb-4">
        <BlobRenderer creature={creature} species={blobSpecies} size={100} />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Observed phenotype
          </div>
          {visibleGeneIds.map(gId => {
            const gene = blobSpecies.genes.find(g => g.id === gId)
            if (!gene) return null
            const val = phenotype[gene.expressesTraits[0]!]
            return (
              <div key={gId} className="text-sm">
                {gene.name}: <span className="font-mono">{val}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          Your genotype guess (never validated)
        </div>
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
              <span className="text-sm text-slate-600 w-20">{gene.name}:</span>
              <input
                type="text"
                value={value}
                onChange={e => setHypothesis(creature.id, gId, e.target.value)}
                placeholder={placeholder}
                maxLength={4}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-center font-mono text-sm"
              />
            </div>
          )
        })}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          Notes
        </div>
        <textarea
          value={notes}
          onChange={e => setNote(creature.id, e.target.value)}
          placeholder="Jot down anything that helps you keep track — hypotheses, observations, hunches…"
          rows={5}
          className="w-full px-3 py-2 border border-slate-300 rounded text-sm resize-none"
        />
      </div>
    </Modal>
  )
}
