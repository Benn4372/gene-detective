import type { Mission } from '../types'

// Prof. Weaver's mission set — unlocked after Ch3 (Independent Assortment).
// All missions here are two-trait puzzles that exercise the 4×4 Punnett and
// the phenotype-ratio reasoning she trained the player on.

// Starter pair: two dihybrid heterozygotes (AaSs × AaSs). 9:3:3:1 ratio in
// offspring. Every phenotype combination is reachable but the 1/16 "double
// recessive" is scarce — a real test of patience.
const dihybridStarters: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
    defaultName: 'Weaver F-01',
  },
  {
    sex: 'M',
    genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
    defaultName: 'Weaver M-01',
  },
]

// Starter pair for a testcross-ish scenario: one dihybrid heterozygote
// crossed with a double recessive. Cleaner 1:1:1:1 ratio; useful for
// "prove the parent is truly dihybrid heterozygous" reasoning.
const dihybridTestcrossStarters: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
    defaultName: 'Weaver F-02',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Weaver M-02',
  },
]

// Third pair: an antennae-only parent (AaSS) crossed with a spots-only parent
// (aaSs). Every offspring gets at least one dominant of each — the puzzle is
// finding one that shows only ONE trait cleanly.
const complementaryStarters: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['S', 'S'] },
    defaultName: 'Weaver F-03',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['S', 's'] },
    defaultName: 'Weaver M-03',
  },
]

export const weaverTier1Missions: Mission[] = [
  {
    id: 'mission-weaver-01',
    chapterTier: 'curious',
    minCompletedChapters: 3,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A collector's after the rarest phenotype from a dihybrid pair — no antennae AND no spots. Bring me one and I'll write it up.",
    targetPhenotype: { antennae: 'a', spots: 's' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: dihybridStarters,
    breedBudget: 8,
    mode: 'breed',
    rewardPreviewText:
      'unlocks a follow-up dihybrid mission and edges the anomaly hunt forward',
  },
  {
    id: 'mission-weaver-02',
    chapterTier: 'curious',
    minCompletedChapters: 3,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Testcross work. This dihybrid parent claims to be AaSs — help me prove it by producing every phenotype class from the aa/ss partner. I need one that shows antennae only.",
    targetPhenotype: { antennae: 'A', spots: 's' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: dihybridTestcrossStarters,
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'confirmation notes for the dihybrid testcross record',
  },
  {
    id: 'mission-weaver-03',
    chapterTier: 'curious',
    minCompletedChapters: 3,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A curious cross — one parent carries antennae, the other only spots. Bring me an offspring that shows spots but no antennae.',
    targetPhenotype: { antennae: 'a', spots: 'S' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: complementaryStarters,
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: "adds a chart to the Station's dihybrid noticeboard",
  },
  {
    id: 'mission-weaver-04-color-red',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Two pink parents. I want a fully red child — Rw × Rw should give me one in every four tries. Prove me right.",
    targetPhenotype: { color: 'R' },
    visibleGeneIds: ['color'],
    labStarters: [
      {
        sex: 'F',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink F-04',
      },
      {
        sex: 'M',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink M-04',
      },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'a note on incomplete-dominant ratios for the record',
  },
  {
    id: 'mission-weaver-05-color-white',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Same pink pair — this time bring me a WHITE child. Same 1/4 odds but rarer to sight-check.",
    targetPhenotype: { color: 'w' },
    visibleGeneIds: ['color'],
    labStarters: [
      {
        sex: 'F',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink F-05',
      },
      {
        sex: 'M',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink M-05',
      },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'field notes on the wild-population color distribution',
  },
  // Predict-only mission — no breeding needed. Player answers directly.
  {
    id: 'mission-weaver-06-predict',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A quick prediction exercise. No breeding needed — just work the math.",
    targetPhenotype: {},
    visibleGeneIds: ['color'],
    labStarters: [
      {
        sex: 'F',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink F',
      },
      {
        sex: 'M',
        genotype: { color: ['R', 'w'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pink M',
      },
    ],
    mode: 'predict-only',
    rewardPreviewText: 'a paper napkin with the answer inked in',
    predictPrompt: {
      focusGeneId: 'color',
      motherGenotype: 'Rw',
      fatherGenotype: 'Rw',
      question:
        "Rw × Rw pink parents. Under incomplete dominance, what percent of offspring show at least a hint of the R phenotype (RR or Rw)?",
      tolerance: 3,
    },
  },
  // Deduce-only mission — pedigree analysis with no breeding.
  {
    id: 'mission-weaver-07-pedigree',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Family pedigree in a field notebook. Fill in every blob's antennae genotype. When they all match my records, you're done.",
    targetPhenotype: {},
    visibleGeneIds: ['antennae'],
    labStarters: [
      {
        sex: 'F',
        genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
        defaultName: 'Pedigree F',
      },
      {
        sex: 'M',
        genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Pedigree M',
      },
    ],
    mode: 'deduce-only',
    rewardPreviewText: 'closes an anomaly case-file',
    deducePedigree: {
      focusGeneId: 'antennae',
      nodes: [
        { id: 'I-1', sex: 'F', affected: true, note: 'Grandma' },
        { id: 'I-2', sex: 'M', affected: false, note: 'Grandpa' },
        { id: 'II-1', sex: 'F', affected: false, parents: ['I-1', 'I-2'], note: 'Mother' },
        { id: 'II-2', sex: 'M', affected: true, note: 'Father (unrelated)' },
        { id: 'III-1', sex: 'F', affected: true, parents: ['II-1', 'II-2'] },
        { id: 'III-2', sex: 'M', affected: false, parents: ['II-1', 'II-2'] },
      ],
      correctGenotypes: {
        'I-1': 'Aa',
        'I-2': 'aa',
        'II-1': 'aa',
        'II-2': 'Aa',
        'III-1': 'Aa',
        'III-2': 'aa',
      },
    },
  },
]
