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
  // Gene the pedigree is about — used to render each node as a proper blob
  // showing the phenotype for that gene.
  focusGeneId: string
  // Player-typed genotypes per node.
  hypotheses?: Record<string, string>
  onHypothesisChange?(nodeId: string, next: string): void
  // Correct genotypes (used to render each node's actual phenotype and to
  // color-mark confirmed nodes).
  correctGenotypes?: Record<string, string>
}

// Layout constants — one SVG-space unit is one pixel of the rendered pedigree.
const CARD_W = 108
const CARD_H = 128
const HORIZ_GAP = 20
const GEN_GAP = 56 // vertical gap between generations
const PAD = 12

// A pedigree renderer that draws an actual family tree — pair (marriage)
// lines between mated parents, a single sibship line running down to a
// horizontal beam, and vertical drops from that beam to each child's card.
// Each node draws a blob SVG showing the phenotype for the tracked gene.
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
  const layout = useMemo(() => layoutTree(nodes), [nodes])

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

  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Family pedigree
        </div>
        {focusGene && (
          <div className="text-[10px] uppercase tracking-wide text-stone-500">
            {focusGene.name} · {phenotypeLabelForBadge(focusGene, true)} = affected
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width, height, minWidth: width }}
        >
          {/* Family-tree lines (SVG behind cards) */}
          <svg
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
          >
            {layout.matings.map(m => (
              <line
                key={`mate-${m.parentA}-${m.parentB}`}
                x1={m.aX + PAD}
                y1={m.y + PAD}
                x2={m.bX + PAD}
                y2={m.y + PAD}
                stroke="#78716c"
                strokeWidth={2}
              />
            ))}
            {layout.sibshipDrops.map((d, i) => (
              <line
                key={`sibdrop-${i}`}
                x1={d.x + PAD}
                y1={d.y1 + PAD}
                x2={d.x + PAD}
                y2={d.y2 + PAD}
                stroke="#78716c"
                strokeWidth={2}
              />
            ))}
            {layout.sibshipBeams.map((b, i) => (
              <line
                key={`sibbeam-${i}`}
                x1={b.x1 + PAD}
                y1={b.y + PAD}
                x2={b.x2 + PAD}
                y2={b.y + PAD}
                stroke="#78716c"
                strokeWidth={2}
              />
            ))}
            {layout.childDrops.map((d, i) => (
              <line
                key={`kid-${i}`}
                x1={d.x + PAD}
                y1={d.y1 + PAD}
                x2={d.x + PAD}
                y2={d.y2 + PAD}
                stroke="#78716c"
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
        Amber = shows the trait · Green = your genotype matches · Horizontal line = mated pair · Vertical drop = child of that pair
      </div>
    </div>
  )
}

// Render the "affected" label using the gene's dominance model. For a
// simple-dominant gene, the affected/target phenotype is the dominant symbol;
// for a recessive-tracking pedigree the caller passes a different mapping.
// This lightweight fallback shows the dominant symbol.
function phenotypeLabelForBadge(gene: Gene, _dominantAffected: boolean): string {
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

interface Layout {
  positioned: Positioned[]
  matings: { parentA: string; parentB: string; aX: number; bX: number; y: number }[]
  sibshipDrops: { x: number; y1: number; y2: number }[]
  sibshipBeams: { x1: number; x2: number; y: number }[]
  childDrops: { x: number; y1: number; y2: number }[]
  width: number
  height: number
}

// Two-pass layout:
// 1. Assign each node a generation (max parent gen + 1).
// 2. Within each generation, place nodes L → R with mated pairs kept adjacent
//    and each child block sitting below its parent pair's midpoint.
function layoutTree(nodes: PedigreeNode[]): Layout {
  const gen: Record<string, number> = {}
  const byId = new Map(nodes.map(n => [n.id, n]))
  const computeGen = (id: string): number => {
    if (gen[id] !== undefined) return gen[id]!
    const node = byId.get(id)
    if (!node?.parents) {
      gen[id] = 0
      return 0
    }
    const [a, b] = node.parents
    const g = Math.max(computeGen(a), computeGen(b)) + 1
    gen[id] = g
    return g
  }
  for (const n of nodes) computeGen(n.id)

  const generations: PedigreeNode[][] = []
  for (const n of nodes) {
    const g = gen[n.id]!
    if (!generations[g]) generations[g] = []
    generations[g]!.push(n)
  }

  // Group nodes in each generation into "clusters" — a mated pair or a
  // sibling group — so we place them contiguously.
  const positioned: Positioned[] = []
  const matings: Layout['matings'] = []
  const sibshipDrops: Layout['sibshipDrops'] = []
  const sibshipBeams: Layout['sibshipBeams'] = []
  const childDrops: Layout['childDrops'] = []

  let maxWidth = 0

  for (let gi = 0; gi < generations.length; gi++) {
    const genNodes = generations[gi] ?? []
    // Split into mating clusters + solo nodes. A mating is any two nodes at
    // this generation who share at least one child in a later generation.
    const matedPairs: [PedigreeNode, PedigreeNode][] = []
    const alreadyMated = new Set<string>()
    for (const a of genNodes) {
      if (alreadyMated.has(a.id)) continue
      for (const b of genNodes) {
        if (a.id === b.id || alreadyMated.has(b.id)) continue
        const sharesChild = nodes.some(
          n => n.parents && n.parents.includes(a.id) && n.parents.includes(b.id),
        )
        if (sharesChild) {
          matedPairs.push([a, b])
          alreadyMated.add(a.id)
          alreadyMated.add(b.id)
          break
        }
      }
    }
    const solo = genNodes.filter(n => !alreadyMated.has(n.id))

    // Lay pairs first (side-by-side with mate line), then solos.
    let cursor = 0
    const y = gi * (CARD_H + GEN_GAP)

    for (const [a, b] of matedPairs) {
      const aX = cursor
      const bX = cursor + CARD_W + HORIZ_GAP
      positioned.push({ node: a, x: aX, y })
      positioned.push({ node: b, x: bX, y })
      matings.push({
        parentA: a.id,
        parentB: b.id,
        aX: aX + CARD_W,
        bX: bX,
        y: y + CARD_H / 2,
      })
      cursor = bX + CARD_W + HORIZ_GAP * 2
    }
    for (const n of solo) {
      positioned.push({ node: n, x: cursor, y })
      cursor = cursor + CARD_W + HORIZ_GAP * 2
    }
    maxWidth = Math.max(maxWidth, cursor - HORIZ_GAP * 2)
  }

  // Family-tree lines: for each mated pair, draw a sibship drop from the
  // mating midpoint down to a horizontal beam over their children, then
  // vertical drops from that beam to each child card.
  const posById = new Map(positioned.map(p => [p.node.id, p]))
  for (const m of matings) {
    const mate = matings.find(x => x.parentA === m.parentA && x.parentB === m.parentB)!
    const parentMidX = (mate.aX + mate.bX) / 2
    const parentA = posById.get(m.parentA)!
    const parentBottomY = parentA.y + CARD_H
    const kids = nodes.filter(
      n => n.parents && n.parents.includes(m.parentA) && n.parents.includes(m.parentB),
    )
    if (kids.length === 0) continue
    const kidPositions = kids.map(k => posById.get(k.id)!).filter(Boolean)
    if (kidPositions.length === 0) continue
    const kidCentresX = kidPositions.map(p => p.x + CARD_W / 2)
    const beamY = kidPositions[0]!.y - GEN_GAP / 2
    // Drop from parent midpoint to beam
    sibshipDrops.push({
      x: parentMidX,
      y1: parentBottomY,
      y2: beamY,
    })
    // Horizontal beam
    sibshipBeams.push({
      x1: Math.min(...kidCentresX, parentMidX),
      x2: Math.max(...kidCentresX, parentMidX),
      y: beamY,
    })
    // Drops from beam to each kid
    for (const kp of kidPositions) {
      childDrops.push({
        x: kp.x + CARD_W / 2,
        y1: beamY,
        y2: kp.y,
      })
    }
  }

  const height = generations.length * (CARD_H + GEN_GAP) - GEN_GAP

  return {
    positioned,
    matings,
    sibshipDrops,
    sibshipBeams,
    childDrops,
    width: maxWidth,
    height,
  }
}
