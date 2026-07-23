import type { Mission } from '../types'

// A common set of starters for Dr. Mendel's simple-dominance missions:
// an Aa (heterozygous) female and an aa (recessive) male. Aa × aa cleanly
// produces both A and a offspring at 50/50 — either target phenotype is
// reachable from the same pair.
const antennaeStarters: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample F-01',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-01',
  },
]

// A harder variant: two heterozygous parents (Aa × Aa). Target phenotype is
// still A or a but the ratio is 3:1 rather than 1:1, so the "no antennae"
// outcome is scarcer.
const tightAntennaeStarters: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample F-02',
  },
  {
    sex: 'M',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-02',
  },
]

export const mendelTier1Missions: Mission[] = [
  {
    id: 'mission-mendel-01',
    chapterTier: 'curious',
    minCompletedChapters: 1,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      'The new family has sensitive fingers. No antennae, please — a smooth-headed little blob.',
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeStarters,
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'unlocks a follow-up mission from Dr. Mendel',
  },
  {
    id: 'mission-mendel-02',
    chapterTier: 'curious',
    minCompletedChapters: 1,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      "They've always wanted a blob with antennae. Nothing fancy — just antennae.",
    targetPhenotype: { antennae: 'A' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeStarters,
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'nudges the anomaly investigation forward one thread',
  },
  {
    id: 'mission-mendel-03',
    chapterTier: 'curious',
    minCompletedChapters: 2,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      "A researcher up north wants an antennae-free blob for a display case. Both starter samples show antennae — expect the target to be rarer.",
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: tightAntennaeStarters,
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'more field notes on the anomaly',
  },
  {
    id: 'mission-mendel-04',
    chapterTier: 'curious',
    minCompletedChapters: 2,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      "Quick errand: an antennae blob for a school demonstration. From the same rare-samples pair as before.",
    targetPhenotype: { antennae: 'A' },
    visibleGeneIds: ['antennae'],
    labStarters: tightAntennaeStarters,
    breedBudget: 3,
    mode: 'breed',
    rewardPreviewText: 'a quiet thank-you from Dr. Mendel',
  },
]
