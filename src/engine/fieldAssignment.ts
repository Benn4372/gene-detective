import type { AlleleId, Creature, Gene, Sex, Species } from './types'

// Field Assignment puzzle generator.
//
// Rolls a random target phenotype using the traits the player has unlocked,
// then constructs 4 starter blobs (2 female, 2 male) whose combined allele
// pool is guaranteed to be able to reach that target in <= 2 breeding
// generations. Non-target genes get random alleles so the starters look
// interestingly different rather than sharing a colour scheme.
//
// Excluded from targeting in this first pass:
//   • size (polygenic aggregate — a target of "size 6" needs coordinated
//     alleles across 3 genes; not hard, just special-cased)
//   • metabolism (pleiotropic invisible marker on the antennae gene — you
//     can't target metabolism directly, it always co-segregates with
//     antennae)
//   • lethalCoat homozygous 'C' — never observable
//   • imprintMark, mitoHalo (single-parent inheritance quirks are legal
//     but confusing as random targets; can be added back later)
//
// Everything else is fair game.

export interface FieldPuzzle {
  targetPhenotype: Record<string, string>
  starters: Array<{
    sex: Sex
    genotype: Record<string, AlleleId[]>
    defaultName: string
  }>
}

const EXCLUDED_TRAIT_IDS = new Set([
  'size',
  'metabolism',
  'imprintMark',
  'mitoHalo',
])

// Given a gene, return the phenotype values that can be legitimately
// targeted. Skips homozygous-lethal genotypes so we don't ask the player
// to breed a phenotype that dies before observation.
function targetablePhenotypes(gene: Gene): string[] {
  if (gene.inheritanceModel === 'sexLinked') {
    // Females can be dominant, hetero (dominant phen), or recessive.
    // Males are hemizygous — dominant or recessive.
    // Just target female phenotypes here — sex of target creature isn't
    // constrained yet, but the phenotype value must be reachable in either sex.
    const symbols = [...gene.alleles].map(a => a.symbol)
    return symbols // 'G' (glow) and 'g' (no glow)
  }
  if (gene.inheritanceModel === 'codominant') {
    // R, B, RB
    const [a, b] = gene.alleles
    return [a!.symbol, b!.symbol, a!.symbol + b!.symbol]
  }
  if (gene.inheritanceModel === 'incompleteDominant') {
    // T, T/t, t
    const dom = [...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!
    const rec = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!
    return [dom.symbol, `${dom.symbol}/${rec.symbol}`, rec.symbol]
  }
  if (gene.inheritanceModel === 'multipleAllele') {
    // L, M, n — the visible phenotype is the dominant symbol per genotype
    return [...gene.alleles]
      .sort((a, b) => b.dominanceRank - a.dominanceRank)
      .map(a => a.symbol)
  }
  // simpleDominant, fallback: dominant or recessive
  const dom = [...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!
  const rec = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!
  if (gene.lethalGenotypes?.includes(dom.symbol + dom.symbol)) {
    // Dominant homozygous is lethal — the visible dominant phenotype is
    // still reachable via the heterozygote, so it's fine to target.
    return [dom.symbol, rec.symbol]
  }
  return [dom.symbol, rec.symbol]
}

// The critical alleles needed in the parent pool so a target phenotype is
// achievable. For most models this is "at least one of each contributing
// allele" — the four-starter algorithm makes sure those alleles appear
// somewhere among the four blobs.
function requiredAlleles(gene: Gene, targetPhenotype: string): AlleleId[] {
  const dom = [...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)[0]!
  const rec = [...gene.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]!
  if (gene.inheritanceModel === 'codominant') {
    if (targetPhenotype.length === 2) {
      // 'RB' — need both alleles in the pool
      return [gene.alleles[0]!.id, gene.alleles[1]!.id]
    }
    // 'R' or 'B' — need matching homozygote so both parent contribs are that allele
    const match = gene.alleles.find(a => a.symbol === targetPhenotype)!
    return [match.id, match.id]
  }
  if (gene.inheritanceModel === 'incompleteDominant') {
    if (targetPhenotype.includes('/')) {
      // 'T/t' — need one of each
      return [dom.id, rec.id]
    }
    if (targetPhenotype === dom.symbol) return [dom.id, dom.id]
    return [rec.id, rec.id]
  }
  if (gene.inheritanceModel === 'multipleAllele') {
    // Target is the dominant symbol of the genotype; need at least that
    // allele plus any lower-ranked one so the phenotype can be reached.
    const match = gene.alleles.find(a => a.symbol === targetPhenotype)
    if (!match) return [dom.id]
    return [match.id]
  }
  // simpleDominant + sexLinked
  if (targetPhenotype === dom.symbol) return [dom.id]
  return [rec.id, rec.id] // recessive: both parents need to be able to pass rec
}

// Pick a random allele-pair for a gene (diploid random). Rejects any pair
// whose canonical genotype string is on the gene's lethalGenotypes list —
// otherwise a random CC starter for lethalCoat would produce 100% dead
// offspring and the puzzle would be unsolvable.
function randomAllelePair(gene: Gene, rng: () => number): AlleleId[] {
  const lethals = new Set(gene.lethalGenotypes ?? [])
  for (let attempt = 0; attempt < 20; attempt++) {
    const a = gene.alleles[Math.floor(rng() * gene.alleles.length)]!
    const b = gene.alleles[Math.floor(rng() * gene.alleles.length)]!
    const canonical = canonicalPair(a.symbol, b.symbol, gene)
    if (!lethals.has(canonical)) return [a.id, b.id]
  }
  // Fallback — pick the dominant + recessive so at least it's viable.
  const dom = [...gene.alleles].sort((x, y) => y.dominanceRank - x.dominanceRank)[0]!
  const rec = [...gene.alleles].sort((x, y) => x.dominanceRank - y.dominanceRank)[0]!
  return [dom.id, rec.id]
}

function canonicalPair(a: string, b: string, gene: Gene): string {
  const rankA = gene.alleles.find(al => al.symbol === a)?.dominanceRank ?? 0
  const rankB = gene.alleles.find(al => al.symbol === b)?.dominanceRank ?? 0
  return rankA >= rankB ? a + b : b + a
}

// Mitochondrial / sex-linked-male hemizygous: single allele.
function randomSingleAllele(gene: Gene, rng: () => number): AlleleId[] {
  const a = gene.alleles[Math.floor(rng() * gene.alleles.length)]!
  return [a.id]
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const copy = [...arr]
  const out: T[] = []
  while (out.length < n && copy.length) {
    const i = Math.floor(rng() * copy.length)
    out.push(copy[i]!)
    copy.splice(i, 1)
  }
  return out
}

// Build the four starter genotypes, then seed the required alleles for each
// target gene across the pool so at least one breeding path exists.
export function generateFieldPuzzle(
  unlockedTraitIds: string[],
  species: Species,
  rng: () => number = Math.random,
): FieldPuzzle {
  const eligibleTraits = species.traits.filter(
    t =>
      unlockedTraitIds.includes(t.id) &&
      !EXCLUDED_TRAIT_IDS.has(t.id) &&
      t.category === 'visible',
  )
  if (eligibleTraits.length < 2) {
    // Shouldn't happen — Field Assignments only unlocks after Ch 23, by which
    // point the player has 10+ visible traits. But be defensive.
    throw new Error('Not enough unlocked traits for a field puzzle')
  }

  // 2-5 target traits (or all eligible if fewer than 5)
  const n = 2 + Math.floor(rng() * Math.min(4, eligibleTraits.length - 1))
  const targetTraits = pickN(eligibleTraits, n, rng)

  const targetPhenotype: Record<string, string> = {}
  const requiredByGeneId: Record<string, AlleleId[]> = {}
  for (const trait of targetTraits) {
    const gene = species.genes.find(g => g.expressesTraits.includes(trait.id))
    if (!gene) continue
    const options = targetablePhenotypes(gene)
    const pick = options[Math.floor(rng() * options.length)]!
    targetPhenotype[trait.id] = pick
    requiredByGeneId[gene.id] = requiredAlleles(gene, pick)
  }

  // Assign genotypes to 4 starters (2F + 2M). For every gene, roll a random
  // pair; then patch in the required alleles for target genes so the pool
  // contains them.
  const genotypes: Array<Record<string, AlleleId[]>> = [{}, {}, {}, {}]
  const sexes: Sex[] = ['F', 'F', 'M', 'M']

  for (const gene of species.genes) {
    const chromosome = species.chromosomes.find(c => c.id === gene.chromosome)
    const isMito = chromosome?.type === 'mitochondrial'
    const isSex = gene.inheritanceModel === 'sexLinked'
    for (let i = 0; i < 4; i++) {
      if (isMito) {
        genotypes[i]![gene.id] = randomSingleAllele(gene, rng)
      } else if (isSex && sexes[i] === 'M') {
        // Hemizygous — single X
        genotypes[i]![gene.id] = randomSingleAllele(gene, rng)
      } else {
        genotypes[i]![gene.id] = randomAllelePair(gene, rng)
      }
    }
    // If this gene has required alleles from the target, inject them.
    const req = requiredByGeneId[gene.id]
    if (req && req.length > 0) {
      injectRequiredAlleles(genotypes, sexes, gene, req, isMito, isSex, rng)
    }
  }

  return {
    targetPhenotype,
    starters: genotypes.map((g, i) => ({
      sex: sexes[i]!,
      genotype: g,
      defaultName:
        sexes[i] === 'F'
          ? ['Blob Δ', 'Blob Ε'][i] ?? `Blob ${i + 1}`
          : ['Blob Ζ', 'Blob Η'][i - 2] ?? `Blob ${i + 1}`,
    })),
  }
}

// For a gene whose target requires specific alleles in the parent pool, this
// makes sure the pool contains them without destroying the random look of
// the starters. Strategy: pick the first N starters and set one of their
// slots to the required allele. N = number of unique required alleles.
function injectRequiredAlleles(
  genotypes: Array<Record<string, AlleleId[]>>,
  sexes: Sex[],
  gene: Gene,
  required: AlleleId[],
  isMito: boolean,
  isSex: boolean,
  rng: () => number,
): void {
  // Ensure each unique required allele appears in at least one starter's
  // slot. For diploids we can overwrite one of the two slots per creature.
  const uniqueRequired = [...new Set(required)]

  // Prefer distributing across DIFFERENT starters so a single starter
  // isn't carrying the whole burden. Shuffle indices for variety.
  const indices = [0, 1, 2, 3]
  // Fisher-Yates
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
  }

  let placed = 0
  for (const idx of indices) {
    if (placed >= uniqueRequired.length) break
    const allele = uniqueRequired[placed]!
    const slot = genotypes[idx]!
    if (isMito) {
      slot[gene.id] = [allele]
    } else if (isSex && sexes[idx] === 'M') {
      slot[gene.id] = [allele]
    } else {
      // Diploid: put the required allele in slot 0, keep whatever was in
      // slot 1 (random) so genotype still looks varied.
      const existing = slot[gene.id] ?? [allele, allele]
      slot[gene.id] = [allele, existing[1] ?? allele]
    }
    placed++
  }

  // If we needed the SAME allele twice (recessive homozygote target etc.),
  // duplicate it into one starter's second slot too, guaranteeing at least
  // one starter can be a homozygous-contributor.
  if (required.length > uniqueRequired.length) {
    const idx = indices[0]!
    const slot = genotypes[idx]!
    if (!isMito && !(isSex && sexes[idx] === 'M')) {
      slot[gene.id] = [required[0]!, required[0]!]
    }
  }
}

// Whether a creature's phenotype matches the target.
export function creatureMatchesTarget(
  creature: Creature,
  target: Record<string, string>,
  computePhenotype: (c: Creature) => Record<string, string>,
): boolean {
  const phen = computePhenotype(creature)
  return Object.entries(target).every(([tid, val]) => phen[tid] === val)
}
