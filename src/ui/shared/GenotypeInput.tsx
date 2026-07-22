import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'

interface Props {
  creatureId: string
  geneId: string
}

// A tiny input where the player types the two-letter genotype (e.g. "Aa").
// Shows a checkmark when the store's validator has accepted it.
export function GenotypeInput({ creatureId, geneId }: Props) {
  const value = useGameStore(s => s.hypotheses[creatureId]?.[geneId] ?? '')
  const valid = useGameStore(s => s.validated[creatureId]?.[geneId] ?? false)
  const setHypothesis = useGameStore(s => s.setHypothesis)

  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

  // Placeholder shows an example set of valid genotype notations for this gene.
  const symbols = gene.alleles.map(a => a.symbol)
  const dominant = [...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!.symbol
  const recessive = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!.symbol
  const example =
    symbols.length === 2
      ? `${dominant}${dominant}/${dominant}${recessive}/${recessive}${recessive}`
      : symbols.join('')

  // Only show the "gather evidence" nudge once the player has entered a plausible
  // full genotype (2 characters for diploid), not on a single letter.
  const isComplete = value.length >= 2

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setHypothesis(creatureId, geneId, e.target.value)}
        placeholder={example}
        maxLength={4}
        className={
          'w-36 px-2 py-1 border rounded text-center font-mono text-sm ' +
          (valid
            ? 'border-green-400 bg-green-50 text-green-800'
            : 'border-slate-300')
        }
      />
      {valid ? (
        <span className="text-green-600 text-lg" title="Confirmed by evidence">✓</span>
      ) : isComplete ? (
        <span className="text-slate-400 text-xs">gather evidence by breeding</span>
      ) : null}
    </div>
  )
}
