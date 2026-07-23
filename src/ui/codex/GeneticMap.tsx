import { useMemo } from 'react'
import { blobSpecies, chapters } from '../../content'
import type { Chromosome, Gene } from '../../engine/types'

interface Props {
  unlockedTraits: string[]
  onGeneClick?(geneId: string): void
  focusGeneId?: string
}

// Build a trait-id → "unlocked by Ch N" hint so the player has something to
// look forward to on locked markers. Uses chapter order for the hint.
function useChapterHintByTrait(): Record<string, string> {
  return useMemo(() => {
    const hint: Record<string, string> = {}
    const ordered = [...chapters].sort((a, b) => a.order - b.order)
    for (const ch of ordered) {
      for (const t of ch.unlocks.traits ?? []) {
        if (!hint[t]) hint[t] = `Unlocks after Ch ${ch.order}`
      }
    }
    return hint
  }, [])
}

// The Genetic Map view of the Codex. Chromosomes are drawn as horizontal
// bands and genes are plotted at their real locusCM position — so linked
// genes (fins + antennae at 50 vs 55 cM on autosome 1) sit visibly next to
// each other, independently assorting genes fall on different bands, and
// sex chromosomes get their own row. Locked genes render as anonymous grey
// markers so the player knows there's "more to discover" without spoiling
// what the trait is.
export function GeneticMap({ unlockedTraits, onGeneClick, focusGeneId }: Props) {
  const groups = useMemo(() => groupByChromosome(blobSpecies.chromosomes, blobSpecies.genes), [])
  const chapterHintByTrait = useChapterHintByTrait()
  return (
    <div className="space-y-5">
      <div className="text-xs text-stone-600 italic leading-snug">
        Each band is one of the blob's chromosomes. Genes are placed at their
        real position on the chromosome (measured in <span className="font-mono">cM</span>) —
        closer positions mean tighter linkage.
      </div>
      {groups.map(({ chromosome, genes }) => (
        <ChromosomeBand
          key={chromosome.id}
          chromosome={chromosome}
          genes={genes}
          unlockedTraits={unlockedTraits}
          onGeneClick={onGeneClick}
          focusGeneId={focusGeneId}
          chapterHintByTrait={chapterHintByTrait}
        />
      ))}
      <div className="text-[10px] text-stone-500 italic border-t border-stone-200 pt-3">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 border border-emerald-700 mr-1 align-middle" />
        Unlocked  ·
        <span className="inline-block w-2 h-2 rounded-full bg-stone-300 border border-stone-400 ml-2 mr-1 align-middle" />
        Locked (hover for the chapter that unlocks it)
      </div>
    </div>
  )
}

// -- Chromosome band -------------------------------------------------------

function ChromosomeBand({
  chromosome,
  genes,
  unlockedTraits,
  onGeneClick,
  focusGeneId,
  chapterHintByTrait,
}: {
  chromosome: Chromosome
  genes: Gene[]
  unlockedTraits: string[]
  onGeneClick?(geneId: string): void
  focusGeneId?: string
  chapterHintByTrait: Record<string, string>
}) {
  const trackHeightPct = (chromosome.lengthCM / 100) * 100
  // Sex chromosomes get a compact horizontal band regardless of true cM
  // length — mostly so the tiny Y (20 cM) isn't invisible next to the X.
  const displayWidth = chromosome.type.startsWith('sex-')
    ? Math.max(chromosome.lengthCM * 3, 60)
    : Math.max(chromosome.lengthCM * 3.2, 60)

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <div className="text-sm font-semibold text-stone-800 font-mono">
          {chromosome.id}
        </div>
        <div className="text-[10px] uppercase tracking-wide text-stone-500">
          {formatChromosomeType(chromosome.type)} · {chromosome.lengthCM} cM
        </div>
      </div>
      <div
        className="relative h-16 rounded-lg bg-stone-100 border border-stone-300"
        style={{ width: `${displayWidth}px`, maxWidth: '100%' }}
      >
        {/* Chromosome centre-line */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 rounded bg-stone-300" />
        {/* Gene markers */}
        {genes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] italic text-stone-500">
            (no genes assigned)
          </div>
        ) : (
          buildDistanceLabels(genes, unlockedTraits, chromosome).map((label, i) => (
            <div
              key={`dist-${i}`}
              className="absolute top-1/2 -translate-y-[calc(50%+16px)] -translate-x-1/2 text-[9px] font-mono text-indigo-700"
              style={{ left: `${label.leftPct}%` }}
              title={`${label.distanceCM} cM between ${label.g1Name} and ${label.g2Name}`}
            >
              {label.distanceCM} cM
            </div>
          ))
        )}
        {genes.length > 0 && (
          genes.map(g => {
            const isUnlocked = g.expressesTraits.some(t =>
              unlockedTraits.includes(t),
            )
            const isFocus = focusGeneId === g.id
            const leftPct = (g.locusCM / chromosome.lengthCM) * 100
            const lockedHint = !isUnlocked
              ? g.expressesTraits
                  .map(t => chapterHintByTrait[t])
                  .find(Boolean) ?? 'Locked'
              : ''
            return (
              <button
                key={g.id}
                onClick={() => onGeneClick?.(g.id)}
                disabled={!isUnlocked}
                title={
                  isUnlocked
                    ? `${g.name} · ${formatModel(g.inheritanceModel)} · locus ${g.locusCM} cM`
                    : `Locked gene at locus ${g.locusCM} cM · ${lockedHint}`
                }
                className={
                  'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-transform ' +
                  (isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed')
                }
                style={{ left: `${leftPct}%` }}
              >
                <div
                  className={
                    'w-3 h-3 rounded-full border-2 ' +
                    (isFocus
                      ? 'bg-amber-500 border-amber-700 ring-2 ring-amber-200'
                      : isUnlocked
                        ? 'bg-emerald-400 border-emerald-700'
                        : 'bg-stone-300 border-stone-400')
                  }
                />
                <div
                  className={
                    'mt-1 text-[9px] font-mono max-w-[54px] text-center leading-tight ' +
                    (isUnlocked ? 'text-stone-700' : 'text-stone-400 italic')
                  }
                >
                  {isUnlocked ? g.name : '???'}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

// -- Helpers ---------------------------------------------------------------

function groupByChromosome(chromosomes: Chromosome[], genes: Gene[]) {
  return chromosomes.map(chromosome => ({
    chromosome,
    genes: genes
      .filter(g => g.chromosome === chromosome.id)
      .sort((a, b) => a.locusCM - b.locusCM),
  }))
}

function formatChromosomeType(t: Chromosome['type']): string {
  switch (t) {
    case 'autosome': return 'autosome'
    case 'sex-X': return 'sex X'
    case 'sex-Y': return 'sex Y'
    case 'sex-Z': return 'sex Z'
    case 'sex-W': return 'sex W'
    case 'mitochondrial': return 'mitochondrial'
  }
}

// Compute the midpoint-x + cM distance labels between consecutive UNLOCKED
// gene pairs on a chromosome. Only show a label when both endpoints are
// unlocked — locked genes stay '???' anyway so their distances would be
// meaningless.
function buildDistanceLabels(
  genes: Gene[],
  unlockedTraits: string[],
  chromosome: Chromosome,
): Array<{
  leftPct: number
  distanceCM: number
  g1Name: string
  g2Name: string
}> {
  const out: Array<{
    leftPct: number
    distanceCM: number
    g1Name: string
    g2Name: string
  }> = []
  const isUnlocked = (g: Gene) =>
    g.expressesTraits.some(t => unlockedTraits.includes(t))
  const unlocked = genes.filter(isUnlocked).sort((a, b) => a.locusCM - b.locusCM)
  for (let i = 0; i < unlocked.length - 1; i++) {
    const g1 = unlocked[i]!
    const g2 = unlocked[i + 1]!
    const distanceCM = Math.abs(g2.locusCM - g1.locusCM)
    if (distanceCM === 0) continue
    const midCM = (g1.locusCM + g2.locusCM) / 2
    out.push({
      leftPct: (midCM / chromosome.lengthCM) * 100,
      distanceCM,
      g1Name: g1.name,
      g2Name: g2.name,
    })
  }
  return out
}

function formatModel(m: Gene['inheritanceModel']): string {
  return m.replace(/([A-Z])/g, ' $1').toLowerCase().trim()
}

// Silence "unused" if focusGeneId prop isn't wired up by a caller.
export type { Props as GeneticMapProps }
