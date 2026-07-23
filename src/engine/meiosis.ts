import type { Creature, Gamete, Gene, Species } from './types'
import type { Random } from './random'

// Group genes by chromosome id (small helper — avoids pulling in lodash).
function groupGenesByChromosome(species: Species): Record<string, Gene[]> {
  const groups: Record<string, Gene[]> = {}
  for (const chromosome of species.chromosomes) {
    groups[chromosome.id] = []
  }
  for (const gene of species.genes) {
    if (!groups[gene.chromosome]) groups[gene.chromosome] = []
    groups[gene.chromosome]!.push(gene)
  }
  return groups
}

// Recombination probability between two adjacent loci given map distance in
// centimorgans. Small-distance approximation: p ≈ distance / 100, capped at
// 0.5 (fully unlinked — independent assortment).
function recombinationProbability(distanceCM: number): number {
  if (distanceCM <= 0) return 0
  return Math.min(0.5, distanceCM / 100)
}

// Produce a single haploid gamete from a parent.
//
// For each chromosome we start on a random homolog and walk along the ordered
// gene list; between adjacent gene pairs a crossover event may flip which
// homolog we sample from. Recombination probability derives from the gene
// map distance (locusCM).
//
// Sex chromosomes:
//   XY male   → 50/50 X-bearing or Y-bearing gamete
//   XX female → always X-bearing (pick one of two Xs)
//   mitochondrial → contributed by females only
export function meiose(parent: Creature, species: Species, rng: Random): Gamete {
  const gamete: Gamete = { alleles: {}, sexChromosome: null }
  const genesByChromosome = groupGenesByChromosome(species)

  const contributeGenesWithRecombination = (
    genes: Gene[],
    initialHomolog: number,
  ) => {
    if (genes.length === 0) return
    const ordered = [...genes].sort((a, b) => a.locusCM - b.locusCM)
    let homologIdx = initialHomolog
    for (let i = 0; i < ordered.length; i++) {
      if (i > 0) {
        const prev = ordered[i - 1]!
        const curr = ordered[i]!
        const distance = Math.abs(curr.locusCM - prev.locusCM)
        if (rng.next() < recombinationProbability(distance)) {
          homologIdx = 1 - homologIdx
        }
      }
      const gene = ordered[i]!
      const alleles = parent.genotype[gene.id]
      let contributed: string | undefined
      if (alleles && alleles[homologIdx] !== undefined) {
        contributed = alleles[homologIdx]!
      } else if (alleles && alleles.length === 1) {
        // Hemizygous (sex-linked in single-X male, mitochondrial, etc.) —
        // there's only one allele available; use it regardless of homologIdx.
        contributed = alleles[0]!
      }
      if (contributed === undefined) continue
      // Mutation: with probability gene.mutationRate, the contributed allele
      // flips to a randomly-chosen OTHER allele from the gene's allele pool.
      if (
        gene.mutationRate &&
        gene.mutationRate > 0 &&
        gene.alleles.length > 1 &&
        rng.next() < gene.mutationRate
      ) {
        const others = gene.alleles.filter(a => a.id !== contributed)
        if (others.length > 0) {
          const mutant = others[rng.int(others.length)]
          if (mutant) contributed = mutant.id
        }
      }
      gamete.alleles[gene.id] = contributed
    }
  }

  for (const chromosome of species.chromosomes) {
    const genes = genesByChromosome[chromosome.id] ?? []
    // Ch 24: check chromosome-level nondisjunction. When it fires, the
    // gamete carries BOTH homologs' alleles for every gene on this
    // chromosome — a "double" gamete. Combined with the other parent's
    // normal contribution, offspring end up trisomic for this chromosome.
    const nondisjoined =
      chromosome.type === 'autosome' &&
      chromosome.nondisjunctionRate &&
      rng.next() < chromosome.nondisjunctionRate
    if (nondisjoined) {
      for (const gene of genes) {
        const alleles = parent.genotype[gene.id]
        if (alleles && alleles.length >= 2) {
          // Encode "both alleles" by storing a combined id ('id1|id2').
          gamete.alleles[gene.id] = `${alleles[0]}|${alleles[1]}`
        }
      }
      continue
    }
    switch (chromosome.type) {
      case 'autosome': {
        contributeGenesWithRecombination(genes, rng.int(2))
        break
      }
      case 'sex-X': {
        if (parent.sex === 'F') {
          contributeGenesWithRecombination(genes, rng.int(2))
          gamete.sexChromosome = 'X'
        } else {
          // XY male: this chromosome is his single X. Only produces an X-gamete
          // 50% of the time (the other 50% he produces a Y-gamete, handled below).
          gamete.sexChromosome = pickMaleSexChromosome(species, rng, gamete)
          if (gamete.sexChromosome === 'X') {
            contributeGenesWithRecombination(genes, 0)
          }
        }
        break
      }
      case 'sex-Y': {
        if (parent.sex === 'M') {
          if (gamete.sexChromosome === null) {
            gamete.sexChromosome = pickMaleSexChromosome(species, rng, gamete)
          }
          if (gamete.sexChromosome === 'Y') {
            contributeGenesWithRecombination(genes, 0)
          }
        }
        break
      }
      case 'sex-Z':
      case 'sex-W':
        // ZW system (birds) — reserved for later lessons.
        break
      case 'mitochondrial': {
        if (parent.sex === 'F') contributeGenesWithRecombination(genes, 0)
        break
      }
    }
  }

  return gamete
}

// XY male: decide once per gamete whether he contributes X or Y.
// We stash the choice on the gamete itself so a second call returns the same value.
function pickMaleSexChromosome(
  _species: Species,
  rng: Random,
  gamete: Gamete,
): 'X' | 'Y' {
  if (gamete.sexChromosome === 'X' || gamete.sexChromosome === 'Y') {
    return gamete.sexChromosome
  }
  return rng.bool() ? 'X' : 'Y'
}
