import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { genotypePlaceholder } from '../../renderer/genotypePlaceholder'

interface Props {
  creatureId: string
  geneId: string
  // If true, no validation checkmark or nudge is ever shown. Used inside
  // Missions where the game deliberately does not tell the player whether
  // they're right — the target phenotype is the only feedback.
  noValidation?: boolean
  // Canonical correct genotype for this creature × gene at the current stage.
  // When provided, a completed-but-not-validated input can distinguish two
  // failure modes: "the letters don't match the answer" vs "you're right but
  // haven't bred enough evidence yet".
  correctGenotype?: string
}

// Single-line input for the player's genotype hypothesis on one gene. Fills in
// canonically (dominant-first) via the store's `canonicalizeHypothesis`, so
// AaAa becomes Aa. Shows a green ✓ once the notebook validator accepts, a red
// "not that one" nudge when the input is complete but doesn't match the
// correct answer, or a neutral "gather evidence" nudge when the input matches
// but the evidence bar for this stage's tier isn't met yet.
export function GenotypeInput({
  creatureId,
  geneId,
  noValidation,
  correctGenotype,
}: Props) {
  const value = useGameStore(s => s.hypotheses[creatureId]?.[geneId] ?? '')
  const valid = useGameStore(s => s.validated[creatureId]?.[geneId] ?? false)
  const setHypothesis = useGameStore(s => s.setHypothesis)

  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

  const example = genotypePlaceholder(gene)
  // Sex-linked males + mitochondrial + Y-linked are hemizygous — one allele
  // is a complete answer. Everyone else needs the full diploid pair (2 chars).
  const minChars =
    gene.inheritanceModel === 'mitochondrial' ||
    gene.inheritanceModel === 'sexLinked'
      ? 1
      : 2
  const isComplete = value.length >= minChars

  const sortChars = (s: string) => s.split('').sort().join('')
  const matchesAnswer =
    correctGenotype !== undefined
      ? sortChars(value) === sortChars(correctGenotype)
      : null

  const showWrong =
    !noValidation && !valid && isComplete && matchesAnswer === false
  const showGatherEvidence =
    !noValidation && !valid && isComplete && matchesAnswer !== false

  const borderCls = valid && !noValidation
    ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
    : showWrong
      ? 'border-rose-400 bg-rose-50 text-rose-800'
      : 'border-stone-300 bg-white text-stone-800'

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setHypothesis(creatureId, geneId, e.target.value)}
        placeholder={example}
        maxLength={4}
        className={'w-36 px-2 py-1 border-2 rounded text-center font-mono text-sm ' + borderCls}
      />
      {noValidation ? null : valid ? (
        <span className="text-emerald-600 text-lg" title="Confirmed by evidence">
          ✓
        </span>
      ) : showWrong ? (
        <span className="text-rose-700 text-xs italic">
          not that one
        </span>
      ) : showGatherEvidence ? (
        <span className="text-stone-500 text-xs italic">
          gather evidence
        </span>
      ) : null}
    </div>
  )
}
