import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { GenotypeInput } from '../shared/GenotypeInput'
import { computePhenotype } from '../../engine/phenotype'
import { PunnettSquare } from './PunnettSquare'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
}

// Notebook for a lesson's two starter creatures: shows each creature's card
// with hypothesis inputs per gene, plus a Punnett square for each gene.
const EMPTY_HYP: Record<string, string> = Object.freeze({}) as Record<string, string>

export function NotebookPanel({ motherId, fatherId, geneIds }: Props) {
  const mother = useGameStore(s => s.creatures[motherId])
  const father = useGameStore(s => s.creatures[fatherId])
  const hypotheses = useGameStore(s => s.hypotheses)
  const crossHistoryAll = useGameStore(s => s.crossHistory)
  const creatures = useGameStore(s => s.creatures)

  if (!mother || !father) return null

  const motherHyp = hypotheses[motherId] ?? EMPTY_HYP
  const fatherHyp = hypotheses[fatherId] ?? EMPTY_HYP
  const crossHistory = crossHistoryAll.filter(
    x => (x.motherId === motherId || x.motherId === fatherId) &&
         (x.fatherId === motherId || x.fatherId === fatherId),
  )
  // fatherHyp is currently only used via the individual GenotypeInput selectors;
  // holding a ref here keeps future ratio-panel work simple.
  void fatherHyp

  return (
    <div className="mt-6 bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">📓 Notebook</h3>
      <p className="text-sm text-slate-500 mb-4">
        Fill in what you think each parent's genotype is. The notebook only accepts an
        answer when your breeding results actually support it.
      </p>

      {geneIds.map(geneId => {
        const gene = blobSpecies.genes.find(g => g.id === geneId)
        if (!gene) return null
        const motherName = mother.ownerName ?? 'Mother'
        const fatherName = father.ownerName ?? 'Father'
        return (
          <div key={geneId} className="mb-6 border-t border-slate-100 pt-4">
            <h4 className="font-medium text-slate-700 mb-3">Gene: {gene.name}</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">{motherName} (♀)</div>
                <GenotypeInput creatureId={mother.id} geneId={geneId} />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{fatherName} (♂)</div>
                <GenotypeInput creatureId={father.id} geneId={geneId} />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Punnett square (from your hypotheses)</div>
              <PunnettSquare
                motherGenotype={motherHyp[geneId] ?? ''}
                fatherGenotype={fatherHyp[geneId] ?? ''}
                geneId={geneId}
              />
            </div>
          </div>
        )
      })}

      {crossHistory.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h4 className="font-medium text-slate-700 mb-2">
            Cross history ({crossHistory.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {crossHistory.slice(-6).reverse().map(record => (
              <div key={record.id} className="text-xs">
                <div className="text-slate-500 mb-1">
                  Litter of {record.offspringIds.length}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {record.offspringIds.map(oId => {
                    const child = creatures[oId]
                    if (!child) return null
                    const phen = computePhenotype(child, blobSpecies)
                    return (
                      <div
                        key={oId}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded"
                      >
                        {child.sex === 'F' ? '♀' : '♂'}{' '}
                        {geneIds.map(g => phen[g]).join(' · ')}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
