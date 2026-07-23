import React, { useEffect, useMemo, useRef, useState } from 'react'
// (useState still used for local pool picks below)
import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies, chapterById, mentorById } from '../../content'
import type {
  Chapter,
  GuidedStage,
  MasterStage,
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

  const stages: ChapterStage[] = ['show', 'guided', 'solo']
  if (chapter.stages.master) stages.push('master')
  stages.push('outro')
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
            onSolved: () => advance(chapter.stages.master ? 'master' : 'outro'),
          })
        )}

        {currentChapterStage === 'master' &&
          chapter.stages.master &&
          chapterCreatures && (
            <StageWithWorkbench
              chapter={chapter}
              stage={chapter.stages.master}
              chapterCreatures={chapterCreatures}
              stageKey="master"
              onSolved={() => advance('outro')}
              hintText={`Efficiency challenge — try to solve in ${chapter.stages.master.breedBudget} crosses or fewer.`}
            />
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
  // (Rw × Rw, Aa × aa, etc.) this yields the modal outcome — the
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
      <div className="text-sm text-stone-800 italic text-center min-h-[3em]">
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

// -- Guided / Solo / Master stages (all Workbench + Notebook) --------------

interface StageWithWorkbenchProps {
  chapter: Chapter
  stage: GuidedStage | SoloStage | MasterStage
  chapterCreatures: { motherId: string; fatherId: string }
  stageKey: 'guided' | 'solo' | 'master'
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
  const [motherPick, setMotherPick] = useState<string | null>(
    chapterCreatures.motherId,
  )
  const [fatherPick, setFatherPick] = useState<string | null>(
    chapterCreatures.fatherId,
  )

  const geneIds = useMemo(
    () => [...new Set(stage.correctAssertions.map(a => a.geneId))],
    [stage],
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

  // Pin callback + guard in refs so the effect isn't at the mercy of dep
  // churn. cleanup would cancel the setTimeout during the very re-render that
  // schedules it, so we skip cleanup and rely on the ref to prevent double-fire.
  const onSolvedRef = useRef(onSolved)
  onSolvedRef.current = onSolved
  const advancedRef = useRef(false)
  useEffect(() => {
    if (allSolved && !advancedRef.current) {
      advancedRef.current = true
      setTimeout(() => onSolvedRef.current(), 900)
    }
  }, [allSolved])

  const litter = 'litterSize' in stage ? stage.litterSize : 6
  const breedBudgetHint =
    stageKey === 'master' && 'breedBudget' in stage
      ? `Master target: ≤${stage.breedBudget} crosses`
      : undefined

  return (
    <div className="space-y-4">
      {hintText && (
        <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {hintText}
        </div>
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

      <NotebookPanel
        motherId={chapterCreatures.motherId}
        fatherId={chapterCreatures.fatherId}
        geneIds={geneIds}
        guidedScaffolding={
          stageKey === 'guided' && 'scaffolding' in stage
            ? stage.scaffolding
            : undefined
        }
      />

      <Workbench
        pool={pool}
        motherId={motherPick}
        fatherId={fatherPick}
        onSelectMother={setMotherPick}
        onSelectFather={setFatherPick}
        visibleGeneIds={geneIds}
        litterSize={litter}
        breedBudgetHint={breedBudgetHint}
      />

      {allSolved && (
        <div className="rounded-lg p-4 bg-emerald-50 border border-emerald-300 text-emerald-800">
          ✓ Solved! Advancing to the next stage…
        </div>
      )}
    </div>
  )
}

// -- Interactive stage dispatcher ----------------------------------------

function renderInteractiveStage(args: {
  chapter: Chapter
  stage: GuidedStage | SoloStage | MasterStage
  chapterCreatures: { motherId: string; fatherId: string }
  stageKey: 'guided' | 'solo' | 'master'
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
