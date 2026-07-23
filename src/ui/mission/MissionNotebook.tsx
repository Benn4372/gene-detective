import { useMemo, useState, useEffect } from 'react'
import { blobSpecies } from '../../content'
import type { Creature } from '../../engine/types'
import { useGameStore } from '../../state/gameStore'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { genotypePlaceholder } from '../../renderer/genotypePlaceholder'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { SexBadge } from '../atoms/SexBadge'
import { computePhenotype } from '../../engine/phenotype'
import { PunnettGrid } from '../workbench/PunnettGrid'
import { PunnettGridDihybrid } from '../workbench/PunnettGridDihybrid'
import { PunnettGridSexLinked } from '../workbench/PunnettGridSexLinked'
import { PunnettGridMitochondrial } from '../workbench/PunnettGridMitochondrial'
import { LinkageNotice } from '../workbench/LinkageNotice'
import { ImprintingNotice } from '../workbench/ImprintingNotice'
import { InheritanceQuirkNotice } from '../workbench/InheritanceQuirkNotice'

interface Props {
  blobs: Creature[]
  visibleGeneIds: string[]
}

// Mission notebook. Never validates — missions hide the answer entirely, so
// there is deliberately no green checkmark. Player clicks any blob thumbnail
// to focus its row. For each tracked gene the row shows:
//   • Genotype guess (allele letters) — feeds the Punnett's Fill button
//   • Notes textarea (free text scratchpad)
//   • Observed phenotype label so the player can cross-check against reality
// The Punnett below the notes has its own PAIR-PICKER: the player picks any
// two blobs (samples or bred offspring, any sex combination) and the Punnett
// updates. Old behaviour auto-picked "first female + first male starter" —
// useless when the bench has 3-4 samples and the player needs to compare
// hypothetical pairings before committing to a real cross.
export function MissionNotebook({ blobs, visibleGeneIds }: Props) {
  const [focusId, setFocusId] = useState<string>(blobs[0]?.id ?? '')
  const focused = blobs.find(b => b.id === focusId) ?? blobs[0]

  const females = useMemo(() => blobs.filter(b => b.sex === 'F'), [blobs])
  const males = useMemo(() => blobs.filter(b => b.sex === 'M'), [blobs])

  // Punnett-preview pair. Defaults to first female + first male when the
  // component mounts. Player can pick any blob of either sex — the mother
  // slot needs a female, father slot needs a male, otherwise the Punnett
  // sits idle until both are chosen.
  const [motherId, setMotherId] = useState<string>(females[0]?.id ?? '')
  const [fatherId, setFatherId] = useState<string>(males[0]?.id ?? '')

  // If the underlying pool changed (a new offspring was bred, or a starter
  // was delivered), make sure the picker's IDs are still valid.
  useEffect(() => {
    if (!blobs.some(b => b.id === motherId) && females[0]) setMotherId(females[0].id)
    if (!blobs.some(b => b.id === fatherId) && males[0]) setFatherId(males[0].id)
  }, [blobs, motherId, fatherId, females, males])

  if (!focused) return null
  const phen = computePhenotype(focused, blobSpecies)

  const mother = blobs.find(b => b.id === motherId)
  const father = blobs.find(b => b.id === fatherId)
  const canPunnett =
    !!mother && !!father && visibleGeneIds.length > 0

  const firstGene = visibleGeneIds[0]
    ? blobSpecies.genes.find(g => g.id === visibleGeneIds[0])
    : null
  const isMonohybridSexLinked =
    visibleGeneIds.length === 1 && firstGene?.inheritanceModel === 'sexLinked'
  const isMonohybridMito =
    visibleGeneIds.length === 1 && firstGene?.inheritanceModel === 'mitochondrial'
  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-700 font-serif">
          📓 Field Notebook
        </h3>
        <div className="text-xs text-stone-500 italic">
          Notes only — no answer-checking in missions. Guess feeds the Punnett.
        </div>
      </div>

      {/* Blob picker — thumbnails you click to switch focus (for notes). */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blobs.map(b => {
          const isFocus = b.id === focused.id
          const name = b.ownerName ?? `#${b.id.slice(-4)}`
          return (
            <button
              key={b.id}
              onClick={() => setFocusId(b.id)}
              className={
                'flex flex-col items-center rounded-lg border-2 bg-white p-2 transition-colors ' +
                (isFocus
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-100'
                  : 'border-stone-300 hover:border-stone-400')
              }
            >
              <BlobRenderer creature={b} species={blobSpecies} size={44} />
              <div className="flex items-center gap-1 text-[10px] text-stone-600 mt-1">
                <SexBadge sex={b.sex} />
                <span className="truncate max-w-[70px]">{name}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Focused blob's notes row */}
      <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
        <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
          Notes on{' '}
          <span className="text-stone-800 font-semibold">
            {focused.ownerName ?? `Blob #${focused.id.slice(-4)}`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {visibleGeneIds.map(geneId => {
            const gene = blobSpecies.genes.find(g => g.id === geneId)
            if (!gene) return null
            const trait = gene.expressesTraits[0]
            const observedPhen = trait ? phen[trait] : undefined
            return (
              <MissionNotebookCell
                key={geneId}
                gene={gene}
                creatureId={focused.id}
                geneId={geneId}
                observedPhen={observedPhen}
                traitId={trait}
              />
            )
          })}
        </div>
      </div>

      {/* Punnett of a chosen pair, driven by their notebook guesses. */}
      {visibleGeneIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <div className="text-xs uppercase tracking-widest text-stone-500">
              Punnett — pick two blobs
            </div>
            <label className="flex items-center gap-1 text-xs">
              <span className="text-stone-500">Mother ♀</span>
              <select
                value={motherId}
                onChange={e => setMotherId(e.target.value)}
                className="border border-stone-300 rounded px-1 py-0.5 bg-white text-stone-800 max-w-[160px]"
              >
                <option value="">— pick a female —</option>
                {females.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.ownerName ?? `#${b.id.slice(-4)}`}
                  </option>
                ))}
              </select>
            </label>
            <span className="text-stone-400">×</span>
            <label className="flex items-center gap-1 text-xs">
              <span className="text-stone-500">Father ♂</span>
              <select
                value={fatherId}
                onChange={e => setFatherId(e.target.value)}
                className="border border-stone-300 rounded px-1 py-0.5 bg-white text-stone-800 max-w-[160px]"
              >
                <option value="">— pick a male —</option>
                {males.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.ownerName ?? `#${b.id.slice(-4)}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {!canPunnett && (
            <div className="text-[11px] italic text-stone-500">
              Pick a female + a male from the sample bench (or from your bred
              offspring) to preview their cross.
            </div>
          )}
          {canPunnett && (
            <>
              {visibleGeneIds.length === 2 && (
                <LinkageNotice geneIds={visibleGeneIds} />
              )}
              {visibleGeneIds.length === 1 && visibleGeneIds[0] && firstGene?.imprintOrigin && (
                <ImprintingNotice geneId={visibleGeneIds[0]} />
              )}
              {visibleGeneIds.length === 1 && visibleGeneIds[0] && (
                <InheritanceQuirkNotice geneId={visibleGeneIds[0]} />
              )}
              <div className="flex justify-center mt-2">
                {isMonohybridSexLinked && visibleGeneIds[0] && (
                  <PunnettGridSexLinked
                    motherId={mother!.id}
                    fatherId={father!.id}
                    geneId={visibleGeneIds[0]}
                  />
                )}
                {isMonohybridMito && visibleGeneIds[0] && (
                  <PunnettGridMitochondrial
                    motherId={mother!.id}
                    fatherId={father!.id}
                    geneId={visibleGeneIds[0]}
                  />
                )}
                {!isMonohybridSexLinked && !isMonohybridMito && visibleGeneIds.length === 1 && visibleGeneIds[0] && (
                  <PunnettGrid
                    motherId={mother!.id}
                    fatherId={father!.id}
                    geneId={visibleGeneIds[0]}
                  />
                )}
                {visibleGeneIds.length === 2 && (
                  <PunnettGridDihybrid
                    motherId={mother!.id}
                    fatherId={father!.id}
                    geneIds={[visibleGeneIds[0]!, visibleGeneIds[1]!]}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// One (creature × gene) row: guess input + notes textarea + observed phen line.
function MissionNotebookCell({
  gene,
  creatureId,
  geneId,
  observedPhen,
  traitId,
}: {
  gene: (typeof blobSpecies.genes)[number]
  creatureId: string
  geneId: string
  observedPhen?: string
  traitId?: string
}) {
  const guess = useGameStore(s => s.notebookGuess[creatureId]?.[geneId] ?? '')
  const notes = useGameStore(s => s.notebookNotes[creatureId]?.[geneId] ?? '')
  const setGuess = useGameStore(s => s.setNotebookGuess)
  const setNotes = useGameStore(s => s.setNotebookNote)

  const validSymbols = new Set(gene.alleles.map(a => a.symbol))
  const placeholder = genotypePlaceholder(gene)

  const onGuessChange = (raw: string) => {
    const filtered = raw
      .split('')
      .filter(ch => validSymbols.has(ch))
      .slice(0, 4)
      .join('')
    setGuess(creatureId, geneId, filtered)
  }

  return (
    <div>
      <div className="text-xs font-semibold text-stone-700 mb-1">
        {gene.name}
      </div>
      <input
        type="text"
        value={guess}
        onChange={e => onGuessChange(e.target.value)}
        placeholder={placeholder}
        maxLength={4}
        className="w-36 px-2 py-1 border-2 border-stone-300 rounded text-center font-mono text-sm bg-white text-stone-800"
      />
      <textarea
        value={notes}
        onChange={e => setNotes(creatureId, geneId, e.target.value)}
        placeholder='e.g. "AA or Aa"'
        rows={2}
        className="mt-2 w-full px-2 py-1 border border-stone-300 rounded text-xs bg-white text-stone-700 resize-none leading-snug"
      />
      {observedPhen && observedPhen !== 'absent' && traitId && (
        <div className="text-[10px] text-stone-500 mt-1">
          observed phenotype:{' '}
          <span className="font-mono">
            {phenotypeLabel(traitId, observedPhen)}
          </span>
        </div>
      )}
    </div>
  )
}
