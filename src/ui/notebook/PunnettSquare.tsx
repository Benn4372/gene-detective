import { useMemo, useState } from 'react'
import type { Creature } from '../../engine/types'
import { blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'

interface Props {
  geneId: string
}

// Interactive Punnett square: the player fills the four header slots with
// allele letters (top = father's gametes, side = mother's gametes). The four
// body cells auto-populate with the predicted offspring genotype (sorted by
// dominance) and a semi-transparent mini blob showing that gene's phenotype.
export function PunnettSquare({ geneId }: Props) {
  const gene = blobSpecies.genes.find(g => g.id === geneId)
  const [topA, setTopA] = useState('')
  const [topB, setTopB] = useState('')
  const [sideA, setSideA] = useState('')
  const [sideB, setSideB] = useState('')

  const validSymbols = useMemo(
    () => (gene ? gene.alleles.map(a => a.symbol) : []),
    [gene],
  )

  if (!gene) return null

  const sanitize = (raw: string): string => {
    const ch = raw.trim().slice(-1) // last char typed
    return validSymbols.includes(ch) ? ch : ''
  }

  const renderCell = (row: string, col: string) => {
    if (!row || !col) {
      return (
        <div className="w-20 h-20 border border-slate-200 bg-slate-50/40 rounded" />
      )
    }
    // Sort by dominance for canonical notation.
    const sorted = [row, col].sort((a, b) => {
      const ra = gene.alleles.find(al => al.symbol === a)?.dominanceRank ?? 0
      const rb = gene.alleles.find(al => al.symbol === b)?.dominanceRank ?? 0
      return rb - ra
    })
    const label = sorted.join('')
    return (
      <div className="w-20 h-20 border border-slate-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.5 }}>
          <MiniBlobForGene geneId={geneId} alleles={sorted} />
        </div>
        <div className="text-xs font-mono font-semibold text-slate-700 absolute bottom-1">
          {label}
        </div>
      </div>
    )
  }

  const headerInputClass =
    'w-8 h-8 text-center font-mono border border-slate-300 rounded bg-white'

  return (
    <div className="inline-block">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-10 h-10"></th>
            <th className="w-20 pb-1 text-center">
              <input
                type="text"
                value={topA}
                onChange={e => setTopA(sanitize(e.target.value))}
                placeholder="?"
                className={headerInputClass + ' bg-blue-50'}
                maxLength={1}
              />
            </th>
            <th className="w-20 pb-1 text-center">
              <input
                type="text"
                value={topB}
                onChange={e => setTopB(sanitize(e.target.value))}
                placeholder="?"
                className={headerInputClass + ' bg-blue-50'}
                maxLength={1}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="w-10 pr-1 text-center">
              <input
                type="text"
                value={sideA}
                onChange={e => setSideA(sanitize(e.target.value))}
                placeholder="?"
                className={headerInputClass + ' bg-pink-50'}
                maxLength={1}
              />
            </th>
            <td>{renderCell(sideA, topA)}</td>
            <td>{renderCell(sideA, topB)}</td>
          </tr>
          <tr>
            <th className="w-10 pr-1 text-center">
              <input
                type="text"
                value={sideB}
                onChange={e => setSideB(sanitize(e.target.value))}
                placeholder="?"
                className={headerInputClass + ' bg-pink-50'}
                maxLength={1}
              />
            </th>
            <td>{renderCell(sideB, topA)}</td>
            <td>{renderCell(sideB, topB)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-2">
        Top row = father's gametes · Left column = mother's gametes · Each cell
        shows a translucent preview of what an offspring with that genotype would
        look like.
      </p>
    </div>
  )
}

// Renders a small blob showing only one gene's phenotype (other traits use the
// species default of "recessive homozygote" so they don't appear).
function MiniBlobForGene({
  geneId,
  alleles,
}: {
  geneId: string
  alleles: string[]
}) {
  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null
  const alleleIds = alleles
    .map(sym => gene.alleles.find(a => a.symbol === sym)?.id)
    .filter((x): x is string => !!x)

  const genotype: Record<string, string[]> = {}
  // Fill every other gene with two recessive alleles so their layers stay hidden.
  for (const g of blobSpecies.genes) {
    if (g.id === geneId) continue
    const recessive = [...g.alleles].sort(
      (a, b) => a.dominanceRank - b.dominanceRank,
    )[0]
    if (recessive) genotype[g.id] = [recessive.id, recessive.id]
  }
  genotype[geneId] = alleleIds

  const creature: Creature = {
    id: 'preview',
    speciesId: blobSpecies.id,
    sex: 'F',
    genotype,
    age: 0,
    scope: 'village',
  }
  return <BlobRenderer creature={creature} species={blobSpecies} size={54} />
}
