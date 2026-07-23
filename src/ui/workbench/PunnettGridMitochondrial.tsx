import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'

interface Props {
  motherId: string
  fatherId: string
  geneId: string
}

// Mitochondrial "Punnett" — not a Punnett grid at all, because mitochondrial
// DNA is inherited only through the mother. Instead we render the arrow
// diagram: mother contributes her one allele to every offspring; father
// contributes nothing. Visually reinforces the maternal-line rule.
export function PunnettGridMitochondrial({ motherId, fatherId, geneId }: Props) {
  const motherGuess = useGameStore(s => s.notebookGuess[motherId]?.[geneId] ?? '')
  const fatherGuess = useGameStore(s => s.notebookGuess[fatherId]?.[geneId] ?? '')

  const gene = useMemo(
    () => blobSpecies.genes.find(g => g.id === geneId) ?? null,
    [geneId],
  )
  if (!gene) return null

  const validSymbols = new Set(gene.alleles.map(a => a.symbol))
  const motherAllele = validSymbols.has(motherGuess[0] ?? '') ? motherGuess[0]! : ''
  const fatherAllele = validSymbols.has(fatherGuess[0] ?? '') ? fatherGuess[0]! : ''

  const buildOffspring = (allele: string, sex: 'F' | 'M'): Creature | null => {
    const id = gene.alleles.find(a => a.symbol === allele)?.id
    if (!id) return null
    return {
      id: `preview-mito-${sex}-${allele}`,
      speciesId: blobSpecies.id,
      sex,
      genotype: { [geneId]: [id] },
      age: 0,
      scope: 'trophy',
    }
  }
  const daughter = motherAllele ? buildOffspring(motherAllele, 'F') : null
  const son = motherAllele ? buildOffspring(motherAllele, 'M') : null

  return (
    <div className="inline-block">
      <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">
        Inheritance · {gene.name} <span className="italic">(mitochondrial)</span>
      </div>
      <div className="rounded-lg border border-stone-300 bg-white p-3">
        <div className="flex items-center gap-4">
          {/* Mother — the contributor */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-rose-700 mb-1">Mother ♀</div>
            <div className="w-14 h-14 rounded border-2 border-rose-300 bg-rose-50 flex items-center justify-center font-mono text-lg text-rose-900">
              {motherAllele || '·'}
            </div>
          </div>
          <div className="text-2xl text-stone-400">↦</div>
          {/* Every offspring inherits the mother's allele */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-stone-500 mb-1">Every daughter</div>
            {daughter ? (
              <div className="w-14 h-14 rounded border-2 border-emerald-300 bg-emerald-50 flex flex-col items-center justify-center">
                <BlobRenderer creature={daughter} species={blobSpecies} size={44} />
              </div>
            ) : (
              <div className="w-14 h-14 rounded border-2 border-stone-200 bg-stone-50 flex items-center justify-center font-mono text-stone-400">·</div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-stone-500 mb-1">Every son</div>
            {son ? (
              <div className="w-14 h-14 rounded border-2 border-emerald-300 bg-emerald-50 flex flex-col items-center justify-center">
                <BlobRenderer creature={son} species={blobSpecies} size={44} />
              </div>
            ) : (
              <div className="w-14 h-14 rounded border-2 border-stone-200 bg-stone-50 flex items-center justify-center font-mono text-stone-400">·</div>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-[10px] text-stone-500 leading-tight">
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-sky-700">Father ♂</div>
            <div className="w-8 h-8 rounded border-2 border-sky-300 bg-sky-50 flex items-center justify-center font-mono text-sky-900">
              {fatherAllele || '·'}
            </div>
          </div>
          <div className="italic">
            passes nothing — mitochondrial DNA is inherited only through the
            mother's egg.
          </div>
        </div>
      </div>
    </div>
  )
}
