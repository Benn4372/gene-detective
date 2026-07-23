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
  // Ch 24. Probability of nondisjunction per meiosis for this chromosome.
  // When it fires, the gamete carries BOTH homologs' alleles (giving trisomic
  // offspring when the other parent's gamete is normal). 0 = never.
  nondisjunctionRate?: number
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
  // Environmental-expression threshold. If defined, the gene's dominant
  // phenotype only shows when the ambient temperature is at or above this
  // value; otherwise it expresses as recessive.
  environmentalThreshold?: number
  // Ch 16 — sex-influenced dominance. When true, dominance ranks are
  // effectively INVERTED in females: the recessive allele wins in the
  // heterozygote.
  sexInfluenced?: boolean
  // Ch 17 — sex-limited expression. Gene only expresses phenotypically in
  // the specified sex; the other sex always shows the recessive phenotype
  // regardless of genotype.
  sexLimitedTo?: 'M' | 'F'
  // Ch 24 — probability of nondisjunction per meiosis for this gene's
  // chromosome. 0 = never; 0.03 = ~3%. Used by meiose() to occasionally
  // produce a two-allele gamete.
  nondisjunctionRate?: number
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
  // Where this creature "lives".
  //   'trophy'   — a permanent Trophy Shelf figurine, one per completed chapter.
  //   'chapter'  — scratch inside a Chapter Runner stage. Discarded on exit.
  //   'mission'  — scratch inside a Mission Runner. Discarded on submit / exit.
  scope: CreatureScope
  // Ch 42+: gene ids methylated in this creature. Methylated dominant alleles
  // don't express (phenotype falls through to recessive). Inherited maternally
  // during cross(); can be added or removed by environmental interventions.
  methylatedGenes?: string[]
}

export type CreatureScope =
  | 'trophy'
  | { kind: 'chapter'; chapterId: string; stage: 'guided' | 'solo' | 'master' }
  | { kind: 'mission'; missionId: string }

export interface Gamete {
  alleles: Record<string, AlleleId>
  sexChromosome: 'X' | 'Y' | 'Z' | 'W' | null
}
