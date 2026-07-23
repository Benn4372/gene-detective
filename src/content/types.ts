import type { Genotype, Sex } from '../engine/types'

// -- Glossary --------------------------------------------------------------

export interface GlossaryTerm {
  id: string
  name: string
  overview: string
  fullArticle: string
  relatedTerms?: string[]
}

// -- Common bits used across chapters and missions -------------------------

export interface LessonStarterCreature {
  role: 'mother' | 'father'
  sex: Sex
  genotype: Genotype
  defaultName: string
}

export interface LabStarterCreature {
  sex: Sex
  genotype: Genotype
  defaultName: string
}

export interface NotebookAssertion {
  creatureRole: 'mother' | 'father'
  geneId: string
  correctGenotype: string
}

export interface Hint {
  stage: 'reframe' | 'point' | 'suggest'
  text: string
}

// -- Chapter (4-stage learning) --------------------------------------------

export type ChapterTier = 'curious' | 'student' | 'researcher'

// Stage 1: explicit teaching. Text + optional animated worked-example demo.
export interface ShowStage {
  body: string
  workedExample?: {
    parents: [Genotype, Genotype]
    narration: string[] // step-by-step captions
  }
}

// Stage 2: puzzle with heavy scaffolding.
export interface GuidedStage {
  starterCreatures: LessonStarterCreature[]
  correctAssertions: NotebookAssertion[]
  litterSize: number
  scaffolding: {
    onOpen: string
    // Keyed by "creatureRole:geneId:wrongGenotype" → explanation
    onWrongHypothesis: Record<string, string>
  }
}

// Stage 3: puzzle without scaffolding.
export interface SoloStage {
  starterCreatures: LessonStarterCreature[]
  correctAssertions: NotebookAssertion[]
  litterSize: number
  validationTier: 'loose' | 'medium' | 'strict'
  hints: Hint[]
}

// Stage 4 (optional): harder variant with a breed budget.
export interface MasterStage {
  starterCreatures: LessonStarterCreature[]
  correctAssertions: NotebookAssertion[]
  litterSize: number
  breedBudget: number
  rewardAlleleId?: string
  rewardMentorDialogue?: string
}

export interface Chapter {
  id: string
  order: number
  tier: ChapterTier
  concept: string // one-line summary
  title: string
  pinnedGlossaryTerms: string[]
  mentorId: string
  storyIntro: string
  storyOutro: string
  stages: {
    show: ShowStage
    guided: GuidedStage
    solo: SoloStage
    master?: MasterStage
  }
  unlocks: {
    traits?: string[]
    alleles?: string[]
    tools?: string[]
    mentors?: string[]
    nextChapterId?: string
  }
  // Optional preset used when the Trophy Shelf awards this chapter's blob;
  // if absent, the player's solo-stage mother is used as the trophy.
  trophyBlobPreset?: LabStarterCreature
  // Optional custom interaction mode. When set, the Chapter Runner swaps out
  // its default Workbench for the specified mode's UI.
  interactionMode?:
    | {
        kind: 'population-sandbox'
        focusGeneId: string
        initialDominantFreq: number
        populationSize?: number
        generationsToExplore?: number
        // From Ch 30 onward: what evolutionary force is active in this
        // simulation. Undefined = plain random-mating drift (Ch 12).
        force?:
          | 'drift'
          | 'founder'
          | 'migration'
          | 'selection'
          | 'balancing'
          | 'assortative'
          | 'inbreeding'
          | 'hybrid-vigor'
          | 'speciation'
      }
    | {
        kind: 'karyotype'
        // Chromosome-id → aberration state override.
        states: Record<string, 'normal' | 'trisomy' | 'monosomy' | 'deletion' | 'duplication' | 'translocation' | 'inversion'>
      }
    | {
        kind: 'dna-sequence'
        // Show a sequence of mutation types (label → before → after).
        variants: Array<{
          label: string
          before: string
          after: string
          consequence: string
        }>
      }
    | {
        kind: 'pedigree'
        // Nodes with parent references + phenotype flags. Player deduces genotype.
        nodes: Array<{
          id: string
          parents?: [string, string]
          sex: 'M' | 'F'
          affected: boolean
          note?: string
        }>
      }
    | {
        kind: 'methylation'
        // Which gene the mother can methylate, and the genotype context.
        focusGeneId: string
        motherGenotype: string[]
        fatherGenotype: string[]
      }
    | {
        kind: 'researcher-widget'
        widget:
          | 'heritability'
          | 'qtl-scan'
          | 'three-point-cross'
          | 'threshold-trait'
          | 'crispr-editor'
          | 'cancer-somatic'
          | 'gwas-manhattan'
          | 'phylogenetics-tree'
          | 'conservation-rescue'
          | 'hgt-plasmid'
          | 'prion-conformation'
          | 'reaction-norm'
          | 'transposable-element'
          | 'copy-number'
          | 'chimera'
          | 'operon'
          | 'transgenerational'
      }
}

// -- Mission ---------------------------------------------------------------

export type MissionMode = 'breed' | 'predict-only' | 'deduce-only'

export interface Mission {
  id: string
  chapterTier: ChapterTier
  // Player must have completed at least this many chapters to see this
  // mission on the board.
  minCompletedChapters: number
  clientCharacterId: string
  clientBrief: string
  targetPhenotype: Record<string, string>
  visibleGeneIds: string[]
  labStarters: [LabStarterCreature, LabStarterCreature]
  breedBudget?: number // undefined = unlimited (still solvable, no ★ though)
  mode: MissionMode
  rewardPreviewText: string
  // For deduce-only missions: the pedigree the player analyzes, plus the
  // correct answers for each node the player must fill in.
  deducePedigree?: {
    focusGeneId: string
    nodes: Array<{
      id: string
      parents?: [string, string]
      sex: 'M' | 'F'
      affected: boolean
      note?: string
    }>
    correctGenotypes: Record<string, string>
  }
  // For predict-only missions: the player types a phenotype-frequency
  // prediction and compares to the expected values.
  predictPrompt?: {
    focusGeneId: string
    // Genotype pair the puzzle uses; predictions are compared against the
    // Punnett-derived phenotype frequencies for this pair.
    motherGenotype: string
    fatherGenotype: string
    question: string
    // Percent tolerance for the player's answer (e.g. 5 = ±5%).
    tolerance: number
  }
}

// -- Character / Mentor ----------------------------------------------------

export interface Character {
  id: string
  name: string
  emoji: string
  bio: string
  voice: {
    orderIntro: string
    orderComplete: string
  }
  specialty: string[]
  unlockedFrom?: string
}

// A Mentor is a Character with Station-scene metadata.
export interface Mentor extends Character {
  joinsAtChapterId: string
  desk: {
    x: number // 0..100 of the station scene width
    y: number // 0..100 of the station scene height
    color: string
  }
}

// -- Deprecated (kept temporarily during the rewrite) ----------------------

/** @deprecated Use Chapter. Kept to avoid breaking old UI during migration. */
export interface Lesson {
  id: string
  slug: string
  order: number
  title: string
  concept: string
  intro: string
  pinnedGlossaryTerms: string[]
  starterCreatures: LessonStarterCreature[]
  litterSize: number
  correctAssertions: NotebookAssertion[]
  validationTier: 'loose' | 'medium' | 'strict'
  hints: Hint[]
  unlocks: {
    traits?: string[]
    orderTypes?: string[]
    characters?: string[]
  }
  gateOrderIds: string[]
  awardsStarterBlobs?: boolean
}

/** @deprecated Use Mission. Kept to avoid breaking old UI during migration. */
export interface OrderTemplate {
  id: string
  characterId: string
  tier: 1 | 2 | 3
  requiredPhenotype: Record<string, string>
  coinReward: number
  flavorText: string
  labStarters: [LabStarterCreature, LabStarterCreature]
  visibleGeneIds: string[]
}
