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
]
