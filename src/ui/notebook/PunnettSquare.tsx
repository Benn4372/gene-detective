import { blobSpecies } from '../../content'

interface Props {
  motherGenotype: string
  fatherGenotype: string
  geneId: string
}

// Simple 4-cell (or 2-cell) Punnett grid for a single gene.
// Uses the two hypothesized genotype strings the player has entered.
export function PunnettSquare({ motherGenotype, fatherGenotype, geneId }: Props) {
  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

  const motherAlleles = motherGenotype.split('').filter(Boolean)
  const fatherAlleles = fatherGenotype.split('').filter(Boolean)

  if (motherAlleles.length !== 2 || fatherAlleles.length !== 2) {
    return (
      <div className="text-xs text-slate-500 italic">
        Enter both parents' full genotypes to see the Punnett square.
      </div>
    )
  }

  // Deduplicate gamete alleles for display (e.g. AA → only 'A').
  const motherGametes = [...new Set(motherAlleles)]
  const fatherGametes = [...new Set(fatherAlleles)]

  return (
    <div className="inline-block">
      <table className="border-collapse text-center text-sm">
        <thead>
          <tr>
            <th className="w-10 h-10"></th>
            {fatherGametes.map(f => (
              <th key={f} className="w-10 h-10 bg-blue-50 font-mono">
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {motherGametes.map(m => (
            <tr key={m}>
              <th className="w-10 h-10 bg-pink-50 font-mono">{m}</th>
              {fatherGametes.map(f => {
                const combined = sortByDominance(gene, [m, f]).join('')
                return (
                  <td key={f} className="w-12 h-10 border border-slate-300 font-mono">
                    {combined}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-500 mt-1 text-center">
        Rows = mother's gametes · Columns = father's gametes
      </p>
    </div>
  )
}

function sortByDominance(gene: { alleles: { symbol: string; dominanceRank: number }[] }, symbols: string[]): string[] {
  return [...symbols].sort((a, b) => {
    const ra = gene.alleles.find(al => al.symbol === a)?.dominanceRank ?? 0
    const rb = gene.alleles.find(al => al.symbol === b)?.dominanceRank ?? 0
    return rb - ra
  })
}
