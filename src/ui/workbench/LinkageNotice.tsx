import { useMemo } from 'react'
import { blobSpecies } from '../../content'

interface Props {
  geneIds: string[]
}

// Small banner shown above the dihybrid Punnett when the two tracked genes
// sit on the same chromosome. Explains that the four gamete classes are
// NOT equally likely — parental combinations dominate, recombinants are
// rare in proportion to how close the genes are.
export function LinkageNotice({ geneIds }: Props) {
  const info = useMemo(() => {
    if (geneIds.length !== 2) return null
    const [g1, g2] = geneIds.map(id =>
      blobSpecies.genes.find(g => g.id === id),
    )
    if (!g1 || !g2) return null
    if (g1.chromosome !== g2.chromosome) return null
    // Sex chromosomes have their own display track — skip.
    const chromosome = blobSpecies.chromosomes.find(c => c.id === g1.chromosome)
    if (!chromosome) return null
    if (chromosome.type !== 'autosome') return null
    const distanceCM = Math.abs(g1.locusCM - g2.locusCM)
    // Small-distance approximation: recombination % ≈ distance in cM, capped
    // at 50 (fully unlinked).
    const recombPct = Math.min(50, distanceCM)
    const parentalPct = (100 - recombPct) / 2
    const recombPerClass = recombPct / 2
    return {
      chromosome: chromosome.id,
      g1Name: g1.name,
      g2Name: g2.name,
      distanceCM,
      recombPct,
      parentalPct,
      recombPerClass,
      linked: distanceCM < 50,
    }
  }, [geneIds])

  if (!info || !info.linked) return null

  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-900">
      <div className="uppercase tracking-widest text-indigo-700 mb-1 text-[10px]">
        Linkage · {info.chromosome}
      </div>
      <div className="leading-snug">
        <span className="font-semibold">{info.g1Name}</span> and{' '}
        <span className="font-semibold">{info.g2Name}</span> sit{' '}
        <span className="font-mono">{info.distanceCM} cM</span> apart on the same
        chromosome. Their gametes DON'T shuffle independently — expect the two
        <em> parental</em> combinations to dominate offspring, and the two
        <em> recombinant</em> combinations to be rare.
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded bg-white border border-indigo-100 px-2 py-1">
          <div className="text-indigo-600 text-[9px] uppercase tracking-wide">Parental (each)</div>
          <div className="font-mono">~{info.parentalPct.toFixed(1)}%</div>
        </div>
        <div className="rounded bg-white border border-indigo-100 px-2 py-1">
          <div className="text-indigo-600 text-[9px] uppercase tracking-wide">Recombinant (each)</div>
          <div className="font-mono">~{info.recombPerClass.toFixed(1)}%</div>
        </div>
      </div>
      <div className="mt-2 text-[10px] italic text-indigo-800/80">
        The 4×4 Punnett below shows all sixteen cell outcomes, but count them
        by observed frequency, not by cell count.
      </div>
    </div>
  )
}
