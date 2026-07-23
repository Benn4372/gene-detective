import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'

interface Props {
  motherId: string
  fatherId: string
  geneIds: [string, string]
}

// Two-gene dihybrid Punnett (4×4). Passive by design — headers derive from
// the two parents' notebook guesses for each gene. If both notebook guesses
// are complete (Aa, Ss) for one parent, four gametes are shown; otherwise
// the header cell stays empty and dependent body cells stay blank.
export function PunnettGridDihybrid({ motherId, fatherId, geneIds }: Props) {
  const [g1, g2] = geneIds
  const gene1 = blobSpecies.genes.find(g => g.id === g1)
  const gene2 = blobSpecies.genes.find(g => g.id === g2)

  const motherHyp1 = useGameStore(s => s.notebookGuess[motherId]?.[g1] ?? '')
  const motherHyp2 = useGameStore(s => s.notebookGuess[motherId]?.[g2] ?? '')
  const fatherHyp1 = useGameStore(s => s.notebookGuess[fatherId]?.[g1] ?? '')
  const fatherHyp2 = useGameStore(s => s.notebookGuess[fatherId]?.[g2] ?? '')

  if (!gene1 || !gene2) return null

  const gametesOf = (h1: string, h2: string): string[] => {
    if (h1.length < 2 || h2.length < 2) return ['', '', '', '']
    const [a1a, a1b] = [h1[0]!, h1[1]!]
    const [a2a, a2b] = [h2[0]!, h2[1]!]
    return [a1a + a2a, a1a + a2b, a1b + a2a, a1b + a2b]
  }

  const topRow = useMemo(
    () => gametesOf(fatherHyp1, fatherHyp2),
    [fatherHyp1, fatherHyp2],
  )
  const sideCol = useMemo(
    () => gametesOf(motherHyp1, motherHyp2),
    [motherHyp1, motherHyp2],
  )

  const dominantG1 = [...gene1.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]?.symbol ?? '?'
  const dominantG2 = [...gene2.alleles].sort(
    (a, b) => b.dominanceRank - a.dominanceRank,
  )[0]?.symbol ?? '?'
  const gameteExample = `${dominantG1}${dominantG2}`

  const renderCell = (row: string, col: string) => {
    if (row.length < 2 || col.length < 2) {
      return (
        <div className="w-16 h-16 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const g1Alleles = [row[0]!, col[0]!]
    const g2Alleles = [row[1]!, col[1]!]
    const [r1, r2] = [
      gene1.alleles.find(a => a.symbol === g1Alleles[0]),
      gene1.alleles.find(a => a.symbol === g1Alleles[1]),
    ]
    const [s1, s2] = [
      gene2.alleles.find(a => a.symbol === g2Alleles[0]),
      gene2.alleles.find(a => a.symbol === g2Alleles[1]),
    ]
    if (!r1 || !r2 || !s1 || !s2) {
      return (
        <div className="w-16 h-16 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const gene1Pair =
      r1.dominanceRank >= r2.dominanceRank
        ? [r1.symbol, r2.symbol]
        : [r2.symbol, r1.symbol]
    const gene2Pair =
      s1.dominanceRank >= s2.dominanceRank
        ? [s1.symbol, s2.symbol]
        : [s2.symbol, s1.symbol]

    const genotype: Record<string, string[]> = {
      [g1!]: [
        r1.dominanceRank >= r2.dominanceRank ? r1.id : r2.id,
        r1.dominanceRank >= r2.dominanceRank ? r2.id : r1.id,
      ],
      [g2!]: [
        s1.dominanceRank >= s2.dominanceRank ? s1.id : s2.id,
        s1.dominanceRank >= s2.dominanceRank ? s2.id : s1.id,
      ],
    }
    const preview: Creature = {
      id: `preview-${g1}-${g2}-${row}${col}`,
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype,
      age: 0,
      scope: 'trophy',
    }
    const label = gene1Pair.join('') + gene2Pair.join('')
    return (
      <div className="w-16 h-16 border-2 border-stone-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.55 }}>
          <BlobRenderer creature={preview} species={blobSpecies} size={44} />
        </div>
        <div className="text-[9px] font-mono font-semibold text-stone-700 absolute bottom-0.5">
          {label}
        </div>
      </div>
    )
  }

  const headerCls =
    'w-16 h-8 rounded font-mono text-center flex items-center justify-center text-sm'

  return (
    <div className="inline-block">
      <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">
        Punnett · dihybrid {gene1.name} × {gene2.name}
      </div>
      <div className="text-xs text-stone-600 italic mb-2 leading-snug">
        Each gamete carries <span className="font-semibold">two letters</span>:
        one {gene1.name.toLowerCase()} allele + one {gene2.name.toLowerCase()} allele
        (e.g. <span className="font-mono not-italic">{gameteExample}</span>).
        A parent that's heterozygous for both makes four different gametes.
      </div>

      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-10 h-8"></th>
            {topRow.map((v, i) => (
              <th key={i} className="pb-0.5 text-center">
                <div className={headerCls + ' bg-sky-50 border border-sky-200 text-sky-900'}>
                  {v || '·'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sideCol.map((rowVal, rowIx) => (
            <tr key={rowIx}>
              <th className="w-10 pr-0.5 text-center">
                <div className={headerCls + ' bg-rose-50 border border-rose-200 text-rose-900'}>
                  {rowVal || '·'}
                </div>
              </th>
              {topRow.map((colVal, colIx) => (
                <td key={colIx}>{renderCell(rowVal, colVal)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-stone-500 mt-1">
        Each gamete is one allele per gene ({gene1.name[0]}
        {gene2.name[0]}). Top = father's gametes ♂ · Left = mother's gametes ♀
      </p>
    </div>
  )
}
