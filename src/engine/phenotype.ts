import type { AlleleId, Creature, Gene, Phenotype, Species, Trait } from './types'
import { alleleById } from './genotype'

// Compute the full phenotype of a creature given its species.
// Iterates traits and delegates to a model-specific resolver based on the
// gene(s) that express each trait.
export function computePhenotype(creature: Creature, species: Species): Phenotype {
  const phenotype: Phenotype = {}
  const genesByTrait = indexGenesByTrait(species)

  for (const trait of species.traits) {
    const genes = genesByTrait[trait.id] ?? []
    if (genes.length === 0) continue
    // For MVP each trait is expressed by one gene. Multi-gene expression
    // (polygenic, pleiotropy, epistasis) handled when those lessons unlock.
    const gene = genes[0]!
    const alleles = creature.genotype[gene.id] ?? []
    phenotype[trait.id] = expressTrait(gene, alleles, trait)
  }

  return phenotype
}

function indexGenesByTrait(species: Species): Record<string, Gene[]> {
  const idx: Record<string, Gene[]> = {}
  for (const gene of species.genes) {
    for (const traitId of gene.expressesTraits) {
      if (!idx[traitId]) idx[traitId] = []
      idx[traitId]!.push(gene)
    }
  }
  return idx
}

function expressTrait(gene: Gene, alleles: AlleleId[], _trait: Trait): string {
  switch (gene.inheritanceModel) {
    case 'simpleDominant':
      return expressSimpleDominant(gene, alleles)
    case 'incompleteDominant':
      return expressIncompleteDominant(gene, alleles)
    case 'codominant':
      return expressCodominant(gene, alleles)
    case 'multipleAllele':
      // For multiple alleles with a linear dominance hierarchy this is the same
      // as simpleDominant on the highest-ranked allele present.
      return expressSimpleDominant(gene, alleles)
    case 'sexLinked':
    case 'polygenic':
    case 'epistaticModifier':
    case 'imprinted':
    case 'mitochondrial':
    case 'lethal':
    case 'modifier':
    case 'pleiotropic':
      throw new Error(
        `Inheritance model "${gene.inheritanceModel}" not yet implemented — ` +
          `will be added when its lesson is built.`,
      )
  }
}

function expressSimpleDominant(gene: Gene, alleles: AlleleId[]): string {
  if (alleles.length === 0) return 'absent'
  // Highest dominance rank wins.
  const best = alleles
    .map(id => alleleById(gene, id))
    .sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!
  return best.symbol
}

function expressIncompleteDominant(gene: Gene, alleles: AlleleId[]): string {
  if (alleles.length !== 2) return expressSimpleDominant(gene, alleles)
  const a = alleleById(gene, alleles[0]!)
  const b = alleleById(gene, alleles[1]!)
  if (a.id === b.id) return a.symbol
  // Heterozygote: blended phenotype notation, e.g. "A/a"
  const sorted = [a, b].sort((x, y) => y.dominanceRank - x.dominanceRank)
  return `${sorted[0]!.symbol}/${sorted[1]!.symbol}`
}

function expressCodominant(gene: Gene, alleles: AlleleId[]): string {
  if (alleles.length !== 2) return expressSimpleDominant(gene, alleles)
  const a = alleleById(gene, alleles[0]!)
  const b = alleleById(gene, alleles[1]!)
  if (a.id === b.id) return a.symbol
  // Codominant heterozygote: both phenotypes present, notation "AB"
  const sorted = [a, b].sort((x, y) => y.dominanceRank - x.dominanceRank)
  return `${sorted[0]!.symbol}${sorted[1]!.symbol}`
}
