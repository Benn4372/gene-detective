import type { AlleleId, Creature, Gene, Species } from './types'
import { alleleById } from './genotype'
import { computePhenotype } from './phenotype'

export interface GenotypeTableRow {
  // Canonical two-allele genotype string, dominant-first (e.g. "Aa").
  genotype: string
  // Ordered pair of allele ids for constructing a preview creature.
  alleles: [AlleleId, AlleleId]
  // Phenotype value for this genotype (as computePhenotype would return).
  phenotype: string
  // Whether this genotype is homozygous.
  isHomozygous: boolean
}

// Enumerate every possible diploid genotype for a single gene, paired with its
// phenotype. Used by the Trait Codex to render "RR=red, Rr=pink, rr=white"
// tables the player can look up any time.
export function computeGenotypeTable(
  gene: Gene,
  species: Species,
): GenotypeTableRow[] {
  const rows: GenotypeTableRow[] = []
  const seen = new Set<string>()
  const sortedAlleles = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )
  for (let i = 0; i < sortedAlleles.length; i++) {
    for (let j = i; j < sortedAlleles.length; j++) {
      const a1 = sortedAlleles[i]!
      const a2 = sortedAlleles[j]!
      const genotype = a1.symbol + a2.symbol
      if (seen.has(genotype)) continue
      seen.add(genotype)
      const preview = makePreviewCreature(gene, [a1.id, a2.id], species)
      const phen = computePhenotype(preview, species)
      const traitId = gene.expressesTraits[0]!
      rows.push({
        genotype,
        alleles: [a1.id, a2.id],
        phenotype: phen[traitId] ?? '—',
        isHomozygous: a1.id === a2.id,
      })
    }
  }
  return rows
}

// Build a minimal preview creature that only expresses this gene — every other
// gene defaults to the recessive homozygote so its layer stays hidden. Used
// for genotype-table cell previews and Punnett cell renders.
export function makePreviewCreature(
  gene: Gene,
  alleles: [AlleleId, AlleleId],
  species: Species,
): Creature {
  const genotype: Record<string, AlleleId[]> = {}
  // Genes referenced as the `ifGene` of some epistasis rule — leave them
  // absent so the rule doesn't fire and mask the focus trait. Otherwise the
  // color preview (say) gets masked yellow by a defaulted coatPigment cc.
  const epistaticUpstreams = new Set<string>()
  for (const g of species.genes) {
    for (const rule of g.epistasisRules ?? []) {
      epistaticUpstreams.add(rule.ifGene)
    }
  }
  for (const g of species.genes) {
    if (g.id === gene.id) continue
    // Polygenic contributors: leaving them absent makes the preview render at
    // neutral size instead of "0 dominants → smallest".
    if (g.inheritanceModel === 'polygenic') continue
    // Epistatic upstream: leaving absent avoids triggering the mask.
    if (epistaticUpstreams.has(g.id)) continue
    const recessive = [...g.alleles].sort(
      (a, b) => a.dominanceRank - b.dominanceRank,
    )[0]
    if (recessive) genotype[g.id] = [recessive.id, recessive.id]
  }
  genotype[gene.id] = [...alleles]
  return {
    id: `preview-${gene.id}-${alleles.join('')}`,
    speciesId: species.id,
    sex: 'F',
    genotype,
    age: 0,
    scope: 'trophy',
  }
}

// Convenience for the Punnett cell renderer — same as makePreviewCreature but
// pairs the two alleles in dominance-first order for a canonical display.
export function orderedPair(
  gene: Gene,
  a: AlleleId,
  b: AlleleId,
): [AlleleId, AlleleId] {
  const ra = alleleById(gene, a).dominanceRank
  const rb = alleleById(gene, b).dominanceRank
  return ra >= rb ? [a, b] : [b, a]
}
