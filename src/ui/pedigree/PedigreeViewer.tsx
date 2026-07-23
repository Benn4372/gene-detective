import { useMemo } from 'react'

export interface PedigreeNode {
  id: string
  parents?: [string, string]
  sex: 'M' | 'F'
  affected: boolean
  note?: string
}

interface Props {
  nodes: PedigreeNode[]
  // Player-typed genotypes per node.
  hypotheses?: Record<string, string>
  onHypothesisChange?(nodeId: string, next: string): void
  // Correct genotypes (used to color-mark confirmed nodes).
  correctGenotypes?: Record<string, string>
}

// A very compact pedigree renderer. Nodes are laid out by "generation" —
// derived from parent chains — with couples grouped horizontally.
export function PedigreeViewer({
  nodes,
  hypotheses,
  onHypothesisChange,
  correctGenotypes,
}: Props) {
  const generations = useMemo(() => layoutByGeneration(nodes), [nodes])

  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">
        Family pedigree
      </div>
      <div className="space-y-6">
        {generations.map((generation, gi) => (
          <div key={gi} className="flex gap-4 justify-center flex-wrap">
            {generation.map(n => {
              const val = hypotheses?.[n.id] ?? ''
              const correct = correctGenotypes?.[n.id]
              const isCorrect =
                correct !== undefined &&
                normalize(val) === normalize(correct) &&
                val.length > 0
              return (
                <div
                  key={n.id}
                  className={
                    'flex flex-col items-center rounded-lg border-2 p-2 ' +
                    (n.affected
                      ? 'bg-stone-800 text-white border-stone-900'
                      : 'bg-white text-stone-800 border-stone-400')
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center text-xl">
                    {n.sex === 'F' ? '⚪' : '⬛'}
                  </div>
                  <div className="text-[10px] font-mono">{n.id}</div>
                  {n.note && (
                    <div className="text-[9px] italic opacity-80 max-w-[120px] text-center">
                      {n.note}
                    </div>
                  )}
                  {onHypothesisChange && (
                    <input
                      type="text"
                      value={val}
                      onChange={e => onHypothesisChange(n.id, e.target.value)}
                      placeholder="?"
                      maxLength={4}
                      className={
                        'mt-1 w-16 text-center font-mono text-xs border rounded ' +
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
        ⬛ affected males · ⬜ unaffected males · ⚫ affected females · ⚪ unaffected females
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
