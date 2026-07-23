import { useMemo } from 'react'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
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

// A compact pedigree renderer. Each node draws an actual blob SVG for the
// tracked gene so the player can SEE the phenotype (spots, tail, whatever)
// instead of reading "affected / unaffected" bureaucrat-speak. Nodes stack
// by generation, derived from the parent chains.
export function PedigreeViewer({
  nodes,
  focusGeneId,
  hypotheses,
  onHypothesisChange,
  correctGenotypes,
}: Props) {
  const generations = useMemo(() => layoutByGeneration(nodes), [nodes])
  const focusGene = useMemo(
    () => blobSpecies.genes.find(g => g.id === focusGeneId),
    [focusGeneId],
  )

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

  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">
        Family pedigree
      </div>
      <div className="space-y-8">
        {generations.map((generation, gi) => (
          <div key={gi} className="flex gap-4 justify-center flex-wrap">
            {generation.map(n => {
              const val = hypotheses?.[n.id] ?? ''
              const correct = correctGenotypes?.[n.id]
              const isCorrect =
                correct !== undefined &&
                normalize(val) === normalize(correct) &&
                val.length > 0
              const creature = buildCreature(n)
              return (
                <div
                  key={n.id}
                  className={
                    'flex flex-col items-center rounded-lg border-2 p-3 min-w-[110px] ' +
                    (isCorrect
                      ? 'bg-emerald-50 border-emerald-400'
                      : n.affected
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-white border-stone-300')
                  }
                >
                  {creature ? (
                    <BlobRenderer
                      creature={creature}
                      species={blobSpecies}
                      size={56}
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center text-3xl text-stone-400">
                      {n.sex === 'F' ? '⚪' : '⬛'}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-700">
                    <SexBadge sex={n.sex} />
                    <span className="font-mono">{n.id}</span>
                  </div>
                  {n.note && (
                    <div className="text-[9px] italic text-stone-600 max-w-[110px] text-center mt-0.5">
                      {n.note}
                    </div>
                  )}
                  {n.affected && (
                    <div className="text-[9px] font-semibold text-amber-800 mt-1">
                      shows recessive
                    </div>
                  )}
                  {onHypothesisChange && (
                    <input
                      type="text"
                      value={val}
                      onChange={e => onHypothesisChange(n.id, e.target.value)}
                      placeholder="genotype?"
                      maxLength={4}
                      className={
                        'mt-2 w-20 text-center font-mono text-xs border-2 rounded px-1 py-0.5 ' +
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
        ))}
      </div>
      <div className="text-[10px] italic text-stone-500 mt-3">
        Amber = shows the recessive phenotype · Green = your genotype matches
      </div>
    </div>
  )
}

function normalize(g: string): string {
  return g.split('').sort().join('')
}

// Assign generation numbers based on parent chains. Nodes without parents
// live in gen 0. Anyone whose parent is in gen G lives in gen G+1.
function layoutByGeneration(nodes: PedigreeNode[]): PedigreeNode[][] {
  const gen: Record<string, number> = {}
  const byId = new Map(nodes.map(n => [n.id, n]))
  const compute = (id: string): number => {
    if (gen[id] !== undefined) return gen[id]!
    const node = byId.get(id)
    if (!node?.parents) {
      gen[id] = 0
      return 0
    }
    const [a, b] = node.parents
    const g = Math.max(compute(a), compute(b)) + 1
    gen[id] = g
    return g
  }
  for (const n of nodes) compute(n.id)
  const groups: PedigreeNode[][] = []
  for (const n of nodes) {
    const g = gen[n.id]!
    if (!groups[g]) groups[g] = []
    groups[g]!.push(n)
  }
  return groups.map(g => g ?? [])
}
