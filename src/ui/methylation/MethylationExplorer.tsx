import { useMemo, useState } from 'react'
import { blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import type { Creature } from '../../engine/types'
import { computePhenotype } from '../../engine/phenotype'

interface Props {
  focusGeneId: string
  motherGenotype: string[]
  fatherGenotype: string[]
}

// Small interactive widget: shows a mother, a father, and one representative
// offspring for the focus gene. The player toggles methylation on the mother
// and watches the offspring's phenotype flip. Demonstrates epigenetic
// inheritance without requiring a full simulation.
export function MethylationExplorer({
  focusGeneId,
  motherGenotype,
  fatherGenotype,
}: Props) {
  const [motherMethylated, setMotherMethylated] = useState(false)
  const gene = blobSpecies.genes.find(g => g.id === focusGeneId)

  const { mother, father, offspring } = useMemo(() => {
    const buildBlob = (
      sex: 'F' | 'M',
      genotypeForFocus: string[],
      methylated: boolean,
    ): Creature => {
      const genotype: Record<string, string[]> = { [focusGeneId]: genotypeForFocus }
      for (const g of blobSpecies.genes) {
        if (g.id === focusGeneId) continue
        const rec = [...g.alleles].sort((a, b) => a.dominanceRank - b.dominanceRank)[0]
        if (rec) genotype[g.id] = [rec.id, rec.id]
      }
      return {
        id: `meth-${sex}-${genotypeForFocus.join('')}-${methylated ? 'm' : 'u'}`,
        speciesId: blobSpecies.id,
        sex,
        genotype,
        age: 1,
        scope: 'trophy',
        methylatedGenes: methylated ? [focusGeneId] : undefined,
      }
    }
    const m = buildBlob('F', motherGenotype, motherMethylated)
    const f = buildBlob('M', fatherGenotype, false)
    // Offspring: inherit maternal methylation (per cross() logic).
    const child = buildBlob(
      'F',
      [motherGenotype[0]!, fatherGenotype[0]!],
      motherMethylated,
    )
    return { mother: m, father: f, offspring: child }
  }, [focusGeneId, motherGenotype, fatherGenotype, motherMethylated])

  if (!gene) return null
  const motherPhen = computePhenotype(mother, blobSpecies)[gene.expressesTraits[0]!]
  const offspringPhen = computePhenotype(offspring, blobSpecies)[gene.expressesTraits[0]!]

  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">
        Methylation demo · {gene.name}
      </div>
      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <BlobRenderer creature={mother} species={blobSpecies} size={90} />
          <div className="text-xs text-stone-500 mt-1">Mother ♀</div>
          <div className="text-[10px] font-mono text-stone-700">
            {motherGenotype.join('')} · {motherPhen}
          </div>
        </div>
        <div className="text-2xl text-stone-400">×</div>
        <div className="flex flex-col items-center">
          <BlobRenderer creature={father} species={blobSpecies} size={90} />
          <div className="text-xs text-stone-500 mt-1">Father ♂</div>
          <div className="text-[10px] font-mono text-stone-700">
            {fatherGenotype.join('')}
          </div>
        </div>
        <div className="text-2xl text-stone-400">→</div>
        <div className="flex flex-col items-center">
          <BlobRenderer creature={offspring} species={blobSpecies} size={90} />
          <div className="text-xs text-stone-500 mt-1">Offspring</div>
          <div className="text-[10px] font-mono text-stone-700">
            {offspring.genotype[focusGeneId]?.join('')} · {offspringPhen}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={motherMethylated}
            onChange={e => setMotherMethylated(e.target.checked)}
          />
          Methylate mother's {gene.name} gene
        </label>
        <div className="text-xs text-stone-500 italic">
          Methylated dominant alleles fall silent — the phenotype drops to the
          recessive, and the child inherits the mark maternally.
        </div>
      </div>
    </div>
  )
}
