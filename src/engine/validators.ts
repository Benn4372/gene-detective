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
  if (ctx.tier === 'strict') return hasStrictEvidence(ctx)
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
  // Hemizygous case (single allele — X-linked in XY males, Z-linked in ZW
  // females, mitochondrial, etc.): phenotype uniquely determines the allele,
  // so no additional cross evidence is required.
  if (symbols.length === 1) return true
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

// Strict tier: player's hypothesized parent genotypes must be supported by a
// chi-square goodness-of-fit test against ALL observed offspring from that
// creature's crosses. p-value threshold 0.05 (fail-to-reject means the
// observed distribution is consistent with the hypothesis's expected ratios).
//
// Only runs when the medium-tier evidence bar is also met — chi-square with
// too little data isn't meaningful.
function hasStrictEvidence(ctx: ValidationContext): boolean {
  if (!hasMediumEvidence(ctx)) return false
  // Gather every offspring where this creature was a parent.
  const crossesInvolving = ctx.crossHistory.filter(
    r => r.motherId === ctx.creature.id || r.fatherId === ctx.creature.id,
  )
  const offspring: Creature[] = []
  for (const record of crossesInvolving) {
    for (const oId of record.offspringIds) {
      const child = ctx.creatures[oId]
      if (child) offspring.push(child)
    }
  }
  // Need a reasonable sample. Chi-square with expected counts under 5 per
  // category is unreliable; require ≥20 total observations before applying.
  if (offspring.length < 20) return false

  // Bucket the offspring by phenotype for this gene.
  const observed: Record<string, number> = {}
  for (const child of offspring) {
    const phen = computePhenotype(child, ctx.species)[ctx.geneId]
    if (!phen) continue
    observed[phen] = (observed[phen] ?? 0) + 1
  }

  // Compute the expected phenotype distribution for the hypothesized cross.
  // Because a hypothesis is only about ONE creature's genotype, we look up the
  // other-parent's genotype from the most-crossed partner for this creature.
  const partnerCounts = new Map<string, number>()
  for (const r of crossesInvolving) {
    const partnerId = r.motherId === ctx.creature.id ? r.fatherId : r.motherId
    partnerCounts.set(partnerId, (partnerCounts.get(partnerId) ?? 0) + 1)
  }
  const dominantPartnerId = [...partnerCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0]
  if (!dominantPartnerId) return false
  const partner = ctx.creatures[dominantPartnerId]
  if (!partner) return false

  const expectedProbs = expectedPhenotypeDistribution(
    ctx,
    partner,
  )
  if (!expectedProbs) return false

  // Compute chi-square = Σ (O - E)² / E across all buckets in the expected.
  const total = offspring.length
  let chiSq = 0
  let degreesOfFreedom = -1 // one fewer than the number of categories
  for (const [phen, prob] of Object.entries(expectedProbs)) {
    const expected = prob * total
    if (expected <= 0) continue
    const obs = observed[phen] ?? 0
    chiSq += Math.pow(obs - expected, 2) / expected
    degreesOfFreedom++
  }
  if (degreesOfFreedom < 1) return false

  const pValue = chiSquarePValue(chiSq, degreesOfFreedom)
  // Fail-to-reject at α = 0.05 → hypothesis is consistent with observation.
  return pValue >= 0.05
}

// Compute the expected phenotype distribution for THIS creature's gene, given
// the hypothesized genotype for the creature and the partner's actual genotype.
// Returns null if the required data isn't available.
function expectedPhenotypeDistribution(
  ctx: ValidationContext,
  partner: Creature,
): Record<string, number> | null {
  const gene = ctx.species.genes.find(g => g.id === ctx.geneId)
  if (!gene) return null

  // Convert the hypothesis string to an allele-id pair using symbol → id lookup.
  const hypAlleles: string[] = []
  for (const ch of ctx.hypothesizedGenotype) {
    const found = gene.alleles.find(a => a.symbol === ch)
    if (found) hypAlleles.push(found.id)
  }
  if (hypAlleles.length !== 2) return null

  const partnerAlleles = partner.genotype[ctx.geneId]
  if (!partnerAlleles || partnerAlleles.length !== 2) return null

  // Build a lightweight probability map of offspring genotypes, then convert
  // each to its phenotype and sum.
  const outcomeCounts = new Map<string, number>()
  for (const a of hypAlleles) {
    for (const b of partnerAlleles) {
      const alleles = [a, b]
      // Build a preview creature to run through computePhenotype.
      const preview: Creature = {
        id: 'chi-preview',
        speciesId: ctx.species.id,
        sex: 'F',
        genotype: { [ctx.geneId]: alleles },
        age: 0,
        scope: 'trophy',
      }
      const phen = computePhenotype(preview, ctx.species)[ctx.geneId]
      if (!phen) continue
      outcomeCounts.set(phen, (outcomeCounts.get(phen) ?? 0) + 1)
    }
  }
  const totalOutcomes = [...outcomeCounts.values()].reduce((s, v) => s + v, 0)
  if (totalOutcomes === 0) return null
  const dist: Record<string, number> = {}
  for (const [phen, count] of outcomeCounts) {
    dist[phen] = count / totalOutcomes
  }
  return dist
}

// P-value for a chi-square statistic with given degrees of freedom. Uses the
// upper regularized incomplete gamma function, computed via a series /
// continued-fraction split (Numerical Recipes-style, adapted for readability).
export function chiSquarePValue(chiSq: number, df: number): number {
  if (chiSq <= 0 || df <= 0) return 1
  return upperIncompleteGammaRegularized(df / 2, chiSq / 2)
}

// Q(a, x) = Γ(a, x) / Γ(a). Series expansion below the boundary, continued
// fraction above. Not intended for extreme values — sufficient for classroom
// chi-square with df up to ~20 and stat up to ~100.
function upperIncompleteGammaRegularized(a: number, x: number): number {
  if (x < 0 || a <= 0) return 1
  if (x === 0) return 1
  if (x < a + 1) return 1 - gammaSeries(a, x)
  return gammaContinuedFraction(a, x)
}

function gammaSeries(a: number, x: number): number {
  const maxIter = 200
  const eps = 1e-12
  let ap = a
  let sum = 1 / a
  let term = sum
  for (let n = 1; n <= maxIter; n++) {
    ap += 1
    term *= x / ap
    sum += term
    if (Math.abs(term) < Math.abs(sum) * eps) break
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a))
}

function gammaContinuedFraction(a: number, x: number): number {
  const maxIter = 200
  const eps = 1e-12
  const fpmin = 1e-300
  let b = x + 1 - a
  let c = 1 / fpmin
  let d = 1 / b
  let h = d
  for (let i = 1; i <= maxIter; i++) {
    const an = -i * (i - a)
    b += 2
    d = an * d + b
    if (Math.abs(d) < fpmin) d = fpmin
    c = b + an / c
    if (Math.abs(c) < fpmin) c = fpmin
    d = 1 / d
    const delta = d * c
    h *= delta
    if (Math.abs(delta - 1) < eps) break
  }
  return h * Math.exp(-x + a * Math.log(x) - logGamma(a))
}

// Lanczos approximation for ln Γ(x). Good to ~15 significant digits over x > 0.
function logGamma(x: number): number {
  const g = 7
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]
  if (x < 0.5) {
    // Reflection formula.
    return (
      Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x)
    )
  }
  x -= 1
  let a = c[0]!
  const t = x + g + 0.5
  for (let i = 1; i < g + 2; i++) a += c[i]! / (x + i)
  return (
    0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a)
  )
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
