import { useMemo } from 'react'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { makePreviewCreature, orderedPair } from '../../engine/codex'

interface Props {
  motherId: string
  fatherId: string
  geneId: string
}

// Single-gene Punnett square. Passive by design — the headers derive directly
// from the two parents' notebook guesses (notebookGuess store), and every cell
// updates the instant a guess changes. There is no manual header editing and
// no Fill/Clear buttons: the Punnett IS the notebook's visual reasoning aid.
export function PunnettGrid({ motherId, fatherId, geneId }: Props) {
  const motherGuess = useGameStore(s => s.notebookGuess[motherId]?.[geneId] ?? '')
  const fatherGuess = useGameStore(s => s.notebookGuess[fatherId]?.[geneId] ?? '')

  const gene = useMemo(
    () => blobSpecies.genes.find(g => g.id === geneId) ?? null,
    [geneId],
  )
  if (!gene) return null

  const sideA = motherGuess[0] ?? ''
  const sideB = motherGuess[1] ?? ''
  const topA = fatherGuess[0] ?? ''
  const topB = fatherGuess[1] ?? ''

  const renderCell = (row: string, col: string) => {
    if (!row || !col) {
      return (
        <div className="w-16 h-16 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const pair = orderedPair(gene, row, col)
    const alleleIds = pair
      .map(sym => gene.alleles.find(al => al.symbol === sym)?.id)
      .filter((x): x is string => !!x)
    if (alleleIds.length !== 2) {
      return (
        <div className="w-16 h-16 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const preview = makePreviewCreature(
      gene,
      [alleleIds[0]!, alleleIds[1]!],
      blobSpecies,
    )
    const label = pair.join('')
    return (
      <div className="w-16 h-16 border-2 border-stone-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.55 }}>
          <BlobRenderer creature={preview} species={blobSpecies} size={42} />
        </div>
        <div className="text-[10px] font-mono font-semibold text-stone-700 absolute bottom-0.5">
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
        Punnett · {gene.name}
      </div>
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-8 h-8"></th>
            <th className="pb-0.5 text-center">
              <div className={headerCls + ' bg-sky-50 border border-sky-200 text-sky-900'}>
                {topA || '·'}
              </div>
            </th>
            <th className="pb-0.5 text-center">
              <div className={headerCls + ' bg-sky-50 border border-sky-200 text-sky-900'}>
                {topB || '·'}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="w-8 pr-0.5 text-center">
              <div className={headerCls + ' bg-rose-50 border border-rose-200 text-rose-900'}>
                {sideA || '·'}
              </div>
            </th>
            <td>{renderCell(sideA, topA)}</td>
            <td>{renderCell(sideA, topB)}</td>
          </tr>
          <tr>
            <th className="w-8 pr-0.5 text-center">
              <div className={headerCls + ' bg-rose-50 border border-rose-200 text-rose-900'}>
                {sideB || '·'}
              </div>
            </th>
            <td>{renderCell(sideB, topA)}</td>
            <td>{renderCell(sideB, topB)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-[10px] text-stone-500 mt-1">
        Top = father's gametes ♂ · Left = mother's gametes ♀
      </p>
    </div>
  )
}
