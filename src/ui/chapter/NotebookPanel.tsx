import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { GenotypeInput } from '../atoms/GenotypeInput'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
  // Only supplied by the Guided stage. Keys are "role:geneId:wrongGenotype";
  // when the player's current hypothesis matches, we render the explanation
  // beneath that input.
  guidedScaffolding?: {
    onWrongHypothesis: Record<string, string>
  }
}

// The mystery pair's Notebook. One row per tracked gene, with genotype inputs
// for each parent. Feeds the Punnett's "Fill from notebook" button in the
// Workbench.
export function NotebookPanel({
  motherId,
  fatherId,
  geneIds,
  guidedScaffolding,
}: Props) {
  const mother = useGameStore(s => s.creatures[motherId])
  const father = useGameStore(s => s.creatures[fatherId])
  const hypotheses = useGameStore(s => s.hypotheses)
  const validated = useGameStore(s => s.validated)
  if (!mother || !father) return null

  const motherName = mother.ownerName ?? 'Mother'
  const fatherName = father.ownerName ?? 'Father'

  const lookupHint = (
    role: 'mother' | 'father',
    creatureId: string,
    geneId: string,
  ): string | null => {
    if (!guidedScaffolding) return null
    // Don't nag once the notebook accepts this input.
    if (validated[creatureId]?.[geneId]) return null
    const value = hypotheses[creatureId]?.[geneId] ?? ''
    if (value.length < 2) return null
    const key = `${role}:${geneId}:${value}`
    return guidedScaffolding.onWrongHypothesis[key] ?? null
  }

  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-700 font-serif">
          📓 Field Notebook
        </h3>
        <div className="text-xs text-stone-500 italic">
          Write what you think the genotype is. The notebook only accepts an
          answer once your breeding results support it.
        </div>
      </div>

      {geneIds.map(geneId => {
        const gene = blobSpecies.genes.find(g => g.id === geneId)
        if (!gene) return null
        const motherHint = lookupHint('mother', mother.id, geneId)
        const fatherHint = lookupHint('father', father.id, geneId)
        return (
          <div
            key={geneId}
            className="border-t border-stone-200 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0"
          >
            <div className="text-xs font-semibold text-stone-700 mb-2">
              Gene: {gene.name}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {motherName} ♀
                </div>
                <GenotypeInput creatureId={mother.id} geneId={geneId} />
                {motherHint && (
                  <div className="mt-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded p-2 leading-snug">
                    <span className="font-semibold">Hmm — </span>
                    {motherHint}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-stone-500 mb-1">
                  {fatherName} ♂
                </div>
                <GenotypeInput creatureId={father.id} geneId={geneId} />
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
