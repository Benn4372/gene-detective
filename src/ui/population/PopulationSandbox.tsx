import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import type { Creature, Species } from '../../engine/types'
import { computePhenotype } from '../../engine/phenotype'
import { makeRandom, type Random } from '../../engine/random'
import { cross } from '../../engine/cross'

export type PopulationForce =
  | 'drift'
  | 'founder'
  | 'migration'
  | 'selection'
  | 'balancing'
  | 'assortative'
  | 'inbreeding'
  | 'hybrid-vigor'
  | 'speciation'

interface Props {
  focusGeneId: string
  initialDominantFreq: number
  populationSize?: number
  generationsToExplore?: number
  // The specific evolutionary force to simulate each generation. Undefined
  // falls back to plain random-mating drift (Ch 12).
  force?: PopulationForce
  onFullyExplored?(): void
}

// Population Sandbox — Hardy-Weinberg testbed used by Ch 12 and the entire
// evolutionary tier (Ch 27-35). Each generation step is a random-mating
// simulation MODIFIED by the active force:
//
//   drift             — plain random mating (default, HW baseline).
//   founder           — resample the population down to 8 individuals once,
//                       preserving allele frequencies but with high sampling
//                       error, then random mating.
//   migration         — every gen, ~10% of the population is replaced by
//                       immigrants at the source frequency (initialDominantFreq).
//   selection         — dominant-phenotype individuals reproduce 2× as often.
//   balancing         — heterozygous individuals reproduce 2× as often.
//   assortative       — pair with mates of the same phenotype whenever possible.
//   inbreeding        — pair with the nearest sibling by index (models a small
//                       closed group).
//   hybrid-vigor      — heterozygous offspring have 2× survival; homozygous
//                       ones half.
//   speciation        — after generation 3, the population splits into two
//                       reproductively isolated halves; drift accelerates.
export function PopulationSandbox({
  focusGeneId,
  initialDominantFreq,
  populationSize = 48,
  generationsToExplore = 5,
  force,
  onFullyExplored,
}: Props) {
  const gene = blobSpecies.genes.find(g => g.id === focusGeneId)
  const [pop, setPop] = useState<Creature[]>(() =>
    seedPopulation(blobSpecies, focusGeneId, initialDominantFreq, populationSize),
  )
  const [generation, setGeneration] = useState(0)
  const [splitPop, setSplitPop] = useState<Creature[] | null>(null)

  const advance = () => {
    const rng = makeRandom()
    let next: Creature[]
    let nextSplit: Creature[] | null = splitPop
    switch (force) {
      case 'founder':
        // Founder event fires once, at generation 0. All subsequent gens are
        // plain random mating over the bottlenecked survivors.
        if (generation === 0) {
          const founders = sampleWithoutReplacement(pop, 8, rng)
          next = randomMatingGeneration(founders, blobSpecies, rng, populationSize)
        } else {
          next = randomMatingGeneration(pop, blobSpecies, rng, populationSize)
        }
        break
      case 'migration':
        next = migrationGeneration(
          pop,
          blobSpecies,
          rng,
          focusGeneId,
          initialDominantFreq,
        )
        break
      case 'selection':
        next = selectionGeneration(
          pop,
          blobSpecies,
          rng,
          focusGeneId,
          'dominant',
        )
        break
      case 'balancing':
        next = selectionGeneration(
          pop,
          blobSpecies,
          rng,
          focusGeneId,
          'heterozygote',
        )
        break
      case 'assortative':
        next = assortativeMatingGeneration(pop, blobSpecies, rng, focusGeneId)
        break
      case 'inbreeding':
        next = inbreedingGeneration(pop, blobSpecies, rng)
        break
      case 'hybrid-vigor':
        next = hybridVigorGeneration(pop, blobSpecies, rng, focusGeneId)
        break
      case 'speciation':
        // From gen 3 onward, split into two isolated halves.
        if (generation >= 3) {
          if (!nextSplit) nextSplit = pop.slice(pop.length / 2)
          const halfA = pop.slice(0, pop.length / 2)
          const halfB = nextSplit
          const newA = randomMatingGeneration(halfA, blobSpecies, rng, halfA.length)
          const newB = randomMatingGeneration(halfB, blobSpecies, rng, halfB.length)
          next = newA
          nextSplit = newB
        } else {
          next = randomMatingGeneration(pop, blobSpecies, rng, populationSize)
        }
        break
      case 'drift':
      default:
        next = randomMatingGeneration(pop, blobSpecies, rng, populationSize)
    }
    setPop(next)
    setSplitPop(nextSplit)
    setGeneration(g => {
      const ng = g + 1
      if (ng >= generationsToExplore && onFullyExplored) onFullyExplored()
      return ng
    })
  }

  const reset = () => {
    setPop(seedPopulation(blobSpecies, focusGeneId, initialDominantFreq, populationSize))
    setSplitPop(null)
    setGeneration(0)
  }

  const freqs = useMemo(
    () => computeAlleleFrequencies(pop, focusGeneId),
    [pop, focusGeneId],
  )
  const splitFreqs = useMemo(
    () => (splitPop ? computeAlleleFrequencies(splitPop, focusGeneId) : null),
    [splitPop, focusGeneId],
  )

  if (!gene) return null

  const forceLabel = force ? force.replace(/-/g, ' ') : 'drift (baseline)'

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-stone-50 border border-stone-300 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-wide text-stone-500">
            Population · generation {generation} · force:{' '}
            <span className="text-stone-700 font-semibold">{forceLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={advance}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 shadow-sm"
            >
              ▶ Advance one generation
            </motion.button>
            <button
              onClick={reset}
              className="px-2 py-1 rounded text-xs text-stone-500 hover:text-stone-800"
            >
              reset
            </button>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {pop.map(c => (
            <div key={c.id} className="flex justify-center">
              <BlobRenderer creature={c} species={blobSpecies} size={40} />
            </div>
          ))}
        </div>
        {splitPop && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-3 mb-1">
              Isolated sister population
            </div>
            <div className="grid grid-cols-8 gap-1 opacity-80">
              {splitPop.map(c => (
                <div key={c.id} className="flex justify-center">
                  <BlobRenderer creature={c} species={blobSpecies} size={40} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-lg bg-white border border-stone-300 p-3">
        <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
          Allele frequencies · {gene.name}
        </div>
        <FrequencyBars freqs={freqs} />
        {splitFreqs && (
          <>
            <div className="text-[10px] uppercase tracking-wide text-stone-400 mt-2 mb-1">
              Sister population
            </div>
            <FrequencyBars freqs={splitFreqs} />
          </>
        )}
        <div className="text-[10px] text-stone-500 italic mt-2">
          Under Hardy-Weinberg assumptions frequencies stay constant. Any
          deviation you see is the current force ({forceLabel}) at work.
        </div>
      </div>
    </div>
  )
}

function FrequencyBars({ freqs }: { freqs: Record<string, number> }) {
  return (
    <div className="space-y-1">
      {Object.entries(freqs).map(([symbol, freq]) => (
        <div key={symbol} className="flex items-center gap-2">
          <div className="text-xs font-mono w-6 text-stone-700">{symbol}</div>
          <div className="flex-1 h-4 bg-stone-100 rounded overflow-hidden">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${freq * 100}%` }}
            />
          </div>
          <div className="text-xs font-mono w-12 text-right text-stone-700">
            {(freq * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  )
}

function seedPopulation(
  species: Species,
  focusGeneId: string,
  dominantFreq: number,
  size: number,
): Creature[] {
  const gene = species.genes.find(g => g.id === focusGeneId)
  if (!gene) return []
  const dominant = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]
  const recessive = [...gene.alleles].sort(
    (a, b) => a.dominanceRank - b.dominanceRank,
  )[0]
  if (!dominant || !recessive) return []
  const rng = makeRandom()
  const pop: Creature[] = []
  for (let i = 0; i < size; i++) {
    const a1 = rng.next() < dominantFreq ? dominant.id : recessive.id
    const a2 = rng.next() < dominantFreq ? dominant.id : recessive.id
    const genotype: Record<string, string[]> = { [focusGeneId]: [a1, a2] }
    for (const g of species.genes) {
      if (g.id === focusGeneId) continue
      const rec = [...g.alleles].sort(
        (a, b) => a.dominanceRank - b.dominanceRank,
      )[0]
      if (rec) genotype[g.id] = [rec.id, rec.id]
    }
    pop.push({
      id: `pop-${i}-${rng.next().toString(36).slice(2, 8)}`,
      speciesId: species.id,
      sex: rng.bool() ? 'F' : 'M',
      genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  return pop
}

function sampleWithoutReplacement(
  pop: Creature[],
  n: number,
  rng: Random,
): Creature[] {
  const copy = [...pop]
  const out: Creature[] = []
  while (out.length < n && copy.length > 0) {
    const idx = rng.int(copy.length)
    out.push(copy.splice(idx, 1)[0]!)
  }
  return out
}

// Pair females and males at random. Each pair produces one offspring; loop
// until targetSize offspring are ready (allowing reuse).
function randomMatingGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
  targetSize: number,
): Creature[] {
  const females = pop.filter(c => c.sex === 'F')
  const males = pop.filter(c => c.sex === 'M')
  if (females.length === 0 || males.length === 0) return pop
  const next: Creature[] = []
  while (next.length < targetSize) {
    const mom = females[rng.int(females.length)]!
    const dad = males[rng.int(males.length)]!
    const child = cross(mom, dad, species, rng, { litterSize: 1 })[0]
    if (!child) continue
    next.push({
      id: `pop-${Date.now().toString(36)}-${next.length}-${rng.next().toString(36).slice(2, 6)}`,
      speciesId: species.id,
      sex: child.sex,
      genotype: child.genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  return next
}

// Selection: dominant-phenotype (or heterozygote) individuals reproduce 2× as
// often. We approximate this by biasing the parent-picker.
function selectionGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
  focusGeneId: string,
  favor: 'dominant' | 'heterozygote',
): Creature[] {
  const gene = species.genes.find(g => g.id === focusGeneId)
  if (!gene) return pop
  const dominantId = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]?.id
  const scored = pop.map(c => {
    const alleles = c.genotype[focusGeneId] ?? []
    const dominantCount = alleles.filter(a => a === dominantId).length
    const isHomoDominant = dominantCount === 2
    const isHetero = dominantCount === 1
    const weight =
      favor === 'dominant'
        ? isHomoDominant || isHetero
          ? 2
          : 1
        : isHetero
          ? 2
          : 1
    return { creature: c, weight }
  })
  const pickWeighted = (sexFilter: 'F' | 'M') => {
    const eligible = scored.filter(s => s.creature.sex === sexFilter)
    const total = eligible.reduce((s, e) => s + e.weight, 0)
    if (total <= 0) return null
    let roll = rng.next() * total
    for (const e of eligible) {
      roll -= e.weight
      if (roll <= 0) return e.creature
    }
    return eligible[eligible.length - 1]!.creature
  }
  const next: Creature[] = []
  while (next.length < pop.length) {
    const mom = pickWeighted('F')
    const dad = pickWeighted('M')
    if (!mom || !dad) return pop
    const child = cross(mom, dad, species, rng, { litterSize: 1 })[0]
    if (!child) continue
    next.push({
      id: `pop-${Date.now().toString(36)}-${next.length}-${rng.next().toString(36).slice(2, 6)}`,
      speciesId: species.id,
      sex: child.sex,
      genotype: child.genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  return next
}

// Migration: ~10% of the offspring are immigrants sampled at the source freq.
function migrationGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
  focusGeneId: string,
  sourceDominantFreq: number,
): Creature[] {
  const next = randomMatingGeneration(pop, species, rng, pop.length)
  const migrantCount = Math.max(1, Math.floor(pop.length * 0.1))
  const migrants = seedPopulation(species, focusGeneId, sourceDominantFreq, migrantCount)
  const combined = [...next.slice(0, next.length - migrantCount), ...migrants]
  return combined
}

// Assortative mating: pair females with males sharing the SAME dominant-allele
// count for the focus gene, whenever possible.
function assortativeMatingGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
  focusGeneId: string,
): Creature[] {
  const gene = species.genes.find(g => g.id === focusGeneId)
  if (!gene) return pop
  const dominantId = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]?.id
  const bucketOf = (c: Creature) =>
    (c.genotype[focusGeneId] ?? []).filter(a => a === dominantId).length
  const females = pop.filter(c => c.sex === 'F')
  const males = pop.filter(c => c.sex === 'M')
  const next: Creature[] = []
  while (next.length < pop.length) {
    const mom = females[rng.int(females.length)]
    if (!mom) return pop
    const wanted = bucketOf(mom)
    const matching = males.filter(m => bucketOf(m) === wanted)
    const pool = matching.length > 0 ? matching : males
    const dad = pool[rng.int(pool.length)]!
    const child = cross(mom, dad, species, rng, { litterSize: 1 })[0]
    if (!child) continue
    next.push({
      id: `pop-${Date.now().toString(36)}-${next.length}-${rng.next().toString(36).slice(2, 6)}`,
      speciesId: species.id,
      sex: child.sex,
      genotype: child.genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  return next
}

// Inbreeding: sort by index, pair nearest opposite-sex neighbors.
function inbreedingGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
): Creature[] {
  const next: Creature[] = []
  const females = pop.filter(c => c.sex === 'F')
  const males = pop.filter(c => c.sex === 'M')
  const pairs = Math.min(females.length, males.length)
  while (next.length < pop.length) {
    const idx = next.length % pairs
    const mom = females[idx]!
    const dad = males[idx]!
    const child = cross(mom, dad, species, rng, { litterSize: 1 })[0]
    if (!child) continue
    next.push({
      id: `pop-${Date.now().toString(36)}-${next.length}-${rng.next().toString(36).slice(2, 6)}`,
      speciesId: species.id,
      sex: child.sex,
      genotype: child.genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  return next
}

// Hybrid vigor: heterozygous offspring survive 2×, homozygous offspring
// survive 0.5×. Reject a fraction of the homozygous offspring each gen.
function hybridVigorGeneration(
  pop: Creature[],
  species: Species,
  rng: Random,
  focusGeneId: string,
): Creature[] {
  const gene = species.genes.find(g => g.id === focusGeneId)
  if (!gene) return pop
  const dominantId = [...gene.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]?.id
  const next: Creature[] = []
  const attempts = pop.length * 4
  const females = pop.filter(c => c.sex === 'F')
  const males = pop.filter(c => c.sex === 'M')
  for (let i = 0; i < attempts && next.length < pop.length; i++) {
    const mom = females[rng.int(females.length)]!
    const dad = males[rng.int(males.length)]!
    const child = cross(mom, dad, species, rng, { litterSize: 1 })[0]
    if (!child) continue
    const alleles = child.genotype[focusGeneId] ?? []
    const dominantCount = alleles.filter(a => a === dominantId).length
    const isHetero = dominantCount === 1
    const survivalProb = isHetero ? 1 : 0.5
    if (rng.next() > survivalProb) continue
    next.push({
      id: `pop-${Date.now().toString(36)}-${next.length}-${rng.next().toString(36).slice(2, 6)}`,
      speciesId: species.id,
      sex: child.sex,
      genotype: child.genotype,
      age: 1,
      scope: 'trophy',
    })
  }
  if (next.length === 0) return pop
  return next
}

function computeAlleleFrequencies(
  pop: Creature[],
  focusGeneId: string,
): Record<string, number> {
  const gene = blobSpecies.genes.find(g => g.id === focusGeneId)
  const counts: Record<string, number> = {}
  for (const c of pop) {
    const alleles = c.genotype[focusGeneId] ?? []
    for (const alleleId of alleles) {
      const symbol =
        gene?.alleles.find(a => a.id === alleleId)?.symbol ?? alleleId
      counts[symbol] = (counts[symbol] ?? 0) + 1
    }
  }
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
  const freqs: Record<string, number> = {}
  for (const [symbol, count] of Object.entries(counts)) {
    freqs[symbol] = count / total
  }
  return freqs
}

void computePhenotype
