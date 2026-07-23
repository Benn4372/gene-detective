import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { computePhenotype } from '../../engine/phenotype'
import { computePunnett } from '../../engine/punnett'

interface Props {
  motherId: string
  fatherId: string
  geneIds: string[]
}

// Distribution-chart Punnett variant.
//
// When three or more genes are tracked, a full 8×8 (or larger) grid becomes
// visually overwhelming. Instead we render a bar chart of expected phenotype
// combination frequencies, computed from the notebook hypotheses (falling
// back to the parents' true genotypes when the notebook is empty).
export function PunnettDistribution({ motherId, fatherId, geneIds }: Props) {
  // Notebook guesses feed the distribution (not the Final Answer's hypotheses),
  // matching every other passive Punnett component.
  const notebookGuess = useGameStore(s => s.notebookGuess)
  const creatures = useGameStore(s => s.creatures)

  const mother = creatures[motherId]
  const father = creatures[fatherId]

  const [motherPreview, fatherPreview, usingNotebook] = useMemo(() => {
    if (!mother || !father) return [null, null, false]
    return buildPreviews(mother, father, notebookGuess, geneIds)
  }, [mother, father, notebookGuess, geneIds])

  const rows = useMemo(() => {
    if (!motherPreview || !fatherPreview) return []
    const punnett = computePunnett(motherPreview, fatherPreview, blobSpecies)
    // Bucket outcomes by joint phenotype across tracked genes.
    const buckets = new Map<string, { label: string; probability: number }>()
    for (const outcome of punnett) {
      const child: Creature = {
        id: 'punnett-outcome',
        speciesId: blobSpecies.id,
        sex: 'F',
        genotype: outcome.genotype,
        age: 0,
        scope: 'trophy',
      }
      const phen = computePhenotype(child, blobSpecies)
      // Dedupe by trait id — polygenic Size (Ⅰ/Ⅱ/Ⅲ) all express the same
      // 'size' trait, so they'd otherwise emit three copies of the same
      // aggregated phenotype value.
      const seenTraits = new Set<string>()
      const traitLabels: string[] = []
      for (const id of geneIds) {
        const gene = blobSpecies.genes.find(g => g.id === id)
        const traitId = gene?.expressesTraits[0]
        if (!traitId || seenTraits.has(traitId)) continue
        seenTraits.add(traitId)
        const trait = blobSpecies.traits.find(t => t.id === traitId)
        const value = phen[traitId] ?? '?'
        traitLabels.push(`${trait?.name ?? gene?.name ?? id}: ${value}`)
      }
      const label = traitLabels.join(' · ')
      const existing = buckets.get(label)
      if (existing) existing.probability += outcome.probability
      else buckets.set(label, { label, probability: outcome.probability })
    }
    return [...buckets.values()].sort(
      (a, b) => b.probability - a.probability,
    )
  }, [motherPreview, fatherPreview, geneIds])

  if (!mother || !father || rows.length === 0) return null

  const maxProb = rows[0]!.probability

  return (
    <div className="inline-block max-w-full">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Predicted distribution · {geneIds.length} genes
        </div>
        <div className="text-[10px] text-stone-500 italic">
          {usingNotebook
            ? 'from your notebook hypotheses'
            : 'notebook incomplete — showing true expected'}
        </div>
      </div>
      <div className="rounded-lg bg-white border border-stone-300 p-3 space-y-1 min-w-[320px]">
        {rows.map(row => {
          const pct = row.probability * 100
          const barPct = (row.probability / maxProb) * 100
          return (
            <div key={row.label} className="flex items-center gap-2">
              <div className="text-[11px] font-mono text-stone-700 w-56 truncate">
                {row.label}
              </div>
              <div className="flex-1 h-4 bg-stone-100 rounded overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-stone-600 w-14 text-right">
                {pct.toFixed(1)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Build a synthetic mother/father from the notebook hypotheses, so the chart
// reflects the player's model. Returns [motherPreview, fatherPreview, usingNotebook].
function buildPreviews(
  mother: Creature,
  father: Creature,
  notebookGuess: Record<string, Record<string, string>>,
  geneIds: string[],
): [Creature, Creature, boolean] {
  let usingNotebook = true
  const build = (parent: Creature): Creature => {
    const genotype: Record<string, string[]> = { ...parent.genotype }
    for (const geneId of geneIds) {
      const gene = blobSpecies.genes.find(g => g.id === geneId)
      if (!gene) continue
      const raw = notebookGuess[parent.id]?.[geneId] ?? ''
      if (raw.length < 2) {
        usingNotebook = false
        continue
      }
      const alleleIds: string[] = []
      for (const ch of raw.slice(0, 2)) {
        const found = gene.alleles.find(a => a.symbol === ch)
        if (found) alleleIds.push(found.id)
      }
      if (alleleIds.length === 2) genotype[geneId] = alleleIds
      else usingNotebook = false
    }
    return { ...parent, genotype }
  }
  return [build(mother), build(father), usingNotebook]
}
