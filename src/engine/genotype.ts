import type { Allele, AlleleId, Gene, Genotype } from './types'

export function alleleById(gene: Gene, id: AlleleId): Allele {
  const a = gene.alleles.find(x => x.id === id)
  if (!a) throw new Error(`Unknown allele "${id}" on gene "${gene.id}"`)
  return a
}

export function allelesAt(genotype: Genotype, geneId: string): AlleleId[] {
  return genotype[geneId] ?? []
}

// Canonical string for a diploid genotype at one gene, e.g. "Aa" or "aA" → "Aa".
// Sorted by dominance rank descending (dominant first) so notation is stable.
export function genotypeString(gene: Gene, alleles: AlleleId[]): string {
  const sorted = [...alleles].sort((a, b) => {
    const ar = alleleById(gene, a).dominanceRank
    const br = alleleById(gene, b).dominanceRank
    return br - ar
  })
  return sorted.map(id => alleleById(gene, id).symbol).join('')
}

export function makeGenotype(
  entries: Record<string, AlleleId[]>,
): Genotype {
  return { ...entries }
}
