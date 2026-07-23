import type { Gene } from '../engine/types'

// Human-readable placeholder for a genotype input on a given gene.
// For 2-allele autosomal / codominant / incomplete dominant: "AA / Aa / aa".
// For 3+ allele series (horns L/M/n): enumerate every unordered diploid
// combination, ordered by dominance (LL, LM, Ln, MM, Mn, nn).
// For sex-linked / hemizygous: shows the single-allele form plus the
// standard female form.
// For mitochondrial: single allele only.
export function genotypePlaceholder(gene: Gene): string {
  const alleles = gene.alleles

  if (gene.inheritanceModel === 'mitochondrial') {
    return alleles.map(a => a.symbol).join(' / ')
  }
  if (gene.inheritanceModel === 'sexLinked') {
    // Male hemizygous: single letter. Female: two letters.
    const twoAllele = alleles.length === 2
    if (twoAllele) {
      const dom = [...alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!.symbol
      const rec = [...alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!.symbol
      return `${dom}${dom} / ${dom}${rec} / ${rec}${rec}  |  ${dom} / ${rec}`
    }
  }

  // General diploid enumeration — every unordered allele pair, dominance-ordered.
  if (alleles.length >= 2) {
    const sorted = [...alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)
    const combos: string[] = []
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i; j < sorted.length; j++) {
        combos.push(sorted[i]!.symbol + sorted[j]!.symbol)
      }
    }
    return combos.join(' / ')
  }

  // Single-allele exotic (shouldn't happen in practice).
  return alleles.map(a => a.symbol).join('')
}
