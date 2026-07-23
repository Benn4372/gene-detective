import type { Creature, Species } from './types'
import { alleleById } from './genotype'

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

// Returns true iff the hypothesis is correct.
//
// Historically medium/strict tiers also required breeding evidence — the
// player had to have bred enough offspring to distinguish e.g. Aa from AA
// before their "Aa" hypothesis was accepted. Playtesting showed this gate
// jammed chapters where the mystery genotype was already deducible from
// the parents' visible phenotype (Ch 5 codominance, incomplete-dominance
// stages, sex-linked crosses where a single-son observation is enough).
// The "gather evidence" nudge became the top failure mode, so the gate is
// removed: as soon as the player types the correct genotype, it validates.
// Strict tier still runs a chi-square when there's enough data — but no
// longer BLOCKS validation when data is scarce.
export function validateHypothesis(ctx: ValidationContext): boolean {
  if (!genotypesEqual(ctx.hypothesizedGenotype, ctx.correctGenotype)) return false
  return true
}

// Compare two genotype strings, ignoring the order the player typed the letters.
function genotypesEqual(a: string, b: string): boolean {
  return a.split('').sort().join('') === b.split('').sort().join('')
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
