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

// Produce a single haploid gamete from a parent.
// MVP: for each chromosome, pick one homolog. No recombination yet.
// Sex chromosomes:
//   XY male   → 50/50 X-bearing or Y-bearing gamete
//   XX female → always X-bearing (pick one of two Xs)
//   mitochondrial → contributed by females only
export function meiose(parent: Creature, species: Species, rng: Random): Gamete {
  const gamete: Gamete = { alleles: {}, sexChromosome: null }
  const genesByChromosome = groupGenesByChromosome(species)

  const contributeFromHomolog = (genes: Gene[], homologIdx: number) => {
    for (const gene of genes) {
      const alleles = parent.genotype[gene.id]
      if (alleles && alleles[homologIdx] !== undefined) {
        gamete.alleles[gene.id] = alleles[homologIdx]!
      }
    }
  }

  for (const chromosome of species.chromosomes) {
    const genes = genesByChromosome[chromosome.id] ?? []
    switch (chromosome.type) {
      case 'autosome': {
        const homologIdx = rng.int(2)
        contributeFromHomolog(genes, homologIdx)
        break
      }
      case 'sex-X': {
        if (parent.sex === 'F') {
          const homologIdx = rng.int(2)
          contributeFromHomolog(genes, homologIdx)
          gamete.sexChromosome = 'X'
        } else {
          // XY male: this chromosome is his single X. Only produces an X-gamete
          // 50% of the time (the other 50% he produces a Y-gamete, handled below).
          // We pick which sex chromosome to include per gamete once, using a
          // marker on Y so both branches don't fire. To keep meiose deterministic,
          // we handle the choice here and skip Y contribution if X was chosen.
          gamete.sexChromosome = pickMaleSexChromosome(species, rng, gamete)
          if (gamete.sexChromosome === 'X') {
            contributeFromHomolog(genes, 0)
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
            contributeFromHomolog(genes, 0)
          }
        }
        break
      }
      case 'sex-Z':
      case 'sex-W':
        // ZW system (birds) — reserved for later lessons.
        break
      case 'mitochondrial': {
        if (parent.sex === 'F') contributeFromHomolog(genes, 0)
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
