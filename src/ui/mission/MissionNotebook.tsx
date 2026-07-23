import { useState } from 'react'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { SexBadge } from '../atoms/SexBadge'
import { computePhenotype } from '../../engine/phenotype'

interface Props {
  blobs: Creature[]
  visibleGeneIds: string[]
}

// Mission notebook. Never validates — missions hide the answer entirely, so
// there is deliberately no green checkmark. Player clicks any blob thumbnail
// to focus its row. For each tracked gene the row shows:
//   • Genotype guess (allele letters) — feeds the Punnett's Fill button
//   • Notes textarea (free text scratchpad)
//   • Observed phenotype label so the player can cross-check against reality
// Same shape as the chapter NotebookPanel so the two screens read consistently.
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
          Notes only — no answer-checking in missions. Guess feeds the Punnett.
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
              <MissionNotebookCell
                key={geneId}
                gene={gene}
                creatureId={focused.id}
                geneId={geneId}
                observedPhen={observedPhen}
                traitId={trait}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// One (creature × gene) row: guess input + notes textarea + observed phen line.
function MissionNotebookCell({
  gene,
  creatureId,
  geneId,
  observedPhen,
  traitId,
}: {
  gene: (typeof blobSpecies.genes)[number]
  creatureId: string
  geneId: string
  observedPhen?: string
  traitId?: string
}) {
  const guess = useGameStore(s => s.notebookGuess[creatureId]?.[geneId] ?? '')
  const notes = useGameStore(s => s.notebookNotes[creatureId]?.[geneId] ?? '')
  const setGuess = useGameStore(s => s.setNotebookGuess)
  const setNotes = useGameStore(s => s.setNotebookNote)

  const validSymbols = new Set(gene.alleles.map(a => a.symbol))
  const dominant = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]!.symbol
  const recessive = [...gene.alleles].sort(
    (a, b) => a.dominanceRank - b.dominanceRank,
  )[0]!.symbol
  const placeholder =
    gene.alleles.length === 2
      ? `${dominant}${dominant} / ${dominant}${recessive} / ${recessive}${recessive}`
      : gene.alleles.map(a => a.symbol).join('')

  const onGuessChange = (raw: string) => {
    const filtered = raw
      .split('')
      .filter(ch => validSymbols.has(ch))
      .slice(0, 4)
      .join('')
    setGuess(creatureId, geneId, filtered)
  }

  return (
    <div>
      <div className="text-xs font-semibold text-stone-700 mb-1">
        {gene.name}
      </div>
      <input
        type="text"
        value={guess}
        onChange={e => onGuessChange(e.target.value)}
        placeholder={placeholder}
        maxLength={4}
        className="w-36 px-2 py-1 border-2 border-stone-300 rounded text-center font-mono text-sm bg-white text-stone-800"
      />
      <textarea
        value={notes}
        onChange={e => setNotes(creatureId, geneId, e.target.value)}
        placeholder='e.g. "AA or Aa"'
        rows={2}
        className="mt-2 w-full px-2 py-1 border border-stone-300 rounded text-xs bg-white text-stone-700 resize-none leading-snug"
      />
      {observedPhen && observedPhen !== 'absent' && traitId && (
        <div className="text-[10px] text-stone-500 mt-1">
          observed phenotype:{' '}
          <span className="font-mono">
            {phenotypeLabel(traitId, observedPhen)}
          </span>
        </div>
      )}
    </div>
  )
}
