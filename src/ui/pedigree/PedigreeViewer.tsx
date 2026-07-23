import { useMemo } from 'react'
import { blobSpecies } from '../../content'
import type { Creature, Gene } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { SexBadge } from '../atoms/SexBadge'

export interface PedigreeNode {
  id: string
  parents?: [string, string]
  sex: 'M' | 'F'
  affected: boolean
  note?: string
}

interface Props {
  nodes: PedigreeNode[]
  focusGeneId: string
  hypotheses?: Record<string, string>
  onHypothesisChange?(nodeId: string, next: string): void
  correctGenotypes?: Record<string, string>
}

const CARD_W = 108
const CARD_H = 130
const H_GAP = 24
const COUPLE_GAP = 14
const V_GAP = 60
const PAD = 16

export function PedigreeViewer({
  nodes,
  focusGeneId,
  hypotheses,
  onHypothesisChange,
  correctGenotypes,
}: Props) {
  const focusGene = useMemo(
    () => blobSpecies.genes.find(g => g.id === focusGeneId),
    [focusGeneId],
  )
  const layout = useMemo(() => layoutFamilyTree(nodes), [nodes])

  const buildCreature = (n: PedigreeNode): Creature | null => {
    if (!focusGene) return null
    const genotypeStr = correctGenotypes?.[n.id]
    if (!genotypeStr) return null
    const alleleIds: string[] = []
    for (const sym of genotypeStr) {
      const allele = focusGene.alleles.find(a => a.symbol === sym)
      if (allele) alleleIds.push(allele.id)
    }
    if (alleleIds.length === 0) return null
    return {
      id: `pedigree-${n.id}`,
      speciesId: blobSpecies.id,
      sex: n.sex,
      genotype: { [focusGeneId]: alleleIds },
      age: 1,
      scope: 'trophy',
    }
  }

  const width = layout.width + PAD * 2
  const height = layout.height + PAD * 2
  const affectedSymbol = focusGene ? dominantSymbol(focusGene) : '?'

  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Family pedigree
        </div>
        {focusGene && (
          <div className="text-[10px] uppercase tracking-wide text-stone-500">
            {focusGene.name} · amber = shows the trait
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width, height, minWidth: width }}
        >
          <svg
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Marriage bars — solid horizontal between two spouses. */}
            {layout.marriages.map(m => (
              <line
                key={`m-${m.aId}-${m.bId}`}
                x1={m.x1 + PAD}
                y1={m.y + PAD}
                x2={m.x2 + PAD}
                y2={m.y + PAD}
                stroke="#57534e"
                strokeWidth={2}
              />
            ))}
            {/* Sibship drop lines — from marriage midpoint down to the
                horizontal beam above the children. */}
            {layout.sibshipDrops.map((d, i) => (
              <line
                key={`sd-${i}`}
                x1={d.x + PAD}
                y1={d.y1 + PAD}
                x2={d.x + PAD}
                y2={d.y2 + PAD}
                stroke="#57534e"
                strokeWidth={2}
              />
            ))}
            {/* Sibship beams — the horizontal spanning above the sibling row. */}
            {layout.sibshipBeams.map((b, i) => (
              <line
                key={`sb-${i}`}
                x1={b.x1 + PAD}
                y1={b.y + PAD}
                x2={b.x2 + PAD}
                y2={b.y + PAD}
                stroke="#57534e"
                strokeWidth={2}
              />
            ))}
            {/* Child drops — from the beam down to each child card. */}
            {layout.childDrops.map((d, i) => (
              <line
                key={`cd-${i}`}
                x1={d.x + PAD}
                y1={d.y1 + PAD}
                x2={d.x + PAD}
                y2={d.y2 + PAD}
                stroke="#57534e"
                strokeWidth={2}
              />
            ))}
          </svg>

          {layout.positioned.map(({ node, x, y }) => {
            const val = hypotheses?.[node.id] ?? ''
            const correct = correctGenotypes?.[node.id]
            const isCorrect =
              correct !== undefined &&
              normalize(val) === normalize(correct) &&
              val.length > 0
            const creature = buildCreature(node)
            return (
              <div
                key={node.id}
                className={
                  'absolute flex flex-col items-center rounded-lg border-2 p-2 ' +
                  (isCorrect
                    ? 'bg-emerald-50 border-emerald-400'
                    : node.affected
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-stone-300')
                }
                style={{
                  left: x + PAD,
                  top: y + PAD,
                  width: CARD_W,
                  height: CARD_H,
                }}
              >
                {creature ? (
                  <BlobRenderer
                    creature={creature}
                    species={blobSpecies}
                    size={52}
                  />
                ) : (
                  <div className="w-13 h-13 flex items-center justify-center text-3xl text-stone-400">
                    {node.sex === 'F' ? '⚪' : '⬛'}
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-700">
                  <SexBadge sex={node.sex} />
                  <span className="font-mono">{node.id}</span>
                </div>
                {node.note && (
                  <div className="text-[9px] italic text-stone-600 max-w-[100px] text-center leading-tight">
                    {node.note}
                  </div>
                )}
                {onHypothesisChange && (
                  <input
                    type="text"
                    value={val}
                    onChange={e => onHypothesisChange(node.id, e.target.value)}
                    placeholder="genotype?"
                    maxLength={4}
                    className={
                      'mt-auto w-20 text-center font-mono text-xs border-2 rounded px-1 py-0.5 ' +
                      (isCorrect
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : 'border-stone-300 bg-white text-stone-800')
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="text-[10px] italic text-stone-500 mt-3">
        Amber = shows the trait ({affectedSymbol}) · Green = your genotype matches ·
        Horizontal bar = marriage · Vertical drop = descent · Sibship beam joins siblings.
      </div>
    </div>
  )
}

function dominantSymbol(gene: Gene): string {
  const sorted = [...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank)
  return sorted[0]?.symbol ?? '?'
}

function normalize(g: string): string {
  return g.split('').sort().join('')
}

interface Positioned {
  node: PedigreeNode
  x: number
  y: number
}

interface Marriage {
  aId: string
  bId: string
  x1: number
  x2: number
  y: number
}

interface Layout {
  positioned: Positioned[]
  marriages: Marriage[]
  sibshipDrops: { x: number; y1: number; y2: number }[]
  sibshipBeams: { x1: number; x2: number; y: number }[]
  childDrops: { x: number; y1: number; y2: number }[]
  width: number
  height: number
}

// Layout algorithm:
// 1. Assign a generation number to each node. A node with parents lives one
//    generation below its parents. A node with NO parents (a founder) that
//    marries into the family (i.e. shares a child with a non-founder) is
//    placed at the SAME generation as their spouse. Pure founders default
//    to generation 0.
// 2. Group each generation into ordered "units": a marriage pair, or a
//    single unpaired node. Marriage pairs get adjacent placement (COUPLE_GAP
//    between them + a full H_GAP after the pair as a whole).
// 3. Under each marriage, centre its children below the midpoint of the pair.
// 4. Draw marriage bars, sibship drops, sibship beams, child drops.
function layoutFamilyTree(nodes: PedigreeNode[]): Layout {
  const byId = new Map(nodes.map(n => [n.id, n]))

  // -- Step 1: generations. Founders start at 0, children propagate down.
  const gen = new Map<string, number>()
  const computeParentGen = (id: string): number => {
    if (gen.has(id)) return gen.get(id)!
    const node = byId.get(id)
    if (!node) return 0
    if (!node.parents) {
      // Provisional: pure founder starts at 0. Marriage adjustment happens
      // in the next pass.
      gen.set(id, 0)
      return 0
    }
    const [pa, pb] = node.parents
    const g = Math.max(computeParentGen(pa), computeParentGen(pb)) + 1
    gen.set(id, g)
    return g
  }
  for (const n of nodes) computeParentGen(n.id)

  // -- Marriage detection: any two nodes who share at least one child in the
  // node list are "married" for pedigree purposes.
  const marriageSet = new Set<string>()
  const marriedPairs: Array<[string, string]> = []
  const spouseOf = new Map<string, string>()
  for (const child of nodes) {
    if (!child.parents) continue
    const [a, b] = child.parents
    if (!byId.has(a) || !byId.has(b)) continue
    const key = [a, b].sort().join('|')
    if (marriageSet.has(key)) continue
    marriageSet.add(key)
    marriedPairs.push([a, b])
    spouseOf.set(a, b)
    spouseOf.set(b, a)
  }

  // -- Step 1b: lift founder spouses to their partner's generation. A founder
  // who married someone with a computed generation should sit at that same
  // generation, not stuck at 0. Iterate until stable so a chain of marriages
  // resolves cleanly.
  let changed = true
  while (changed) {
    changed = false
    for (const [a, b] of marriedPairs) {
      const nodeA = byId.get(a)!
      const nodeB = byId.get(b)!
      const ga = gen.get(a) ?? 0
      const gb = gen.get(b) ?? 0
      if (!nodeA.parents && nodeB.parents && ga !== gb) {
        gen.set(a, gb)
        changed = true
      } else if (!nodeB.parents && nodeA.parents && ga !== gb) {
        gen.set(b, ga)
        changed = true
      } else if (!nodeA.parents && !nodeB.parents && ga !== gb) {
        // Both founders — pull the lower up to the higher (unlikely to matter).
        const target = Math.max(ga, gb)
        if (ga !== target) { gen.set(a, target); changed = true }
        if (gb !== target) { gen.set(b, target); changed = true }
      }
    }
  }

  // -- Step 2: bucket nodes per generation and order into "units".
  const genBuckets = new Map<number, PedigreeNode[]>()
  for (const n of nodes) {
    const g = gen.get(n.id)!
    if (!genBuckets.has(g)) genBuckets.set(g, [])
    genBuckets.get(g)!.push(n)
  }
  const generationsSorted = [...genBuckets.keys()].sort((a, b) => a - b)

  const positioned: Positioned[] = []
  const marriages: Marriage[] = []
  const positionById = new Map<string, Positioned>()
  let maxWidth = 0

  for (const gIdx of generationsSorted) {
    const genNodes = genBuckets.get(gIdx) ?? []
    const y = gIdx * (CARD_H + V_GAP)

    // Build ordered units: married-couples first, then singletons.
    const seen = new Set<string>()
    const units: Array<{ ids: string[]; isCouple: boolean }> = []
    for (const n of genNodes) {
      if (seen.has(n.id)) continue
      const spouseId = spouseOf.get(n.id)
      if (spouseId && !seen.has(spouseId) && genBuckets.get(gIdx)!.some(x => x.id === spouseId)) {
        units.push({ ids: [n.id, spouseId], isCouple: true })
        seen.add(n.id)
        seen.add(spouseId)
      } else {
        units.push({ ids: [n.id], isCouple: false })
        seen.add(n.id)
      }
    }

    // Place units left-to-right.
    let cursor = 0
    for (const unit of units) {
      if (unit.isCouple) {
        const [aId, bId] = unit.ids
        const nodeA = byId.get(aId!)!
        const nodeB = byId.get(bId!)!
        const aX = cursor
        const bX = cursor + CARD_W + COUPLE_GAP
        const pa = { node: nodeA, x: aX, y }
        const pb = { node: nodeB, x: bX, y }
        positioned.push(pa, pb)
        positionById.set(aId!, pa)
        positionById.set(bId!, pb)
        marriages.push({
          aId: aId!,
          bId: bId!,
          x1: aX + CARD_W,
          x2: bX,
          y: y + CARD_H / 2,
        })
        cursor = bX + CARD_W + H_GAP
      } else {
        const nodeA = byId.get(unit.ids[0]!)!
        const p = { node: nodeA, x: cursor, y }
        positioned.push(p)
        positionById.set(unit.ids[0]!, p)
        cursor = cursor + CARD_W + H_GAP
      }
    }
    maxWidth = Math.max(maxWidth, cursor - H_GAP)
  }

  // -- Step 3: sibship lines. For each marriage, find its children and draw
  // the drop + beam + per-child drops.
  const sibshipDrops: Layout['sibshipDrops'] = []
  const sibshipBeams: Layout['sibshipBeams'] = []
  const childDrops: Layout['childDrops'] = []

  for (const m of marriages) {
    const midX = (m.x1 + m.x2) / 2
    const kids = nodes.filter(
      n => n.parents &&
        ((n.parents[0] === m.aId && n.parents[1] === m.bId) ||
          (n.parents[0] === m.bId && n.parents[1] === m.aId)),
    )
    if (kids.length === 0) continue
    const kidPos = kids.map(k => positionById.get(k.id)!).filter(Boolean)
    if (kidPos.length === 0) continue

    const beamY = kidPos[0]!.y - V_GAP / 2
    const kidCentres = kidPos.map(p => p.x + CARD_W / 2)

    sibshipDrops.push({ x: midX, y1: m.y, y2: beamY })
    sibshipBeams.push({
      x1: Math.min(midX, ...kidCentres),
      x2: Math.max(midX, ...kidCentres),
      y: beamY,
    })
    for (const kp of kidPos) {
      childDrops.push({ x: kp.x + CARD_W / 2, y1: beamY, y2: kp.y })
    }
  }

  const height = generationsSorted.length * (CARD_H + V_GAP) - V_GAP

  return {
    positioned,
    marriages,
    sibshipDrops,
    sibshipBeams,
    childDrops,
    width: maxWidth,
    height,
  }
}
