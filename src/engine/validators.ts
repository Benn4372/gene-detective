import type { Creature, Species } from './types'
import { alleleById } from './genotype'
import { computePhenotype } from './phenotype'

export type ValidationTier = 'loose' | 'medium' | 'strict'

// Minimal shape the validator needs from the game state.
// Kept as a local type so this module stays free of state-store imports.
export interface CrossEvidence {
  motherId: string
  fatherId: string
  offspringIds: string[]
}

export interface ValidationContext {
  creature: Creature
  geneId: string
  hypothesizedGenotype: string
  correctGenotype: string
  species: Species
  creatures: Record<string, Creature>
  crossHistory: CrossEvidence[]
  tier: ValidationTier
}

// Returns true iff the hypothesis is correct AND the tier's evidence bar is met.
export function validateHypothesis(ctx: ValidationContext): boolean {
  if (!genotypesEqual(ctx.hypothesizedGenotype, ctx.correctGenotype)) return false
  if (ctx.tier === 'loose') return true
  return hasMediumEvidence(ctx)
}

// Compare two genotype strings, ignoring the order the player typed the letters.
function genotypesEqual(a: string, b: string): boolean {
  return a.split('').sort().join('') === b.split('').sort().join('')
}

function hasMediumEvidence(ctx: ValidationContext): boolean {
  const gene = ctx.species.genes.find(g => g.id === ctx.geneId)
  if (!gene) return false

  const symbols = [...ctx.hypothesizedGenotype]
  const isHomozygous = symbols.length === 2 && symbols[0] === symbols[1]

  const crossesInvolving = ctx.crossHistory.filter(
    r => r.motherId === ctx.creature.id || r.fatherId === ctx.creature.id,
  )
  if (crossesInvolving.length === 0) return false

  if (isHomozygous) {
    // Homozygous hypothesis: any breeding data at all is enough. The creature's
    // own phenotype already narrows to two options (dominant → AA or Aa;
    // recessive → aa), and if breeding confirmed no contrary offspring appeared,
    // that's sufficient evidence at this tier.
    return true
  }

  // Heterozygous hypothesis: need to have observed at least one offspring whose
  // phenotype reveals the hidden recessive allele.
  const recessiveAllele = [...gene.alleles].sort(
    (a, b) => a.dominanceRank - b.dominanceRank,
  )[0]!
  for (const record of crossesInvolving) {
    for (const offspringId of record.offspringIds) {
      const child = ctx.creatures[offspringId]
      if (!child) continue
      const phen = computePhenotype(child, ctx.species)[ctx.geneId]
      if (phen === recessiveAllele.symbol) return true
    }
  }
  return false
}

// Format a hypothesis string canonically (dominant first).
// Used to display the "correct" form back to the player.
export function canonicalizeHypothesis(
  species: Species,
  geneId: string,
  raw: string,
): string {
  const gene = species.genes.find(g => g.id === geneId)
  if (!gene) return raw
  const symbols = raw
    .split('')
    .filter(ch => gene.alleles.some(a => a.symbol === ch))
  const sorted = symbols.sort((a, b) => {
    const rankA =
      gene.alleles.find(al => al.symbol === a)?.dominanceRank ?? 0
    const rankB =
      gene.alleles.find(al => al.symbol === b)?.dominanceRank ?? 0
    return rankB - rankA
  })
  return sorted.join('')
}

// Helper: return the recessive allele object for a gene (for phenotype comparisons in UI).
export function recessiveAllele(species: Species, geneId: string) {
  const gene = species.genes.find(g => g.id === geneId)
  if (!gene) return null
  return [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!
}

// Placeholder — kept so upstream code can already reference alleleById if it needs to.
export { alleleById }
