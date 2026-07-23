import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { makePreviewCreature, orderedPair } from '../../engine/codex'

interface Props {
  motherId: string
  fatherId: string
  geneId: string
}

// Interactive Punnett square for a single gene. Player fills header cells
// with allele letters; each body cell auto-renders a semi-transparent mini
// blob showing that predicted offspring's phenotype for this gene.
//
// The "Fill from notebook" button populates all four headers from the two
// parents' hypothesized genotypes stored in the notebook. This is the game's
// main punnett shortcut — no free info, but no tedious data entry either.
export function PunnettGrid({ motherId, fatherId, geneId }: Props) {
  const motherHyp = useGameStore(s => s.hypotheses[motherId]?.[geneId] ?? '')
  const fatherHyp = useGameStore(s => s.hypotheses[fatherId]?.[geneId] ?? '')

  const gene = useMemo(
    () => blobSpecies.genes.find(g => g.id === geneId) ?? null,
    [geneId],
  )

  const [topA, setTopA] = useState('')
  const [topB, setTopB] = useState('')
  const [sideA, setSideA] = useState('')
  const [sideB, setSideB] = useState('')

  const validSymbols = useMemo(
    () => (gene ? gene.alleles.map(a => a.symbol) : []),
    [gene],
  )

  // If either parent's hypothesis changes to something the player COULD fill
  // in, do not auto-fill — leave the choice to click "Fill from notebook".
  // But if the field is empty, offer to fill on first mount.
  useEffect(() => {
    // do nothing — see fillFromNotebook below
  }, [motherHyp, fatherHyp])

  if (!gene) return null

  const sanitize = (raw: string): string => {
    const ch = raw.trim().slice(-1)
    return validSymbols.includes(ch) ? ch : ''
  }

  const canFill = motherHyp.length >= 2 && fatherHyp.length >= 2
  const fillFromNotebook = () => {
    if (!canFill) return
    // Mother's alleles go down the side; father's along the top.
    setSideA(motherHyp[0]!)
    setSideB(motherHyp[1]!)
    setTopA(fatherHyp[0]!)
    setTopB(fatherHyp[1]!)
  }

  const clear = () => {
    setTopA('')
    setTopB('')
    setSideA('')
    setSideB('')
  }

  const inputCls =
    'w-8 h-8 text-center font-mono border-2 border-stone-300 rounded bg-white text-stone-800'

  const renderCell = (row: string, col: string) => {
    if (!row || !col) {
      return (
        <div className="w-20 h-20 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const pair = orderedPair(gene, row, col)
    const alleleIds = pair
      .map(sym => gene.alleles.find(al => al.symbol === sym)?.id)
      .filter((x): x is string => !!x)
    if (alleleIds.length !== 2) {
      return (
        <div className="w-20 h-20 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const preview = makePreviewCreature(
      gene,
      [alleleIds[0]!, alleleIds[1]!],
      blobSpecies,
    )
    const label = pair.join('')
    return (
      <div className="w-20 h-20 border-2 border-stone-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.55 }}>
          <BlobRenderer creature={preview} species={blobSpecies} size={54} />
        </div>
        <div className="text-xs font-mono font-semibold text-stone-700 absolute bottom-1">
          {label}
        </div>
      </div>
    )
  }

  return (
    <div className="inline-block">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Punnett · {gene.name}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: canFill ? 1.03 : 1 }}
            whileTap={{ scale: canFill ? 0.97 : 1 }}
            onClick={fillFromNotebook}
            disabled={!canFill}
            className={
              'px-3 py-1 rounded text-xs font-medium ' +
              (canFill
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed')
            }
            title="Fill headers from your notebook hypotheses"
          >
            📖 Fill from notebook
          </motion.button>
          <button
            onClick={clear}
            className="px-2 py-1 rounded text-xs text-stone-500 hover:text-stone-800"
          >
            clear
          </button>
        </div>
      </div>

      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-10 h-10"></th>
            <th className="w-20 pb-1 text-center">
              <input
                type="text"
                value={topA}
                onChange={e => setTopA(sanitize(e.target.value))}
                placeholder="?"
                className={inputCls + ' bg-sky-50'}
                maxLength={1}
              />
            </th>
            <th className="w-20 pb-1 text-center">
              <input
                type="text"
                value={topB}
                onChange={e => setTopB(sanitize(e.target.value))}
                placeholder="?"
                className={inputCls + ' bg-sky-50'}
                maxLength={1}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="w-10 pr-1 text-center">
              <input
                type="text"
                value={sideA}
                onChange={e => setSideA(sanitize(e.target.value))}
                placeholder="?"
                className={inputCls + ' bg-rose-50'}
                maxLength={1}
              />
            </th>
            <td>{renderCell(sideA, topA)}</td>
            <td>{renderCell(sideA, topB)}</td>
          </tr>
          <tr>
            <th className="w-10 pr-1 text-center">
              <input
                type="text"
                value={sideB}
                onChange={e => setSideB(sanitize(e.target.value))}
                placeholder="?"
                className={inputCls + ' bg-rose-50'}
                maxLength={1}
              />
            </th>
            <td>{renderCell(sideB, topA)}</td>
            <td>{renderCell(sideB, topB)}</td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-stone-500 mt-1">
        Top = father's gametes ♂ · Left = mother's gametes ♀
      </p>
    </div>
  )
}
