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
  methylatedGenes?: string[]
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
    // Nondisjunction encoding: a gamete allele of "id1|id2" means both
    // homolog copies were contributed. Combined with the other parent's
    // normal one-allele contribution, this yields three alleles (trisomic).
    const mAlleles = m !== undefined ? m.split('|') : []
    const pAlleles = p !== undefined ? p.split('|') : []
    const combined = [...mAlleles, ...pAlleles]
    if (combined.length > 0) genotype[gene.id] = combined
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
    // Lethal-genotype filter: any gene declaring lethalGenotypes drops
    // offspring whose canonical genotype string matches. Ratio distortion is
    // the whole point — the lethal class simply disappears from the litter.
    if (isLethal(genotype, species)) continue
    // Methylation inherited maternally by default (roughly mirrors real
    // biology: methylation reset in male germline is more thorough).
    const methylatedGenes = mother.methylatedGenes
      ? [...mother.methylatedGenes]
      : undefined
    offspring.push({
      id: nextId(),
      sex,
      genotype,
      parentIds: [mother.id, father.id],
      methylatedGenes,
    })
  }
  return offspring
}

function isLethal(genotype: Genotype, species: Species): boolean {
  for (const gene of species.genes) {
    if (!gene.lethalGenotypes || gene.lethalGenotypes.length === 0) continue
    const alleles = genotype[gene.id]
    if (!alleles) continue
    // Build canonical dominant-first string.
    const symbols = alleles
      .map(id => gene.alleles.find(a => a.id === id)?.symbol ?? '')
      .filter(s => s.length > 0)
      .sort((a, b) => {
        const rankA = gene.alleles.find(al => al.symbol === a)?.dominanceRank ?? 0
        const rankB = gene.alleles.find(al => al.symbol === b)?.dominanceRank ?? 0
        return rankB - rankA
      })
    const genotypeStr = symbols.join('')
    if (gene.lethalGenotypes.includes(genotypeStr)) return true
  }
  return false
}
