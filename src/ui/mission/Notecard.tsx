import { useState } from 'react'
import type { Creature } from '../../engine/types'
import { blobSpecies } from '../../content'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { computePhenotype } from '../../engine/phenotype'
import { SexBadge } from '../atoms/SexBadge'
import { Modal } from '../atoms/Modal'
import { GenotypeInput } from '../atoms/GenotypeInput'

interface Props {
  creature: Creature
  visibleGeneIds: string[]
  selected?: boolean
  onSelect?(): void
}

const EMPTY: Record<string, string> = Object.freeze(
  {},
) as Record<string, string>

// Compact card used inside the Mission Runner. Displays a blob + the player's
// guessed genotype in italic above it. Click the card to select for breeding;
// click 📝 to open a modal for freeform notes and unvalidated allele guesses.
export function Notecard({ creature, visibleGeneIds, selected, onSelect }: Props) {
  const [notesOpen, setNotesOpen] = useState(false)
  // Read the mission's freeform notebook guesses — hypotheses is the (unused
  // in missions) validated answer store.
  const guesses = useGameStore(s => s.notebookGuess[creature.id] ?? EMPTY)
  const guessLine = visibleGeneIds
    .map(id => guesses[id])
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <div
        onClick={onSelect}
        className={
          'flex flex-col items-center rounded-lg border-2 bg-white p-2 relative min-w-[120px] transition-colors ' +
          (onSelect ? 'cursor-pointer ' : '') +
          (selected
            ? 'border-amber-500 shadow-md ring-2 ring-amber-100'
            : 'border-stone-300 hover:border-stone-400')
        }
      >
        <div className="text-xs italic font-mono text-stone-500 h-4 min-h-[1rem]">
          {guessLine || ' '}
        </div>
        <BlobRenderer creature={creature} species={blobSpecies} size={64} />
        <div className="flex items-center gap-1 text-xs mt-1">
          <SexBadge sex={creature.sex} />
          <span className="text-stone-700 truncate max-w-[80px]">
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
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-xs flex items-center justify-center"
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
          <div className="text-xs uppercase tracking-wide text-stone-500 mb-1">
            Observed phenotype
          </div>
          {visibleGeneIds.map(gId => {
            const gene = blobSpecies.genes.find(g => g.id === gId)
            if (!gene) return null
            const traitId = gene.expressesTraits[0]!
            const val = phenotype[traitId]
            return (
              <div key={gId} className="text-sm">
                {gene.name}: <span className="font-mono">{val}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Your genotype guess (unvalidated in missions)
        </div>
        {visibleGeneIds.map(gId => {
          const gene = blobSpecies.genes.find(g => g.id === gId)
          if (!gene) return null
          return (
            <div key={gId} className="flex items-center gap-3">
              <span className="text-sm text-stone-600 w-20">{gene.name}:</span>
              <GenotypeInput creatureId={creature.id} geneId={gId} noValidation />
            </div>
          )
        })}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-stone-500 mb-1">
          Notes
        </div>
        <textarea
          value={notes}
          onChange={e => setNote(creature.id, e.target.value)}
          placeholder="Jot down anything that helps you keep track — hypotheses, observations, hunches…"
          rows={5}
          className="w-full px-3 py-2 border border-stone-300 rounded text-sm resize-none bg-white"
        />
      </div>
    </Modal>
  )
}
