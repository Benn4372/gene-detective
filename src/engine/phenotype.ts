import type { AlleleId, Creature, Gene, Phenotype, Species, Trait } from './types'
import { alleleById } from './genotype'
import { getEnvironmentTemperature } from './environment'

// Compute the full phenotype of a creature given its species.
// Iterates traits and delegates to a model-specific resolver based on the
// gene(s) that express each trait.
export function computePhenotype(creature: Creature, species: Species): Phenotype {
  const phenotype: Phenotype = {}
  const genesByTrait = indexGenesByTrait(species)

  for (const trait of species.traits) {
    const genes = genesByTrait[trait.id] ?? []
    if (genes.length === 0) continue
    // Polygenic: multiple genes contribute additively to a single trait. Sum
    // the "large" (highest-rank) allele contributions across all polygenic
    // genes expressing this trait and map to a bucket string. Skip if the
    // creature carries no polygenic alleles — the trait doesn't apply.
    if (genes[0]!.inheritanceModel === 'polygenic') {
      const val = expressPolygenic(genes, creature)
      if (val !== null) phenotype[trait.id] = val
      continue
    }
    const gene = genes[0]!
    const alleles = creature.genotype[gene.id] ?? []
    // A creature without ANY of this gene's alleles simply doesn't carry the
    // trait — skip every override branch and mark it absent. Otherwise the
    // sex-limited / methylation branches below would materialise a spurious
    // recessive phenotype (e.g. every male trophy would list broodPouch 'u'
    // even though they never inherited a broodPouch gene at all).
    if (alleles.length === 0) {
      phenotype[trait.id] = 'absent'
      continue
    }
    // Sex-limited: gene only expresses in the specified sex. The other sex
    // always shows recessive, regardless of genotype.
    if (gene.sexLimitedTo && creature.sex !== gene.sexLimitedTo) {
      const rec = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]
      phenotype[trait.id] = rec?.symbol ?? 'absent'
      continue
    }
    // Methylation: dominant expression is silenced when this gene is on the
    // creature's methylated list. Phenotype drops to the recessive symbol.
    if (creature.methylatedGenes?.includes(gene.id)) {
      const rec = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]
      phenotype[trait.id] = rec?.symbol ?? 'absent'
      continue
    }
    // Imprinting: silence one parental copy — expression relies only on the
    // other. Convention: index 0 = maternal, 1 = paternal (set by cross()).
    let effectiveAlleles = alleles
    if (gene.imprintOrigin && alleles.length === 2) {
      effectiveAlleles =
        gene.imprintOrigin === 'maternal'
          ? [alleles[1]!] // maternal silenced → only paternal expresses
          : [alleles[0]!] // paternal silenced → only maternal expresses
    }
    // Epistasis: if another gene masks this one under specific conditions,
    // its maskWith replaces the normal expression.
    const masked = evaluateEpistasis(gene, creature)
    if (masked !== null) {
      phenotype[trait.id] = masked
      continue
    }
    let value = expressTrait(gene, effectiveAlleles, trait, creature)
    // Environmental gating: temperature below the gene's threshold forces
    // the recessive phenotype even if dominants are present. Only applies
    // when the creature actually carries this gene — an absent gene stays
    // absent, otherwise cold-default forces every blob to look like it
    // carries the recessive of every environmental gene.
    if (
      value !== 'absent' &&
      gene.environmentalThreshold !== undefined &&
      getEnvironmentTemperature() < gene.environmentalThreshold
    ) {
      const recessive = [...gene.alleles].sort(
        (a, b) => a.dominanceRank - b.dominanceRank,
      )[0]
      if (recessive) value = recessive.symbol
    }
    phenotype[trait.id] = value
  }

  return phenotype
}

// Sum the highest-ranked-allele contributions across the polygenic genes
// expressing this trait. Returns a compact numeric string (e.g. "3" out of a
// max of "6" for three genes with two alleles each). Returns null if the
// creature carries no polygenic alleles at all — the trait doesn't apply,
// so we shouldn't render as "0" (smallest size).
function expressPolygenic(genes: Gene[], creature: Creature): string | null {
  let count = 0
  let anyAllelesPresent = false
  for (const gene of genes) {
    if (gene.inheritanceModel !== 'polygenic') continue
    const alleles = creature.genotype[gene.id] ?? []
    if (alleles.length > 0) anyAllelesPresent = true
    const dominantId = [...gene.alleles].sort(
      (a, b) => b.dominanceRank - a.dominanceRank,
    )[0]?.id
    if (!dominantId) continue
    for (const alleleId of alleles) {
      if (alleleId === dominantId) count += 1
    }
  }
  if (!anyAllelesPresent) return null
  return String(count)
}

function evaluateEpistasis(gene: Gene, creature: Creature): string | null {
  if (!gene.epistasisRules || gene.epistasisRules.length === 0) return null
  for (const rule of gene.epistasisRules) {
    const upstream = creature.genotype[rule.ifGene]
    if (!upstream) continue
    if (rule.ifGenotypeMatches(upstream)) return rule.maskWith
  }
  return null
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

function expressTrait(gene: Gene, alleles: AlleleId[], _trait: Trait, creature: Creature): string {
  // Sex-influenced: dominance ranks flip for females — the recessive allele
  // wins in the heterozygote when the creature is female.
  if (gene.sexInfluenced && creature.sex === 'F' && alleles.length === 2) {
    const a = alleleById(gene, alleles[0]!)
    const b = alleleById(gene, alleles[1]!)
    if (a.id !== b.id) {
      const sorted = [a, b].sort((x, y) => x.dominanceRank - y.dominanceRank)
      return sorted[0]!.symbol
    }
  }
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
      // Phenotypically the same as simple dominance — highest-ranked allele
      // present wins. The difference is meiotic: fathers only pass their X
      // chromosome to daughters, so recessive X-linked alleles show up more
      // often in sons than daughters. That's handled by the cross/meiosis
      // machinery, not here.
      return expressSimpleDominant(gene, alleles)
    case 'polygenic':
      // Polygenic genes are aggregated at the trait level (see expressPolygenic).
      // Reaching this branch means a polygenic gene is being expressed alone,
      // which shouldn't happen in the current game — fall through as simple
      // dominance so we don't crash.
      return expressSimpleDominant(gene, alleles)
    case 'mitochondrial':
      // Single-allele (haploid), inherited maternally. Express directly.
      return expressSimpleDominant(gene, alleles)
    case 'epistaticModifier':
    case 'imprinted':
    case 'lethal':
    case 'modifier':
    case 'pleiotropic':
      // Fallback: treat like simple dominance so future chapters can rely on
      // these models without immediate engine rework. The special behavior
      // for each is layered on separately (epistasis via evaluateEpistasis,
      // lethals via the cross() filter, etc.).
      return expressSimpleDominant(gene, alleles)
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
