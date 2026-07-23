import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { PunnettGrid } from '../workbench/PunnettGrid'
import { PunnettGridDihybrid } from '../workbench/PunnettGridDihybrid'
import { PunnettDistribution } from '../workbench/PunnettDistribution'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
  // Whether the Punnett tool has been unlocked yet — hidden in Ch 1 until
  // Ch 2 formally introduces it.
  showPunnett?: boolean
}

// The Notebook is the player's single reasoning surface. It contains:
//   • Per gene, per parent: a genotype guess input + notes textarea
//   • A live Punnett square derived from the guesses (auto-updates as they
//     change; no manual header entry, no fill button, no clear button)
// The Punnett stays wired into the notebook for the whole stage — it does
// NOT get replaced or hidden after a breed. The validated Final Answer lives
// in a separate AnswerPanel once the player has bred at least one litter.
export function NotebookPanel({
  motherId,
  fatherId,
  geneIds,
  showPunnett = true,
}: Props) {
  const mother = useGameStore(s => s.creatures[motherId])
  const father = useGameStore(s => s.creatures[fatherId])
  if (!mother || !father) return null

  const motherName = mother.ownerName ?? 'Mother'
  const fatherName = father.ownerName ?? 'Father'

  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-700 font-serif">
          📓 Field Notebook
        </h3>
        <div className="text-xs text-stone-500 italic">
          Scratch space. Your guesses drive the Punnett square below.
        </div>
      </div>

      {geneIds.map(geneId => {
        const gene = blobSpecies.genes.find(g => g.id === geneId)
        if (!gene) return null
        return (
          <div
            key={geneId}
            className="border-t border-stone-200 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0"
          >
            <div className="text-xs font-semibold text-stone-700 mb-2">
              Gene: {gene.name}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <NotebookCell
                creatureId={mother.id}
                geneId={geneId}
                name={motherName}
                sexGlyph="♀"
              />
              <NotebookCell
                creatureId={father.id}
                geneId={geneId}
                name={fatherName}
                sexGlyph="♂"
              />
            </div>
            {/* Live Punnett for THIS gene — only shown for a monohybrid
                view. Dihybrid + polygenic use the combined Punnett rendered
                below the gene list. */}
            {showPunnett && geneIds.length === 1 && (
              <div className="flex justify-center">
                <PunnettGrid
                  motherId={mother.id}
                  fatherId={father.id}
                  geneId={geneId}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Multi-gene Punnett display sits ONCE at the bottom of the notebook
          when the notebook tracks more than one gene. */}
      {showPunnett && geneIds.length === 2 && (
        <div className="border-t border-stone-200 pt-3 mt-3 flex justify-center">
          <PunnettGridDihybrid
            motherId={mother.id}
            fatherId={father.id}
            geneIds={[geneIds[0]!, geneIds[1]!]}
          />
        </div>
      )}
      {showPunnett && geneIds.length >= 3 && (
        <div className="border-t border-stone-200 pt-3 mt-3">
          <PunnettDistribution
            motherId={mother.id}
            fatherId={father.id}
            geneIds={geneIds}
          />
        </div>
      )}
    </div>
  )
}

// One parent's row for one gene: guess input on top, notes underneath.
function NotebookCell({
  creatureId,
  geneId,
  name,
  sexGlyph,
}: {
  creatureId: string
  geneId: string
  name: string
  sexGlyph: string
}) {
  const guess = useGameStore(s => s.notebookGuess[creatureId]?.[geneId] ?? '')
  const notes = useGameStore(s => s.notebookNotes[creatureId]?.[geneId] ?? '')
  const setGuess = useGameStore(s => s.setNotebookGuess)
  const setNotes = useGameStore(s => s.setNotebookNote)

  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

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
      <div className="text-xs text-stone-500 mb-1">
        {name} {sexGlyph}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">
        Genotype guess
      </div>
      <input
        type="text"
        value={guess}
        onChange={e => onGuessChange(e.target.value)}
        placeholder={placeholder}
        maxLength={4}
        className="w-36 px-2 py-1 border-2 border-stone-300 rounded text-center font-mono text-sm bg-white text-stone-800"
      />
      <div className="text-[10px] uppercase tracking-wide text-stone-500 mt-2 mb-1">
        Notes
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(creatureId, geneId, e.target.value)}
        placeholder='e.g. "AA or Aa"'
        rows={2}
        className="w-full px-2 py-1 border border-stone-300 rounded text-xs bg-white text-stone-700 resize-none leading-snug"
      />
    </div>
  )
}
