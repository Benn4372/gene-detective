import type { AlleleId, Creature, Gene, Species } from './types'
import { alleleById } from './genotype'
import { computePhenotype } from './phenotype'

export interface GenotypeTableRow {
  // Canonical genotype string, dominant-first (e.g. "Aa", "G" for hemizygous
  // males, "RB" for codominant heterozygotes).
  genotype: string
  // Allele ids used to construct the preview creature — one for
  // mitochondrial/hemizygous-male, two otherwise.
  alleles: AlleleId[]
  // Phenotype value for this genotype (as computePhenotype would return).
  phenotype: string
  // Whether this genotype is homozygous. Meaningless for 1-allele rows.
  isHomozygous: boolean
  // Sex label to show alongside — 'F', 'M', or null for autosomal rows.
  sexLabel: 'F' | 'M' | null
}

// Enumerate every possible genotype for a single gene, paired with its
// phenotype. Used by the Trait Codex to render "TT=long, Tt=medium, tt=short"
// tables the player can look up any time.
//
// Sex-linked and mitochondrial genes need special-cased rows: sex-linked
// females get 3 diploid rows and males get 2 hemizygous rows; mitochondrial
// genes get single-allele rows only. Sex-limited genes render the sex that
// actually expresses. Otherwise it's the standard diploid enumeration.
export function computeGenotypeTable(
  gene: Gene,
  species: Species,
): GenotypeTableRow[] {
  const rows: GenotypeTableRow[] = []
  const traitId = gene.expressesTraits[0]!
  const sortedAlleles = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )

  // Mitochondrial: single allele from mother, all offspring inherit it.
  if (gene.inheritanceModel === 'mitochondrial') {
    for (const a of sortedAlleles) {
      const preview = makePreviewCreature(gene, [a.id], species, 'F')
      const phen = computePhenotype(preview, species)
      rows.push({
        genotype: a.symbol,
        alleles: [a.id],
        phenotype: phen[traitId] ?? '—',
        isHomozygous: true,
        sexLabel: null,
      })
    }
    return rows
  }

  // Sex-linked: females get diploid rows, males get hemizygous rows.
  if (gene.inheritanceModel === 'sexLinked') {
    // Female rows — the usual pairwise enumeration.
    const seen = new Set<string>()
    for (let i = 0; i < sortedAlleles.length; i++) {
      for (let j = i; j < sortedAlleles.length; j++) {
        const a1 = sortedAlleles[i]!
        const a2 = sortedAlleles[j]!
        const genotype = a1.symbol + a2.symbol
        if (seen.has(genotype)) continue
        seen.add(genotype)
        const preview = makePreviewCreature(gene, [a1.id, a2.id], species, 'F')
        const phen = computePhenotype(preview, species)
        rows.push({
          genotype,
          alleles: [a1.id, a2.id],
          phenotype: phen[traitId] ?? '—',
          isHomozygous: a1.id === a2.id,
          sexLabel: 'F',
        })
      }
    }
    // Male rows — one hemizygous row per allele.
    for (const a of sortedAlleles) {
      const preview = makePreviewCreature(gene, [a.id], species, 'M')
      const phen = computePhenotype(preview, species)
      rows.push({
        genotype: a.symbol,
        alleles: [a.id],
        phenotype: phen[traitId] ?? '—',
        isHomozygous: true,
        sexLabel: 'M',
      })
    }
    return rows
  }

  // Sex-limited genes: only one sex ever expresses the trait, so pick that
  // sex for the preview creature (otherwise the preview renders as invisible).
  const previewSex = gene.sexLimitedTo ?? 'F'

  // Sex-influenced: same diploid genotype, DIFFERENT phenotype by sex. Render
  // both male and female preview rows so the player can see the flip.
  if (gene.sexInfluenced) {
    const seen = new Set<string>()
    for (let i = 0; i < sortedAlleles.length; i++) {
      for (let j = i; j < sortedAlleles.length; j++) {
        const a1 = sortedAlleles[i]!
        const a2 = sortedAlleles[j]!
        const genotype = a1.symbol + a2.symbol
        if (seen.has(genotype)) continue
        seen.add(genotype)
        for (const sex of ['F', 'M'] as const) {
          const preview = makePreviewCreature(gene, [a1.id, a2.id], species, sex)
          const phen = computePhenotype(preview, species)
          rows.push({
            genotype,
            alleles: [a1.id, a2.id],
            phenotype: phen[traitId] ?? '—',
            isHomozygous: a1.id === a2.id,
            sexLabel: sex,
          })
        }
      }
    }
    return rows
  }

  // Standard diploid enumeration for everything else.
  const seen = new Set<string>()
  for (let i = 0; i < sortedAlleles.length; i++) {
    for (let j = i; j < sortedAlleles.length; j++) {
      const a1 = sortedAlleles[i]!
      const a2 = sortedAlleles[j]!
      const genotype = a1.symbol + a2.symbol
      if (seen.has(genotype)) continue
      seen.add(genotype)
      const preview = makePreviewCreature(gene, [a1.id, a2.id], species, previewSex)
      const phen = computePhenotype(preview, species)
      rows.push({
        genotype,
        alleles: [a1.id, a2.id],
        phenotype: phen[traitId] ?? '—',
        isHomozygous: a1.id === a2.id,
        sexLabel: gene.sexLimitedTo ?? null,
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
  alleles: AlleleId[],
  species: Species,
  sex: 'F' | 'M' = 'F',
): Creature {
  // Only set the FOCUS gene. Every other gene is left absent so its layer's
  // `if (phenotypeValue !== '<dominant symbol>')` guard hides it — no
  // spurious antennae, no default horn nubs, no default blotches, no
  // epistasis mask firing on a defaulted upstream, no polygenic collapsing
  // to "smallest". The preview shows exactly the trait you're previewing.
  return {
    id: `preview-${gene.id}-${alleles.join('')}-${sex}`,
    speciesId: species.id,
    sex,
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
