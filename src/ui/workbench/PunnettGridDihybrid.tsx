import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'

interface Props {
  motherId: string
  fatherId: string
  geneIds: [string, string]
}

// A real 4×4 dihybrid Punnett grid.
//
// Each parent contributes one allele per tracked gene into every gamete, so
// each parent has up to 4 gamete signatures. Headers hold gamete strings
// (one letter per gene, in the geneIds order), body cells render an offspring
// combining the row and column gametes.
export function PunnettGridDihybrid({ motherId, fatherId, geneIds }: Props) {
  const [g1, g2] = geneIds
  const gene1 = blobSpecies.genes.find(g => g.id === g1)
  const gene2 = blobSpecies.genes.find(g => g.id === g2)

  const motherHyp1 = useGameStore(s => s.hypotheses[motherId]?.[g1] ?? '')
  const motherHyp2 = useGameStore(s => s.hypotheses[motherId]?.[g2] ?? '')
  const fatherHyp1 = useGameStore(s => s.hypotheses[fatherId]?.[g1] ?? '')
  const fatherHyp2 = useGameStore(s => s.hypotheses[fatherId]?.[g2] ?? '')

  const [topRow, setTopRow] = useState<string[]>(['', '', '', ''])
  const [sideCol, setSideCol] = useState<string[]>(['', '', '', ''])

  const validSymbolsG1 = useMemo(
    () => (gene1 ? gene1.alleles.map(a => a.symbol) : []),
    [gene1],
  )
  const validSymbolsG2 = useMemo(
    () => (gene2 ? gene2.alleles.map(a => a.symbol) : []),
    [gene2],
  )

  if (!gene1 || !gene2) return null

  // Sanitize a two-char gamete: first char must be a valid g1 allele, second a g2 allele.
  const sanitize = (raw: string): string => {
    const chars = raw
      .split('')
      .filter(
        (c, i) =>
          (i === 0 && validSymbolsG1.includes(c)) ||
          (i === 1 && validSymbolsG2.includes(c)),
      )
    return chars.slice(0, 2).join('')
  }

  // From a parent's two per-gene diploid strings, produce the 4 gamete
  // combinations (allele-from-g1, allele-from-g2). Homozygotes collapse the
  // repeated gametes but we still display 4 slots — the player learns
  // gamete enumeration by seeing "AS AS as as" rather than "AS as".
  const gametesOf = (h1: string, h2: string): string[] => {
    if (h1.length < 2 || h2.length < 2) return ['', '', '', '']
    const [a1a, a1b] = [h1[0]!, h1[1]!]
    const [a2a, a2b] = [h2[0]!, h2[1]!]
    return [a1a + a2a, a1a + a2b, a1b + a2a, a1b + a2b]
  }

  // Fill whatever the notebook has now — one gene alone, one parent alone,
  // whatever. Missing pieces stay blank for hand-fill.
  const canFillFather =
    fatherHyp1.length >= 2 && fatherHyp2.length >= 2
  const canFillMother =
    motherHyp1.length >= 2 && motherHyp2.length >= 2
  const canFill =
    fatherHyp1.length >= 1 ||
    fatherHyp2.length >= 1 ||
    motherHyp1.length >= 1 ||
    motherHyp2.length >= 1

  const fillFromNotebook = () => {
    if (!canFill) return
    if (canFillFather) setTopRow(gametesOf(fatherHyp1, fatherHyp2))
    if (canFillMother) setSideCol(gametesOf(motherHyp1, motherHyp2))
    // Partial: only one parent complete — still fill that side.
    if (!canFillFather && canFillMother) {
      // leave top row blank for hand-fill
    }
    if (canFillFather && !canFillMother) {
      // leave side col blank for hand-fill
    }
  }

  const clear = () => {
    setTopRow(['', '', '', ''])
    setSideCol(['', '', '', ''])
  }

  const inputCls =
    'w-14 h-8 text-center font-mono text-sm border-2 border-stone-300 rounded bg-white text-stone-800'

  const renderCell = (row: string, col: string) => {
    if (row.length < 2 || col.length < 2) {
      return (
        <div className="w-24 h-24 border border-stone-200 bg-stone-50/50 rounded" />
      )
    }
    const g1Alleles = [row[0]!, col[0]!]
    const g2Alleles = [row[1]!, col[1]!]
    // Sort each gene's pair by dominance for a canonical label.
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
        <div className="w-24 h-24 border border-stone-200 bg-stone-50/50 rounded" />
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

    // Build the preview creature: use these alleles for the two tracked
    // genes; leave every other gene as homozygous recessive so its layer
    // stays hidden.
    const genotype: Record<string, string[]> = {}
    for (const gene of blobSpecies.genes) {
      if (gene.id === g1) {
        genotype[gene.id] = [
          r1.dominanceRank >= r2.dominanceRank ? r1.id : r2.id,
          r1.dominanceRank >= r2.dominanceRank ? r2.id : r1.id,
        ]
      } else if (gene.id === g2) {
        genotype[gene.id] = [
          s1.dominanceRank >= s2.dominanceRank ? s1.id : s2.id,
          s1.dominanceRank >= s2.dominanceRank ? s2.id : s1.id,
        ]
      } else {
        const rec = [...gene.alleles].sort(
          (a, b) => a.dominanceRank - b.dominanceRank,
        )[0]
        if (rec) genotype[gene.id] = [rec.id, rec.id]
      }
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
      <div className="w-24 h-24 border-2 border-stone-300 bg-white rounded flex flex-col items-center justify-center relative overflow-hidden">
        <div style={{ opacity: 0.55 }}>
          <BlobRenderer creature={preview} species={blobSpecies} size={60} />
        </div>
        <div className="text-[10px] font-mono font-semibold text-stone-700 absolute bottom-1">
          {label}
        </div>
      </div>
    )
  }

  const HeaderInput = ({
    value,
    onChange,
    hue,
  }: {
    value: string
    onChange(v: string): void
    hue: 'sky' | 'rose'
  }) => (
    <input
      type="text"
      value={value}
      onChange={e => onChange(sanitize(e.target.value))}
      placeholder="?"
      maxLength={2}
      className={
        inputCls +
        (hue === 'sky' ? ' bg-sky-50' : ' bg-rose-50')
      }
    />
  )

  return (
    <div className="inline-block">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="text-xs uppercase tracking-wide text-stone-500">
          Punnett · dihybrid {gene1.name} × {gene2.name}
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
            title="Fill both axes from your notebook hypotheses"
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
            <th className="w-14 h-10"></th>
            {topRow.map((v, i) => (
              <th key={i} className="w-24 pb-1 text-center">
                <HeaderInput
                  value={v}
                  onChange={next =>
                    setTopRow(prev => {
                      const copy = [...prev]
                      copy[i] = next
                      return copy
                    })
                  }
                  hue="sky"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sideCol.map((rowVal, rowIx) => (
            <tr key={rowIx}>
              <th className="w-14 pr-1 text-center">
                <HeaderInput
                  value={rowVal}
                  onChange={next =>
                    setSideCol(prev => {
                      const copy = [...prev]
                      copy[rowIx] = next
                      return copy
                    })
                  }
                  hue="rose"
                />
              </th>
              {topRow.map((colVal, colIx) => (
                <td key={colIx}>{renderCell(rowVal, colVal)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-stone-500 mt-1">
        Each gamete carries one allele per gene ({gene1.name[0]}
        {gene2.name[0]}). Top = father's gametes ♂ · Left = mother's gametes ♀
      </p>
    </div>
  )
}
