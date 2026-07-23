import type { Mission } from '../types'

// Prof. Weaver's tier-1 mission set — unlocked after Ch 3 (independent
// assortment). Two-trait puzzles where the player has to pick the RIGHT
// pair from a 3-4 blob bench; wrong choices force F2 breeding.

// 4-blob dihybrid bench. Hidden genotypes:
//   F-01: AASS  (antennae + spots, pure dominant)
//   F-02: AaSs  (antennae + spots, double carrier)
//   M-01: AaSs  (antennae + spots, double carrier)
//   M-02: aass  (no antennae, no spots, pure recessive)
// Any target genotype is reachable, but the shortest path depends on
// which pair the player picks.
const dihybridBench: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'A'], spots: ['S', 'S'] },
    defaultName: 'Sample F-01',
  },
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
    defaultName: 'Sample F-02',
  },
  {
    sex: 'M',
    genotype: { antennae: ['A', 'a'], spots: ['S', 's'] },
    defaultName: 'Sample M-01',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-02',
  },
]

// 3-blob tail bench for the Ch 4 incomplete-dominance missions. Player has
// to spot which pair produces what.
//   Long-tail female (TT), Medium female (Tt), Short-tail male (tt).
const tailBench: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { tail: ['T', 'T'], antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Long-tail F',
  },
  {
    sex: 'F',
    genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Medium-tail F',
  },
  {
    sex: 'M',
    genotype: { tail: ['t', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Short-tail M',
  },
]

export const weaverTier1Missions: Mission[] = [
  {
    id: 'mission-weaver-01',
    chapterTier: 'curious',
    minCompletedChapters: 3,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A collector's after the rarest phenotype from the dihybrid bench — no antennae AND no spots. Pick a pair and see if you can produce one.",
    targetPhenotype: { antennae: 'a', spots: 's' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: dihybridBench,
    breedBudget: 10,
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
      "Testcross work. Bring me a blob showing antennae but no spots — pick the two samples that make the cross reveal a hidden carrier.",
    targetPhenotype: { antennae: 'A', spots: 's' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: dihybridBench,
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'confirmation notes for the dihybrid testcross record',
  },
  {
    id: 'mission-weaver-03',
    chapterTier: 'curious',
    minCompletedChapters: 3,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'Reverse of the last one — an offspring that shows spots but no antennae. Which pair produces it fastest?',
    targetPhenotype: { antennae: 'a', spots: 'S' },
    visibleGeneIds: ['antennae', 'spots'],
    labStarters: dihybridBench,
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: "adds a chart to the Station's dihybrid noticeboard",
  },
  {
    id: 'mission-weaver-04-tail-long',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "I want a fully long-tailed child. Three tail samples on the bench — one pairing wins in a single cross.",
    targetPhenotype: { tail: 'T' },
    visibleGeneIds: ['tail'],
    labStarters: tailBench,
    breedBudget: 5,
    mode: 'breed',
    rewardPreviewText: 'a note on incomplete-dominant ratios for the record',
  },
  {
    id: 'mission-weaver-05-tail-short',
    chapterTier: 'curious',
    minCompletedChapters: 4,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "This time a SHORT-tail child. Same three samples. Some crosses can never produce one; pick the right pair.",
    targetPhenotype: { tail: 't' },
    visibleGeneIds: ['tail'],
    labStarters: tailBench,
    breedBudget: 5,
    mode: 'breed',
    rewardPreviewText: 'field notes on the wild-population tail-length distribution',
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
    visibleGeneIds: ['tail'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Medium-tail F',
      },
      {
        sex: 'M',
        genotype: { tail: ['T', 't'], antennae: ['a', 'a'], spots: ['s', 's'] },
        defaultName: 'Medium-tail M',
      },
    ],
    mode: 'predict-only',
    rewardPreviewText: 'a paper napkin with the answer inked in',
    predictPrompt: {
      focusGeneId: 'tail',
      motherGenotype: 'Tt',
      fatherGenotype: 'Tt',
      question:
        "Tt × Tt medium-tail parents. Under incomplete dominance, what percent of offspring carry at least one T allele (TT or Tt)?",
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
