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

  const symbols = gene.alleles.map(a => a.symbol).join('/')

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setHypothesis(creatureId, geneId, e.target.value)}
        placeholder={symbols}
        maxLength={4}
        className={
          'w-20 px-2 py-1 border rounded text-center font-mono text-sm ' +
          (valid
            ? 'border-green-400 bg-green-50 text-green-800'
            : 'border-slate-300')
        }
      />
      {valid ? (
        <span className="text-green-600 text-lg" title="Confirmed by evidence">✓</span>
      ) : value ? (
        <span className="text-slate-400 text-xs">gather evidence by breeding</span>
      ) : null}
    </div>
  )
}
