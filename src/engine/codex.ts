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
// phenotype. Used by the Trait Codex to render "TT=long, Tt=medium, tt=short"
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
  // Only set the FOCUS gene. Every other gene is left absent so its layer's
  // `if (phenotypeValue !== '<dominant symbol>')` guard hides it — no
  // spurious antennae, no default horn nubs, no default blotches, no
  // epistasis mask firing on a defaulted upstream, no polygenic collapsing
  // to "smallest". The preview shows exactly the trait you're previewing.
  return {
    id: `preview-${gene.id}-${alleles.join('')}`,
    speciesId: species.id,
    sex: 'F',
    genotype: { [gene.id]: [...alleles] },
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
