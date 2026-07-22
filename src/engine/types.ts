// Core types for the genetics engine.
// Designed to express every inheritance model in the game's curriculum,
// though only the models needed by unlocked lessons are implemented in phenotype.ts.

export type ChromosomeType =
  | 'autosome'
  | 'sex-X'
  | 'sex-Y'
  | 'sex-Z'
  | 'sex-W'
  | 'mitochondrial'

export interface Chromosome {
  id: string
  type: ChromosomeType
  lengthCM: number
}

export type SexSystem = 'XY' | 'ZW' | 'XO' | 'haplodiploid' | 'temperatureDependent'
export type Sex = 'M' | 'F'

export type AlleleId = string

export interface Allele {
  id: AlleleId
  symbol: string
  dominanceRank: number
  effect?: unknown
}

export type InheritanceModel =
  | 'simpleDominant'
  | 'incompleteDominant'
  | 'codominant'
  | 'multipleAllele'
  | 'sexLinked'
  | 'polygenic'
  | 'epistaticModifier'
  | 'imprinted'
  | 'mitochondrial'
  | 'lethal'
  | 'modifier'
  | 'pleiotropic'

export interface EpistasisRule {
  ifGene: string
  ifGenotypeMatches: (alleles: AlleleId[]) => boolean
  maskWith: string
}

export interface Gene {
  id: string
  name: string
  chromosome: string
  locusCM: number
  alleles: Allele[]
  inheritanceModel: InheritanceModel
  expressesTraits: string[]
  epistasisRules?: EpistasisRule[]
  imprintOrigin?: 'maternal' | 'paternal'
  lethalGenotypes?: string[]
  mutationRate?: number
}

export interface Trait {
  id: string
  name: string
  category: 'visible' | 'chemical' | 'behavioral'
  description?: string
}

export interface Species {
  id: string
  name: string
  chromosomes: Chromosome[]
  sexSystem: SexSystem
  genes: Gene[]
  traits: Trait[]
}

export type Genotype = Record<string, AlleleId[]>

export type Phenotype = Record<string, string>

export interface Creature {
  id: string
  speciesId: string
  ownerName?: string
  sex: Sex
  genotype: Genotype
  age: number
  parentIds?: [string, string]
  birthCrossId?: string
  // Where this creature "lives". Lesson-scoped creatures are scratch — they exist
  // only for observation during that lesson and are discarded on completion.
  // Village-scoped creatures are permanent residents.
  scope: CreatureScope
}

export type CreatureScope =
  | 'village'
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'lab'; orderId: string }

export interface Gamete {
  alleles: Record<string, AlleleId>
  sexChromosome: 'X' | 'Y' | 'Z' | 'W' | null
}
