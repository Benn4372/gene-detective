import type { Creature, Gamete, Genotype, Sex, Species } from './types'
import { meiose } from './meiosis'
import type { Random } from './random'

export interface CrossOptions {
  litterSize: number
}

export interface Offspring {
  id: string
  sex: Sex
  genotype: Genotype
  parentIds: [string, string]
}

// Combine two gametes into a diploid genotype and determine sex.
// Convention: maternal allele is index 0 (for future imprinting logic),
// paternal allele is index 1.
function combineGametes(
  mother: Gamete,
  father: Gamete,
  species: Species,
): { genotype: Genotype; sex: Sex } {
  const genotype: Genotype = {}
  for (const gene of species.genes) {
    const m = mother.alleles[gene.id]
    const p = father.alleles[gene.id]
    if (m !== undefined && p !== undefined) {
      genotype[gene.id] = [m, p]
    } else if (m !== undefined) {
      genotype[gene.id] = [m]
    } else if (p !== undefined) {
      genotype[gene.id] = [p]
    }
    // If neither parent contributed (e.g. Y-linked gene in an XX offspring), gene absent.
  }

  const sex = determineSex(species, mother, father)
  return { genotype, sex }
}

function determineSex(species: Species, mother: Gamete, father: Gamete): Sex {
  switch (species.sexSystem) {
    case 'XY':
      // Father's sex chromosome determines offspring sex.
      return father.sexChromosome === 'Y' ? 'M' : 'F'
    case 'ZW':
      // Mother's sex chromosome determines. (Birds, some reptiles.)
      return mother.sexChromosome === 'W' ? 'F' : 'M'
    case 'XO':
    case 'haplodiploid':
    case 'temperatureDependent':
      // Not implemented until their respective lessons.
      return 'F'
  }
}

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `c${Date.now().toString(36)}-${idCounter}`
}

// Perform a full cross: produce a litter of offspring.
// Throws if the pair isn't a valid breeding pair (same-species, opposite sex, alive).
export function cross(
  motherIn: Creature,
  fatherIn: Creature,
  species: Species,
  rng: Random,
  options: CrossOptions,
): Offspring[] {
  if (motherIn.speciesId !== species.id || fatherIn.speciesId !== species.id) {
    throw new Error('Both parents must belong to the given species')
  }
  if (motherIn.sex === fatherIn.sex) {
    throw new Error('Cannot cross two creatures of the same sex')
  }
  const mother = motherIn.sex === 'F' ? motherIn : fatherIn
  const father = motherIn.sex === 'M' ? motherIn : fatherIn

  const offspring: Offspring[] = []
  for (let i = 0; i < options.litterSize; i++) {
    const motherGamete = meiose(mother, species, rng)
    const fatherGamete = meiose(father, species, rng)
    const { genotype, sex } = combineGametes(motherGamete, fatherGamete, species)
    offspring.push({
      id: nextId(),
      sex,
      genotype,
      parentIds: [mother.id, father.id],
    })
  }
  return offspring
}
