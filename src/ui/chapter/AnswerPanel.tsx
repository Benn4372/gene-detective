import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { NotebookAssertion } from '../../content/types'
import { GenotypeInput } from '../atoms/GenotypeInput'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
  correctAssertions: NotebookAssertion[]
  // Only supplied by the Guided stage. Keys are "role:geneId:wrongGenotype";
  // when the player's current answer matches, we render the explanation
  // beneath that input.
  guidedScaffolding?: {
    onWrongHypothesis: Record<string, string>
  }
}

// The validated "Final Answer" surface. Appears once the player has bred at
// least one litter — no answer-committing before evidence exists. Uses
// GenotypeInput's built-in ✓ / "not that one" / "gather evidence" states.
export function AnswerPanel({
  motherId,
  fatherId,
  geneIds,
  correctAssertions,
  guidedScaffolding,
}: Props) {
  const mother = useGameStore(s => s.creatures[motherId])
  const father = useGameStore(s => s.creatures[fatherId])
  const hypotheses = useGameStore(s => s.hypotheses)
  const validated = useGameStore(s => s.validated)
  if (!mother || !father) return null

  const motherName = mother.ownerName ?? 'Mother'
  const fatherName = father.ownerName ?? 'Father'

  const correctFor = (role: 'mother' | 'father', geneId: string): string | undefined =>
    correctAssertions.find(a => a.creatureRole === role && a.geneId === geneId)
      ?.correctGenotype

  const scaffoldingHint = (
    role: 'mother' | 'father',
    creatureId: string,
    geneId: string,
  ): string | null => {
    if (!guidedScaffolding) return null
    if (validated[creatureId]?.[geneId]) return null
    const value = hypotheses[creatureId]?.[geneId] ?? ''
    if (value.length < 2) return null
    const key = `${role}:${geneId}:${value}`
    return guidedScaffolding.onWrongHypothesis[key] ?? null
  }

  return (
    <div className="rounded-xl bg-emerald-50/60 border border-emerald-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-emerald-900 font-serif">
          ✔ Final Answer
        </h3>
        <div className="text-xs text-emerald-800 italic">
          Green ✓ means your evidence supports the answer.
        </div>
      </div>

      {geneIds.map(geneId => {
        const gene = blobSpecies.genes.find(g => g.id === geneId)
        if (!gene) return null
        const motherHint = scaffoldingHint('mother', mother.id, geneId)
        const fatherHint = scaffoldingHint('father', father.id, geneId)
        return (
          <div
            key={geneId}
            className="border-t border-emerald-200 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0"
          >
            <div className="text-xs font-semibold text-emerald-900 mb-2">
              Gene: {gene.name}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-emerald-800 mb-1">
                  {motherName} ♀
                </div>
                <GenotypeInput
                  creatureId={mother.id}
                  geneId={geneId}
                  correctGenotype={correctFor('mother', geneId)}
                  useNotebookGuess
                />
                {motherHint && (
                  <div className="mt-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded p-2 leading-snug">
                    <span className="font-semibold">Hmm — </span>
                    {motherHint}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-emerald-800 mb-1">
                  {fatherName} ♂
                </div>
                <GenotypeInput
                  creatureId={father.id}
                  geneId={geneId}
                  correctGenotype={correctFor('father', geneId)}
                  useNotebookGuess
                />
                {fatherHint && (
                  <div className="mt-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded p-2 leading-snug">
                    <span className="font-semibold">Hmm — </span>
                    {fatherHint}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
