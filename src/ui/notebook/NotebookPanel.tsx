import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { GenotypeInput } from '../shared/GenotypeInput'
import { PunnettSquare } from './PunnettSquare'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
}

// Notebook for a lesson's two starter creatures: shows each creature's card
// with hypothesis inputs per gene, plus a Punnett square for each gene.
export function NotebookPanel({ motherId, fatherId, geneIds }: Props) {
  const mother = useGameStore(s => s.creatures[motherId])
  const father = useGameStore(s => s.creatures[fatherId])

  if (!mother || !father) return null

  return (
    <div className="mt-6 bg-white/90 rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">📓 Notebook</h3>
      <p className="text-sm text-slate-500 mb-4">
        Fill in what you think each parent's genotype is (e.g. Aa, aa, AA). The
        notebook only accepts an answer when your breeding results actually
        support it. Use the Punnett square below to sketch out predicted crosses
        and compare them against the litter you observed.
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
              <div className="text-xs text-slate-500 mb-2">
                Punnett square scratchpad — type each parent's gametes into the
                header cells
              </div>
              <PunnettSquare geneId={geneId} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

