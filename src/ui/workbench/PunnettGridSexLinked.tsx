import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { SexBadge } from '../atoms/SexBadge'

interface Props {
  motherId: string
  fatherId: string
  geneId: string
}

// Sex-linked Punnett square. Uses genuine X^A / Y notation instead of the
// generic autosomal 2×2, because sex-linked genes ride the X chromosome and
// males are hemizygous — the shape of the cross is fundamentally different:
//
//   Mother (XX) contributes one X gamete carrying one of her two alleles.
//   Father (XY) contributes EITHER an X gamete carrying his one allele OR
//     a Y gamete carrying no allele for this gene.
//
// So the four body cells are:
//   • Mother X^A × Father X^B → X^A X^B daughter (two alleles, may be a carrier)
//   • Mother X^A × Father Y   → X^A Y son (hemizygous, phenotype = allele)
//   • Mother X^a × Father X^B → X^a X^B daughter
//   • Mother X^a × Father Y   → X^a Y son
//
// The teaching payoff: the player literally SEES why recessive X-linked
// phenotypes land on sons — sons only get one allele, whatever it is expresses.
export function PunnettGridSexLinked({ motherId, fatherId, geneId }: Props) {
  const motherGuess = useGameStore(s => s.notebookGuess[motherId]?.[geneId] ?? '')
  const fatherGuess = useGameStore(s => s.notebookGuess[fatherId]?.[geneId] ?? '')

  const gene = useMemo(
    () => blobSpecies.genes.find(g => g.id === geneId) ?? null,
    [geneId],
  )
  if (!gene) return null

  const validSymbols = new Set(gene.alleles.map(a => a.symbol))

  // Mother's two X-carried alleles (from her 2-letter notebook guess).
  const motherA = validSymbols.has(motherGuess[0] ?? '') ? motherGuess[0]! : ''
  const motherB = validSymbols.has(motherGuess[1] ?? '') ? motherGuess[1]! : ''
  // Father's single X-carried allele (hemizygous — one-letter guess).
  const fatherA = validSymbols.has(fatherGuess[0] ?? '') ? fatherGuess[0]! : ''

  const sup = (s: string) => <sup className="text-[0.65em]">{s}</sup>

  // Build the offspring preview creature for a given (motherAllele, colKind).
  //   colKind === 'X' → daughter, genotype is [motherAllele, fatherAllele]
  //   colKind === 'Y' → son, genotype is [motherAllele] (hemizygous)
  const buildOffspring = (
    mA: string,
    colKind: 'X' | 'Y',
  ): { creature: Creature; label: React.ReactNode } | null => {
    if (!mA) return null
    if (colKind === 'Y') {
      const alleleId = gene.alleles.find(a => a.symbol === mA)?.id
      if (!alleleId) return null
      return {
        creature: {
          id: `preview-son-${mA}`,
          speciesId: blobSpecies.id,
          sex: 'M',
          genotype: { [geneId]: [alleleId] },
          age: 0,
          scope: 'trophy',
        },
        label: (
          <>
            X{sup(mA)} Y
          </>
        ),
      }
    }
    if (!fatherA) return null
    const mAlleleId = gene.alleles.find(a => a.symbol === mA)?.id
    const fAlleleId = gene.alleles.find(a => a.symbol === fatherA)?.id
    if (!mAlleleId || !fAlleleId) return null
    // Order by dominance rank for a canonical XᴬXᵇ display.
    const [first, second] = [mA, fatherA].sort((x, y) => {
      const rx = gene.alleles.find(al => al.symbol === x)?.dominanceRank ?? 0
      const ry = gene.alleles.find(al => al.symbol === y)?.dominanceRank ?? 0
      return ry - rx
    })
    return {
      creature: {
        id: `preview-dtr-${mA}${fatherA}`,
        speciesId: blobSpecies.id,
        sex: 'F',
        genotype: { [geneId]: [mAlleleId, fAlleleId] },
        age: 0,
        scope: 'trophy',
      },
      label: (
        <>
          X{sup(first!)} X{sup(second!)}
        </>
      ),
    }
  }

  const renderCell = (mA: string, colKind: 'X' | 'Y') => {
    const built = buildOffspring(mA, colKind)
    if (!built) {
      return (
        <div className="w-20 h-20 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    return (
      <div className="w-20 h-20 border-2 border-stone-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.6 }}>
          <BlobRenderer creature={built.creature} species={blobSpecies} size={48} />
        </div>
        <div className="absolute top-0.5 right-1">
          <SexBadge sex={built.creature.sex} />
        </div>
        <div className="text-[10px] font-mono text-stone-700 absolute bottom-0.5">
          {built.label}
        </div>
      </div>
    )
  }

  const headerCls =
    'rounded font-mono text-center flex items-center justify-center px-2 py-1 text-sm'

  return (
    <div className="inline-block">
      <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">
        Punnett · {gene.name} <span className="italic">(X-linked)</span>
      </div>
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-10 h-10"></th>
            <th className="pb-0.5 text-center">
              <div className={headerCls + ' bg-sky-50 border border-sky-200 text-sky-900'}>
                {fatherA ? <>X{sup(fatherA)}</> : '·'}
              </div>
            </th>
            <th className="pb-0.5 text-center">
              <div className={headerCls + ' bg-sky-50 border border-sky-200 text-sky-900'}>
                Y
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="w-10 pr-0.5 text-center">
              <div className={headerCls + ' bg-rose-50 border border-rose-200 text-rose-900'}>
                {motherA ? <>X{sup(motherA)}</> : '·'}
              </div>
            </th>
            <td>{renderCell(motherA, 'X')}</td>
            <td>{renderCell(motherA, 'Y')}</td>
          </tr>
          <tr>
            <th className="w-10 pr-0.5 text-center">
              <div className={headerCls + ' bg-rose-50 border border-rose-200 text-rose-900'}>
                {motherB ? <>X{sup(motherB)}</> : '·'}
              </div>
            </th>
            <td>{renderCell(motherB, 'X')}</td>
            <td>{renderCell(motherB, 'Y')}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-[10px] text-stone-500 mt-1 leading-tight">
        Mother (XX) contributes an X carrying one of her two alleles.<br />
        Father (XY) contributes his X<sup className="text-[0.65em]">allele</sup> half the
        time, Y the other half — sons inherit only from mother.
      </p>
    </div>
  )
}
