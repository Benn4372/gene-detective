import type { Creature, Genotype, Species } from './types'

// Compute exact expected offspring distribution from two parents.
// Does not use RNG — enumerates all possible gamete combinations.
// Autosomal only for now (matches MVP scope); sex-linked support added later.

export interface PunnettRow {
  genotypeKey: string
  genotype: Genotype
  probability: number
}

// Enumerate all haploid gamete "signatures" a parent can produce, with probabilities.
// A signature is a map of geneId → alleleId.
function enumerateGametes(
  parent: Creature,
  species: Species,
): Array<{ signature: Record<string, string>; probability: number }> {
  const autosomalGenes = species.genes.filter(
    g => species.chromosomes.find(c => c.id === g.chromosome)?.type === 'autosome',
  )

  // For each gene, list the alleles it can contribute (with equal probability among the two).
  const contributions = autosomalGenes.map(gene => {
    const alleles = parent.genotype[gene.id] ?? []
    if (alleles.length === 0) return { geneId: gene.id, options: [] as string[] }
    // Two homologs each contribute 1/2 the time.
    return { geneId: gene.id, options: alleles }
  })

  // Cartesian product with equal weights per option.
  let acc: Array<{ signature: Record<string, string>; probability: number }> = [
    { signature: {}, probability: 1 },
  ]
  for (const { geneId, options } of contributions) {
    if (options.length === 0) continue
    const next: typeof acc = []
    const perOption = 1 / options.length
    for (const partial of acc) {
      for (const alleleId of options) {
        next.push({
          signature: { ...partial.signature, [geneId]: alleleId },
          probability: partial.probability * perOption,
        })
      }
    }
    acc = next
  }

  // Merge duplicates (heterozygote AA produces 'A' allele from both homologs, etc.)
  const merged = new Map<string, { signature: Record<string, string>; probability: number }>()
  for (const gam of acc) {
    const key = JSON.stringify(gam.signature)
    const existing = merged.get(key)
    if (existing) existing.probability += gam.probability
    else merged.set(key, gam)
  }
  return [...merged.values()]
}

// Cross two parents' gamete distributions into an offspring genotype distribution.
export function computePunnett(
  motherIn: Creature,
  fatherIn: Creature,
  species: Species,
): PunnettRow[] {
  const mother = motherIn.sex === 'F' ? motherIn : fatherIn
  const father = motherIn.sex === 'M' ? motherIn : fatherIn

  const motherGametes = enumerateGametes(mother, species)
  const fatherGametes = enumerateGametes(father, species)

  const outcomes = new Map<string, PunnettRow>()

  for (const m of motherGametes) {
    for (const f of fatherGametes) {
      const genotype: Genotype = {}
      const geneIds = new Set([...Object.keys(m.signature), ...Object.keys(f.signature)])
      for (const geneId of geneIds) {
        const mAllele = m.signature[geneId]
        const fAllele = f.signature[geneId]
        if (mAllele !== undefined && fAllele !== undefined) {
          genotype[geneId] = [mAllele, fAllele]
        } else if (mAllele !== undefined) {
          genotype[geneId] = [mAllele]
        } else if (fAllele !== undefined) {
          genotype[geneId] = [fAllele]
        }
      }
      const key = canonicalizeGenotype(genotype)
      const probability = m.probability * f.probability
      const existing = outcomes.get(key)
      if (existing) existing.probability += probability
      else outcomes.set(key, { genotypeKey: key, genotype, probability })
    }
  }

  return [...outcomes.values()].sort((a, b) => b.probability - a.probability)
}

// Canonical key for a genotype: sort alleles per gene, then serialize.
function canonicalizeGenotype(genotype: Genotype): string {
  const entries = Object.entries(genotype).map(([geneId, alleles]) => {
    const sorted = [...alleles].sort()
    return [geneId, sorted] as const
  })
  entries.sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}
