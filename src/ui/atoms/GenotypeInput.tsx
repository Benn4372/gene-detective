import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'

interface Props {
  creatureId: string
  geneId: string
  // If true, no validation checkmark or "gather evidence" nudge is ever shown.
  // Used inside Missions where the game deliberately does not tell the player
  // whether they're right — the target phenotype is the only feedback.
  noValidation?: boolean
}

// Single-line input for the player's genotype hypothesis on one gene. Fills in
// canonically (dominant-first) via the store's `canonicalizeHypothesis`, so
// AaAa becomes Aa. Optionally shows a green ✓ when the notebook validator
// accepts.
export function GenotypeInput({ creatureId, geneId, noValidation }: Props) {
  const value = useGameStore(s => s.hypotheses[creatureId]?.[geneId] ?? '')
  const valid = useGameStore(s => s.validated[creatureId]?.[geneId] ?? false)
  const setHypothesis = useGameStore(s => s.setHypothesis)

  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

  const dominant = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]!.symbol
  const recessive = [...gene.alleles].sort(
    (a, b) => a.dominanceRank - b.dominanceRank,
  )[0]!.symbol
  const example =
    gene.alleles.length === 2
      ? `${dominant}${dominant}/${dominant}${recessive}/${recessive}${recessive}`
      : gene.alleles.map(a => a.symbol).join('')
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
          'w-36 px-2 py-1 border-2 rounded text-center font-mono text-sm ' +
          (valid && !noValidation
            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
            : 'border-stone-300 bg-white text-stone-800')
        }
      />
      {noValidation ? null : valid ? (
        <span className="text-emerald-600 text-lg" title="Confirmed by evidence">
          ✓
        </span>
      ) : isComplete ? (
        <span className="text-stone-500 text-xs italic">
          gather evidence
        </span>
      ) : null}
    </div>
  )
}
