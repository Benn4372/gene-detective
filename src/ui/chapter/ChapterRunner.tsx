import React, { useEffect, useMemo, useRef, useState } from 'react'
// (useState still used for local pool picks below)
import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies, chapterById, mentorById } from '../../content'
import type {
  Chapter,
  GuidedStage,
  ShowStage,
  SoloStage,
} from '../../content/types'
import type { ChapterStage } from '../../state/types'
import type { Creature } from '../../engine/types'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { BlobCard } from '../atoms/BlobCard'
import { Workbench } from '../workbench/Workbench'
import { PopulationSandbox } from '../population/PopulationSandbox'
import { KaryotypeViewer } from '../karyotype/KaryotypeViewer'
import { DNASequenceViewer } from '../dna/DNASequenceViewer'
import { MethylationExplorer } from '../methylation/MethylationExplorer'
import { SolveCelebration } from './SolveCelebration'
import {
  HeritabilityWidget,
  QTLScanWidget,
  ThreePointCrossWidget,
  ThresholdTraitWidget,
  CRISPREditorWidget,
  CancerSomaticWidget,
  GWASManhattanWidget,
  PhylogeneticsTreeWidget,
  ConservationWidget,
  HGTPlasmidWidget,
  PrionConformationWidget,
  ReactionNormWidget,
  TransgenerationalWidget,
  OperonWidget,
  TransposableElementWidget,
  CopyNumberWidget,
  ChimeraWidget,
} from '../researcher/ResearcherWidgets'
import { NotebookPanel } from './NotebookPanel'
import { AnswerPanel } from './AnswerPanel'

export function ChapterRunner() {
  const currentChapterId = useGameStore(s => s.currentChapterId)
  const currentChapterStage = useGameStore(s => s.currentChapterStage)
  const advance = useGameStore(s => s.advanceChapterStage)
  const complete = useGameStore(s => s.completeChapter)
  const exitChapter = useGameStore(s => s.exitChapter)
  const awardTrophyBlob = useGameStore(s => s.awardTrophyBlob)
  const chapterCreatures = useGameStore(s =>
    currentChapterId ? s.chapterCreatures[currentChapterId] : null,
  )

  const chapter = currentChapterId ? chapterById[currentChapterId] : null
  const mentor = chapter ? mentorById[chapter.mentorId] : null

  if (!chapter) return null

  const stages: ChapterStage[] = ['show', 'guided', 'solo', 'outro']
  const stageIndex = stages.indexOf(currentChapterStage)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={exitChapter}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Return to Station
        </button>
        <div className="text-xs uppercase tracking-widest text-stone-500">
          Chapter {chapter.order} · {chapter.concept}
        </div>
        <h1 className="text-3xl font-bold text-stone-800 font-serif mb-2">
          {chapter.title}
        </h1>

        {/* Stage indicator dots */}
        <div className="flex items-center gap-3 mb-6">
          {stages.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={
                  'w-3 h-3 rounded-full ' +
                  (i < stageIndex
                    ? 'bg-emerald-500'
                    : i === stageIndex
                      ? 'bg-amber-500 ring-2 ring-amber-200'
                      : 'bg-stone-300')
                }
                title={s}
              />
              {i < stages.length - 1 && (
                <div
                  className={
                    'w-6 h-0.5 ' +
                    (i < stageIndex ? 'bg-emerald-500' : 'bg-stone-300')
                  }
                />
              )}
            </div>
          ))}
          <div className="text-xs text-stone-500 uppercase tracking-wide ml-3">
            {currentChapterStage}
          </div>
        </div>

        {/* Stage content */}
        {currentChapterStage === 'show' && (
          <ShowStageView
            stage={chapter.stages.show}
            mentorPortrait={mentor?.emoji}
            mentorName={mentor?.name}
            storyIntro={chapter.storyIntro}
            onDone={() => advance('guided')}
          />
        )}

        {currentChapterStage === 'guided' && chapterCreatures && (
          renderInteractiveStage({
            chapter,
            stage: chapter.stages.guided,
            chapterCreatures,
            stageKey: 'guided',
            hintText: chapter.stages.guided.scaffolding.onOpen,
            onSolved: () => advance('solo'),
          })
        )}

        {currentChapterStage === 'solo' && chapterCreatures && (
          renderInteractiveStage({
            chapter,
            stage: chapter.stages.solo,
            chapterCreatures,
            stageKey: 'solo',
            hintText:
              chapter.interactionMode?.kind === 'population-sandbox'
                ? "Now try a different starting frequency. Same rules — new starting point."
                : undefined,
            onSolved: () => advance('outro'),
          })
        )}

        {currentChapterStage === 'outro' && chapterCreatures && (
          <OutroView
            chapter={chapter}
            mentorPortrait={mentor?.emoji}
            mentorName={mentor?.name}
            motherId={chapterCreatures.motherId}
            fatherId={chapterCreatures.fatherId}
            onDone={choice => {
              if (currentChapterId) {
                awardTrophyBlob(currentChapterId, choice)
                complete()
                exitChapter()
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

// Minimal markdown-bold renderer. Splits on '**' and wraps odd segments in
// <strong>. Used by story-intro/outro so mentor dialogue with **term**
// doesn't display raw asterisks.
function renderBold(text: string): React.ReactNode {
  return text.split('**').map((segment, i) =>
    i % 2 === 0 ? (
      <span key={i}>{segment}</span>
    ) : (
      <strong key={i} className="not-italic font-semibold">{segment}</strong>
    ),
  )
}

// -- Show stage ---------------------------------------------------------------

function ShowStageView({
  stage,
  mentorPortrait,
  mentorName,
  storyIntro,
  onDone,
}: {
  stage: ShowStage
  mentorPortrait?: string
  mentorName?: string
  storyIntro: string
  onDone(): void
}) {
  return (
    <div className="space-y-4">
      {/* Story intro */}
      {mentorPortrait && (
        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-4xl flex-shrink-0">{mentorPortrait}</div>
          <div>
            <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">
              {mentorName}
            </div>
            <div className="text-sm text-stone-800 whitespace-pre-line italic">
              {renderBold(storyIntro)}
            </div>
          </div>
        </div>
      )}

      {/* Concept body */}
      <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-6">
        <div className="text-stone-800 text-base leading-relaxed whitespace-pre-line font-serif">
          {stage.body.split('**').map((segment, i) =>
            i % 2 === 0 ? (
              <span key={i}>{segment}</span>
            ) : (
              <strong key={i}>{segment}</strong>
            ),
          )}
        </div>

        {/* Worked example */}
        {stage.workedExample && (
          <WorkedExample worked={stage.workedExample} />
        )}
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="px-6 py-3 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 shadow-sm"
        >
          Got it — next →
        </motion.button>
      </div>
    </div>
  )
}

function WorkedExample({
  worked,
}: {
  worked: NonNullable<ShowStage['workedExample']>
}) {
  const [step, setStep] = useState(0)
  const [pMother, pFather] = worked.parents

  // Show a tiny "example blob" pair with narration steps.
  const motherPreview: Creature = {
    id: 'demo-mother',
    speciesId: blobSpecies.id,
    sex: 'F',
    genotype: pMother,
    age: 0,
    scope: 'trophy',
  }
  const fatherPreview: Creature = {
    id: 'demo-father',
    speciesId: blobSpecies.id,
    sex: 'M',
    genotype: pFather,
    age: 0,
    scope: 'trophy',
  }

  // Compute one representative offspring genotype. Pick mother's FIRST
  // allele and father's SECOND allele per gene: for two-allele hetero pairs
  // (Tt × Tt, Aa × aa, etc.) this yields the modal outcome — the
  // heterozygote — which matches what the show-stage narration typically
  // walks the player through.
  const previewOffspring: Creature | null = useMemo(() => {
    const genotype: Record<string, string[]> = {}
    for (const gene of blobSpecies.genes) {
      const mA = pMother[gene.id]?.[0]
      const fA = pFather[gene.id]?.[1] ?? pFather[gene.id]?.[0]
      if (mA && fA) genotype[gene.id] = [mA, fA]
    }
    return {
      id: 'demo-offspring',
      speciesId: blobSpecies.id,
      sex: 'F',
      genotype,
      age: 0,
      scope: 'trophy',
    }
  }, [pMother, pFather])

  // Detect the focus gene(s) — those where the parents' alleles actually
  // differ (or one is heterozygous). Everything else is scaffolding and
  // doesn't need to appear in the Punnett.
  const focusGeneIds = useMemo(() => {
    const ids: string[] = []
    for (const gene of blobSpecies.genes) {
      const mA = pMother[gene.id]
      const fA = pFather[gene.id]
      if (!mA || !fA) continue
      const motherHet = mA.length >= 2 && mA[0] !== mA[1]
      const fatherHet = fA.length >= 2 && fA[0] !== fA[1]
      const different = mA.join('') !== fA.join('')
      if (motherHet || fatherHet || different) ids.push(gene.id)
    }
    return ids
  }, [pMother, pFather])

  return (
    <div className="mt-6 rounded-lg bg-stone-50 border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">
        Worked example
      </div>
      <div className="flex items-center justify-center gap-8 mb-3">
        <div className="flex flex-col items-center">
          <BlobRenderer creature={motherPreview} species={blobSpecies} size={72} />
          <div className="text-xs text-stone-500 mt-1">Mother ♀</div>
        </div>
        <div className="text-3xl text-stone-400">×</div>
        <div className="flex flex-col items-center">
          <BlobRenderer creature={fatherPreview} species={blobSpecies} size={72} />
          <div className="text-xs text-stone-500 mt-1">Father ♂</div>
        </div>
        <div className="text-3xl text-stone-400">→</div>
        {previewOffspring && (
          <div className="flex flex-col items-center">
            <BlobRenderer
              creature={previewOffspring}
              species={blobSpecies}
              size={72}
            />
            <div className="text-xs text-stone-500 mt-1">Offspring</div>
          </div>
        )}
      </div>

      {/* Progressive Punnett + notebook demo. Fills piece-by-piece as the
          player clicks Next → so the reader sees exactly what step of the
          reasoning each narration line corresponds to. */}
      {focusGeneIds.length > 0 &&
        // Skip the generic monohybrid/dihybrid grid for genes whose real
        // shape is fundamentally different (sex-linked X^A/Y notation,
        // mitochondrial mother-only inheritance). Those chapters lean on
        // the story-intro dialogue in the show stage and the specialised
        // renderer inside the guided/solo notebook.
        !focusGeneIds.some(id => {
          const gene = blobSpecies.genes.find(g => g.id === id)
          return (
            gene?.inheritanceModel === 'sexLinked' ||
            gene?.inheritanceModel === 'mitochondrial'
          )
        }) && (
          <ShowStagePunnett
            focusGeneIds={focusGeneIds}
            motherGenotype={pMother}
            fatherGenotype={pFather}
            step={step}
          />
        )}

      <div className="text-sm text-stone-800 italic text-center min-h-[3em] mt-3">
        {worked.narration[step]}
      </div>
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="text-xs text-stone-500 hover:text-stone-800 disabled:opacity-40"
        >
          ← previous
        </button>
        <div className="text-xs text-stone-500">
          Step {step + 1} of {worked.narration.length}
        </div>
        <button
          onClick={() =>
            setStep(Math.min(worked.narration.length - 1, step + 1))
          }
          disabled={step === worked.narration.length - 1}
          className="text-xs text-stone-500 hover:text-stone-800 disabled:opacity-40"
        >
          next →
        </button>
      </div>
    </div>
  )
}

// Demonstration Punnett grid + notebook line that fills progressively as the
// player advances through the Show stage's worked-example narration.
//
// Step 0: empty grid + empty notebook lines
// Step 1: notebook + Punnett side headers fill with the mother's alleles
// Step 2: notebook + Punnett top headers fill with the father's alleles
// Step 3+: body cells fill with the combined genotypes
//
// Handles monohybrid (1 focus gene → 2×2 grid) and dihybrid (2 focus genes
// → 4×4 grid with two-letter gametes). Non-interactive by design — this is
// the tutorial demonstration, not a puzzle.
function ShowStagePunnett({
  focusGeneIds,
  motherGenotype,
  fatherGenotype,
  step,
}: {
  focusGeneIds: string[]
  motherGenotype: Record<string, string[]>
  fatherGenotype: Record<string, string[]>
  step: number
}) {
  const showMotherHeaders = step >= 1
  const showFatherHeaders = step >= 2
  const showBodyCells = step >= 3

  // Only monohybrid + dihybrid supported for now. Everything else falls back
  // to just showing the notebook line without a grid.
  const isDihybrid = focusGeneIds.length >= 2

  if (isDihybrid) {
    const [g1, g2] = focusGeneIds
    const mA = motherGenotype[g1!] ?? []
    const mB = motherGenotype[g2!] ?? []
    const fA = fatherGenotype[g1!] ?? []
    const fB = fatherGenotype[g2!] ?? []
    const motherGametes: string[] = []
    for (const a of mA) for (const b of mB) motherGametes.push(a + b)
    const fatherGametes: string[] = []
    for (const a of fA) for (const b of fB) fatherGametes.push(a + b)
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <NotebookLine
          label="Mother"
          filled={showMotherHeaders}
          text={`gametes: ${motherGametes.join(', ')}`}
        />
        <NotebookLine
          label="Father"
          filled={showFatherHeaders}
          text={`gametes: ${fatherGametes.join(', ')}`}
        />
        <div className="mt-3 flex justify-center">
          <table className="border-separate border-spacing-1 text-center">
            <thead>
              <tr>
                <th className="w-10 h-8"></th>
                {fatherGametes.map((g, i) => (
                  <th
                    key={i}
                    className="w-12 h-8 rounded bg-sky-50 border border-sky-200 text-sm font-mono"
                  >
                    {showFatherHeaders ? g : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {motherGametes.map((mg, ri) => (
                <tr key={ri}>
                  <th className="w-10 h-12 rounded bg-rose-50 border border-rose-200 text-sm font-mono">
                    {showMotherHeaders ? mg : ''}
                  </th>
                  {fatherGametes.map((fg, ci) => (
                    <td
                      key={ci}
                      className="w-12 h-12 rounded bg-stone-50 border border-stone-200 text-[10px] font-mono"
                    >
                      {showBodyCells ? combineGametes(mg, fg) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Monohybrid.
  const g = focusGeneIds[0]!
  const mA = motherGenotype[g] ?? []
  const fA = fatherGenotype[g] ?? []
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <NotebookLine
        label="Mother"
        filled={showMotherHeaders}
        text={`alleles: ${mA.join(', ')}`}
      />
      <NotebookLine
        label="Father"
        filled={showFatherHeaders}
        text={`alleles: ${fA.join(', ')}`}
      />
      <div className="mt-3 flex justify-center">
        <table className="border-separate border-spacing-1 text-center">
          <thead>
            <tr>
              <th className="w-10 h-10"></th>
              {(fA.length >= 2 ? [fA[0]!, fA[1]!] : [fA[0]!, fA[0]!]).map((a, i) => (
                <th
                  key={i}
                  className="w-14 h-10 rounded bg-sky-50 border border-sky-200 text-lg font-mono"
                >
                  {showFatherHeaders ? a : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(mA.length >= 2 ? [mA[0]!, mA[1]!] : [mA[0]!, mA[0]!]).map((a, ri) => (
              <tr key={ri}>
                <th className="w-10 h-14 rounded bg-rose-50 border border-rose-200 text-lg font-mono">
                  {showMotherHeaders ? a : ''}
                </th>
                {(fA.length >= 2 ? [fA[0]!, fA[1]!] : [fA[0]!, fA[0]!]).map((f, ci) => (
                  <td
                    key={ci}
                    className="w-14 h-14 rounded bg-stone-50 border border-stone-200 text-sm font-mono"
                  >
                    {showBodyCells ? sortByDominance(a, f) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NotebookLine({
  label,
  filled,
  text,
}: {
  label: string
  filled: boolean
  text: string
}) {
  return (
    <div className="flex items-baseline gap-2 border-b border-dashed border-stone-200 py-1">
      <span className="text-xs text-stone-500 w-14">{label}</span>
      <span className="text-sm font-mono text-stone-800 flex-1">
        {filled ? text : ''}
      </span>
    </div>
  )
}

function sortByDominance(a: string, b: string): string {
  // Uppercase (dominant) first, lowercase last, alphabetic tiebreak.
  const rank = (c: string) => (c === c.toUpperCase() ? 0 : 1)
  const [x, y] = [a, b].sort((p, q) => rank(p) - rank(q) || p.localeCompare(q))
  return x! + y!
}

function combineGametes(g1: string, g2: string): string {
  // Zip the two gametes gene-by-gene and sort each pair by dominance.
  const out: string[] = []
  const n = Math.min(g1.length, g2.length)
  for (let i = 0; i < n; i++) {
    out.push(sortByDominance(g1[i]!, g2[i]!))
  }
  return out.join('')
}

// -- Guided / Solo / Master stages (all Workbench + Notebook) --------------

interface StageWithWorkbenchProps {
  chapter: Chapter
  stage: GuidedStage | SoloStage
  chapterCreatures: { motherId: string; fatherId: string }
  stageKey: 'guided' | 'solo'
  onSolved(): void
  hintText?: string
}

function StageWithWorkbench({
  chapter: _chapter,
  stage,
  chapterCreatures,
  stageKey,
  onSolved,
  hintText,
}: StageWithWorkbenchProps) {
  const validated = useGameStore(s => s.validated)
  const creatures = useGameStore(s => s.creatures)
  const currentChapterId = useGameStore(s => s.currentChapterId)
  const crossHistory = useGameStore(s => s.crossHistory)
  // The Final Answer panel only appears once the player has bred at least
  // once — evidence-before-commitment.
  const hasBred = useMemo(
    () =>
      crossHistory.some(
        r =>
          r.motherId === chapterCreatures.motherId ||
          r.fatherId === chapterCreatures.fatherId,
      ),
    [crossHistory, chapterCreatures],
  )
  const [motherPick, setMotherPick] = useState<string | null>(
    chapterCreatures.motherId,
  )
  const [fatherPick, setFatherPick] = useState<string | null>(
    chapterCreatures.fatherId,
  )

  // answerGeneIds = the genes the player MUST solve (correctAssertions).
  // visibleGeneIds = answer genes plus any supporting genes the chapter
  // declared for context (e.g. Ch 9 shows 'tail' alongside 'tailGrowth' so
  // the epistasis interaction is legible in the offspring tally, even
  // though the player only answers for tailGrowth).
  const answerGeneIds = useMemo(
    () => [...new Set(stage.correctAssertions.map(a => a.geneId))],
    [stage],
  )
  const geneIds = useMemo(
    () => [
      ...new Set([
        ...answerGeneIds,
        ...('supportingGeneIds' in stage ? stage.supportingGeneIds ?? [] : []),
      ]),
    ],
    [answerGeneIds, stage],
  )

  const pool: Creature[] = useMemo(
    () =>
      currentChapterId
        ? Object.values(creatures).filter(
            c =>
              typeof c.scope !== 'string' &&
              c.scope.kind === 'chapter' &&
              c.scope.chapterId === currentChapterId,
          )
        : [],
    [creatures, currentChapterId],
  )

  // All correct assertions validated → advance
  const allSolved = useMemo(() => {
    return stage.correctAssertions.every(a => {
      const cId =
        a.creatureRole === 'mother'
          ? chapterCreatures.motherId
          : chapterCreatures.fatherId
      return validated[cId]?.[a.geneId]
    })
  }, [stage, validated, chapterCreatures])

  // Pin callback in a ref so the effect doesn't tear down / rebuild.
  const onSolvedRef = useRef(onSolved)
  onSolvedRef.current = onSolved
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const openedRef = useRef(false)
  useEffect(() => {
    if (allSolved && !openedRef.current) {
      openedRef.current = true
      setCelebrationOpen(true)
    }
  }, [allSolved])

  const punnettUnlocked = useGameStore(s =>
    s.unlockedTools.includes('punnett-2x2'),
  )

  const litter = 'litterSize' in stage ? stage.litterSize : 6
  const soloHints = stageKey === 'solo' && 'hints' in stage ? stage.hints : []

  return (
    <div className="space-y-4">
      {hintText && (
        <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {hintText}
        </div>
      )}
      {soloHints.length > 0 && (
        <SoloHintsPanel
          hints={soloHints}
          chapterId={currentChapterId ?? ''}
        />
      )}

      {/* Mystery pair — small cards */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-stone-500 mb-1">Mother (mystery)</div>
          <BlobCard
            creature={creatures[chapterCreatures.motherId]!}
            visibleTraitIds={geneIds}
            size={80}
          />
        </div>
        <div>
          <div className="text-xs text-stone-500 mb-1">Father (mystery)</div>
          <BlobCard
            creature={creatures[chapterCreatures.fatherId]!}
            visibleTraitIds={geneIds}
            size={80}
          />
        </div>
      </div>

      {/* Notebook (freeform guess + notes + live Punnett) comes FIRST — it's
          the reasoning surface, and the Punnett square rides inside it so it
          stays visible alongside the guesses instead of splitting after each
          breed. Workbench sits below: bench, latest litter, execute. */}
      <NotebookPanel
        motherId={chapterCreatures.motherId}
        fatherId={chapterCreatures.fatherId}
        geneIds={geneIds}
        answerGeneIds={answerGeneIds}
        showPunnett={punnettUnlocked}
      />

      <Workbench
        pool={pool}
        motherId={motherPick}
        fatherId={fatherPick}
        onSelectMother={setMotherPick}
        onSelectFather={setFatherPick}
        visibleGeneIds={geneIds}
        litterSize={litter}
      />

      {/* Final Answer only appears once a litter is on the bench — nothing
          to commit against before evidence exists. */}
      {hasBred && (
        <AnswerPanel
          motherId={chapterCreatures.motherId}
          fatherId={chapterCreatures.fatherId}
          geneIds={answerGeneIds}
          correctAssertions={stage.correctAssertions}
          guidedScaffolding={
            stageKey === 'guided' && 'scaffolding' in stage
              ? stage.scaffolding
              : undefined
          }
        />
      )}

      <SolveCelebration
        open={celebrationOpen}
        assertions={stage.correctAssertions}
        onNext={() => {
          setCelebrationOpen(false)
          onSolvedRef.current()
        }}
      />
    </div>
  )
}

// Progressive-reveal hint bank for solo stages. Starts collapsed with just
// a "Need a hint?" button; each click reveals the next escalating hint
// (reframe → point → suggest). No penalty — the game just doesn't offer
// hints unless the player asks.
function SoloHintsPanel({
  hints,
  chapterId,
}: {
  hints: import('../../content/types').Hint[]
  chapterId: string
}) {
  // Persist "how many hints have I unlocked?" per chapter — reopening the
  // solo stage keeps whatever the player has already seen.
  const shown = useGameStore(s => s.hintsShownForChapter[chapterId] ?? 0)
  const showNextHint = useGameStore(s => s.showNextHint)
  const canReveal = shown < hints.length
  return (
    <div className="rounded-lg bg-amber-50/40 border border-amber-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-widest text-amber-700">
          Hints
        </div>
        {canReveal ? (
          <button
            onClick={() => showNextHint(chapterId)}
            className="text-xs px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600"
          >
            {shown === 0 ? '💡 Need a hint?' : '💡 Next hint'}
          </button>
        ) : (
          <span className="text-xs italic text-amber-800">All hints shown</span>
        )}
      </div>
      {shown === 0 ? (
        <div className="text-xs italic text-amber-800/80">
          Stuck? Reveal hints one at a time — no penalty.
        </div>
      ) : (
        <ol className="space-y-1 text-sm text-amber-900 list-decimal list-inside">
          {hints.slice(0, shown).map((h, i) => (
            <li key={i}>
              <span className="uppercase tracking-widest text-[9px] text-amber-700 mr-1">
                {h.stage}
              </span>
              {h.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// -- Interactive stage dispatcher ----------------------------------------

function renderInteractiveStage(args: {
  chapter: Chapter
  stage: GuidedStage | SoloStage
  chapterCreatures: { motherId: string; fatherId: string }
  stageKey: 'guided' | 'solo'
  hintText?: string
  onSolved(): void
}) {
  const { chapter, stage, chapterCreatures, stageKey, hintText, onSolved } = args
  const mode = chapter.interactionMode
  if (mode?.kind === 'population-sandbox') {
    return (
      <StageWithSandbox
        hintText={hintText ?? 'Run generations. Observe the force at work.'}
        interactionMode={mode}
        onSolved={onSolved}
      />
    )
  }
  if (mode?.kind === 'karyotype') {
    return (
      <StageWithKaryotype
        hintText={hintText ?? 'Compare the affected chromosome bars to the healthy ones.'}
        interactionMode={mode}
        onSolved={onSolved}
      />
    )
  }
  if (mode?.kind === 'dna-sequence') {
    return (
      <StageWithDNASequence
        hintText={hintText ?? 'Step through each mutation type and read the consequence.'}
        interactionMode={mode}
        onSolved={onSolved}
      />
    )
  }
  if (mode?.kind === 'methylation') {
    return (
      <StageWithMethylation
        hintText={hintText ?? 'Toggle methylation. See the offspring phenotype flip.'}
        interactionMode={mode}
        onSolved={onSolved}
      />
    )
  }
  if (mode?.kind === 'researcher-widget') {
    return (
      <StageWithResearcherWidget
        hintText={hintText ?? 'Explore the model. Advance when ready.'}
        interactionMode={mode}
        onSolved={onSolved}
      />
    )
  }
  return (
    <StageWithWorkbench
      chapter={chapter}
      stage={stage}
      chapterCreatures={chapterCreatures}
      stageKey={stageKey}
      hintText={hintText}
      onSolved={onSolved}
    />
  )
}

// -- Karyotype stage -----------------------------------------------------

function StageWithKaryotype({
  hintText,
  interactionMode,
  onSolved,
}: {
  hintText: string
  interactionMode: Extract<NonNullable<Chapter['interactionMode']>, { kind: 'karyotype' }>
  onSolved(): void
}) {
  const advancedRef = useRef(false)
  const [acknowledged, setAcknowledged] = useState(false)
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        {hintText}
      </div>
      <KaryotypeViewer states={interactionMode.states} />
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (advancedRef.current) return
            advancedRef.current = true
            setAcknowledged(true)
            setTimeout(() => onSolved(), 500)
          }}
          disabled={acknowledged}
          className={
            'px-5 py-2 rounded-lg text-white font-medium shadow-sm ' +
            (acknowledged ? 'bg-stone-400' : 'bg-emerald-600 hover:bg-emerald-700')
          }
        >
          {acknowledged ? '✓ Advancing…' : 'I read the karyotype →'}
        </motion.button>
      </div>
    </div>
  )
}

// -- DNA-sequence stage --------------------------------------------------

function StageWithDNASequence({
  hintText,
  interactionMode,
  onSolved,
}: {
  hintText: string
  interactionMode: Extract<NonNullable<Chapter['interactionMode']>, { kind: 'dna-sequence' }>
  onSolved(): void
}) {
  const advancedRef = useRef(false)
  const [acknowledged, setAcknowledged] = useState(false)
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        {hintText}
      </div>
      <DNASequenceViewer variants={interactionMode.variants} />
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (advancedRef.current) return
            advancedRef.current = true
            setAcknowledged(true)
            setTimeout(() => onSolved(), 500)
          }}
          disabled={acknowledged}
          className={
            'px-5 py-2 rounded-lg text-white font-medium shadow-sm ' +
            (acknowledged ? 'bg-stone-400' : 'bg-emerald-600 hover:bg-emerald-700')
          }
        >
          {acknowledged ? '✓ Advancing…' : 'I read the sequences →'}
        </motion.button>
      </div>
    </div>
  )
}

// -- Researcher widget stage ---------------------------------------------

function StageWithResearcherWidget({
  hintText,
  interactionMode,
  onSolved,
}: {
  hintText: string
  interactionMode: Extract<NonNullable<Chapter['interactionMode']>, { kind: 'researcher-widget' }>
  onSolved(): void
}) {
  const advancedRef = useRef(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const Widget = pickResearcherWidget(interactionMode.widget)
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        {hintText}
      </div>
      <Widget />
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (advancedRef.current) return
            advancedRef.current = true
            setAcknowledged(true)
            setTimeout(() => onSolved(), 500)
          }}
          disabled={acknowledged}
          className={
            'px-5 py-2 rounded-lg text-white font-medium shadow-sm ' +
            (acknowledged ? 'bg-stone-400' : 'bg-emerald-600 hover:bg-emerald-700')
          }
        >
          {acknowledged ? '✓ Advancing…' : 'Explored — continue →'}
        </motion.button>
      </div>
    </div>
  )
}

function pickResearcherWidget(name: string) {
  switch (name) {
    case 'heritability': return HeritabilityWidget
    case 'qtl-scan': return QTLScanWidget
    case 'three-point-cross': return ThreePointCrossWidget
    case 'threshold-trait': return ThresholdTraitWidget
    case 'crispr-editor': return CRISPREditorWidget
    case 'cancer-somatic': return CancerSomaticWidget
    case 'gwas-manhattan': return GWASManhattanWidget
    case 'phylogenetics-tree': return PhylogeneticsTreeWidget
    case 'conservation-rescue': return ConservationWidget
    case 'hgt-plasmid': return HGTPlasmidWidget
    case 'prion-conformation': return PrionConformationWidget
    case 'reaction-norm': return ReactionNormWidget
    case 'transgenerational': return TransgenerationalWidget
    case 'operon': return OperonWidget
    case 'transposable-element': return TransposableElementWidget
    case 'copy-number': return CopyNumberWidget
    case 'chimera': return ChimeraWidget
    default:
      // Fallback: a small "coming soon" panel.
      return () => (
        <div className="rounded-lg bg-white border border-stone-300 p-4 text-sm text-stone-600 italic">
          Interactive widget for this chapter is coming in a later polish
          pass. The chapter text carries the concept.
        </div>
      )
  }
}

// -- Methylation stage ---------------------------------------------------

function StageWithMethylation({
  hintText,
  interactionMode,
  onSolved,
}: {
  hintText: string
  interactionMode: Extract<NonNullable<Chapter['interactionMode']>, { kind: 'methylation' }>
  onSolved(): void
}) {
  const advancedRef = useRef(false)
  const [acknowledged, setAcknowledged] = useState(false)
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        {hintText}
      </div>
      <MethylationExplorer
        focusGeneId={interactionMode.focusGeneId}
        motherGenotype={interactionMode.motherGenotype}
        fatherGenotype={interactionMode.fatherGenotype}
      />
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (advancedRef.current) return
            advancedRef.current = true
            setAcknowledged(true)
            setTimeout(() => onSolved(), 500)
          }}
          disabled={acknowledged}
          className={
            'px-5 py-2 rounded-lg text-white font-medium shadow-sm ' +
            (acknowledged ? 'bg-stone-400' : 'bg-emerald-600 hover:bg-emerald-700')
          }
        >
          {acknowledged ? '✓ Advancing…' : 'I understand →'}
        </motion.button>
      </div>
    </div>
  )
}

// -- Population sandbox stage --------------------------------------------

function StageWithSandbox({
  hintText,
  interactionMode,
  onSolved,
}: {
  hintText: string
  interactionMode: Extract<NonNullable<Chapter['interactionMode']>, { kind: 'population-sandbox' }>
  onSolved(): void
}) {
  const advancedRef = useRef(false)
  const [solved, setSolved] = useState(false)
  const handleFullyExplored = () => {
    if (advancedRef.current) return
    advancedRef.current = true
    setSolved(true)
    setTimeout(() => onSolved(), 900)
  }
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
        {hintText}
      </div>
      <PopulationSandbox
        focusGeneId={interactionMode.focusGeneId}
        initialDominantFreq={interactionMode.initialDominantFreq}
        populationSize={interactionMode.populationSize}
        generationsToExplore={interactionMode.generationsToExplore}
        force={interactionMode.force}
        onFullyExplored={handleFullyExplored}
      />
      {solved && (
        <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-300 text-emerald-800">
          ✓ Enough runs to see the pattern. Advancing…
        </div>
      )}
    </div>
  )
}

// -- Outro -----------------------------------------------------------------

function OutroView({
  chapter,
  mentorPortrait,
  mentorName,
  motherId,
  fatherId,
  onDone,
}: {
  chapter: Chapter
  mentorPortrait?: string
  mentorName?: string
  motherId: string
  fatherId: string
  onDone(chosenBlobId: string): void
}) {
  const creatures = useGameStore(s => s.creatures)
  const mother = creatures[motherId]
  const father = creatures[fatherId]
  const [pick, setPick] = useState<string>(motherId)

  // Preset overrides player choice. When a chapter declares its trophy blob
  // (typically a story-relevant blob, not the mystery pair), skip the picker
  // and just complete on click.
  const hasPreset = !!chapter.trophyBlobPreset

  return (
    <div className="space-y-6">
      {mentorPortrait && (
        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-4xl flex-shrink-0">{mentorPortrait}</div>
          <div>
            <div className="text-xs uppercase tracking-wide text-amber-700 mb-1">
              {mentorName}
            </div>
            <div className="text-sm text-stone-800 whitespace-pre-line italic">
              {renderBold(chapter.storyOutro)}
            </div>
          </div>
        </div>
      )}

      {/* Small "you just learned" callout so the chapter has a satisfying
          landing before trophy-picking. */}
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
        <div className="text-xs uppercase tracking-widest text-emerald-700 mb-1">
          You just learned
        </div>
        <div className="text-sm font-semibold text-stone-800 font-serif">
          {chapter.concept}
        </div>
        {(chapter.unlocks.traits?.length ||
          chapter.unlocks.tools?.length ||
          chapter.unlocks.mentors?.length) && (
          <div className="text-xs text-emerald-900 mt-2 space-x-1">
            <span className="uppercase tracking-widest text-emerald-700 text-[10px]">
              Unlocks
            </span>{' '}
            {chapter.unlocks.traits?.map(t => (
              <span
                key={t}
                className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 font-mono text-[10px]"
              >
                {t}
              </span>
            ))}
            {chapter.unlocks.tools?.map(t => (
              <span
                key={t}
                className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 font-mono text-[10px]"
              >
                {t}
              </span>
            ))}
            {chapter.unlocks.mentors?.map(m => (
              <span
                key={m}
                className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 font-mono text-[10px]"
              >
                mentor: {m}
              </span>
            ))}
          </div>
        )}
        {(() => {
          const nextId = chapter.unlocks.nextChapterId
          if (!nextId) return null
          const next = chapterById[nextId]
          if (!next) return null
          return (
            <div className="text-xs text-emerald-900 mt-3 pt-3 border-t border-emerald-200">
              <span className="uppercase tracking-widest text-emerald-700 text-[10px]">
                Up next
              </span>{' '}
              <span className="italic">
                Ch {next.order} · {next.title} — {next.concept}
              </span>
            </div>
          )
        })()}
      </div>

      {hasPreset ? (
        <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          <span className="font-semibold">Trophy prepared:</span>{' '}
          <span className="italic">
            {chapter.trophyBlobPreset!.defaultName}
          </span>{' '}
          will take a spot on your shelf when you complete this chapter.
        </div>
      ) : (
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
            Choose a blob for the Trophy Shelf
          </div>
          <div className="text-xs text-stone-600 mb-3 italic">
            Which of the mystery pair will you keep as this chapter's trophy?
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mother && (
              <BlobCard
                creature={mother}
                selected={pick === motherId}
                onClick={() => setPick(motherId)}
                visibleTraitIds={chapter.stages.solo.correctAssertions.map(
                  a => a.geneId,
                )}
              />
            )}
            {father && (
              <BlobCard
                creature={father}
                selected={pick === fatherId}
                onClick={() => setPick(fatherId)}
                visibleTraitIds={chapter.stages.solo.correctAssertions.map(
                  a => a.geneId,
                )}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDone(pick)}
          className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm"
        >
          Complete chapter & return →
        </motion.button>
      </div>
    </div>
  )
}
