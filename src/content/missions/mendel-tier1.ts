import type { Mission } from '../types'

// Dr. Mendel's tier-1 mission set. Every mission is a real choice puzzle:
// the sample bench holds 3 or 4 unknown blobs, the player has to pick the
// right PAIR to breed. Wrong choices produce F1s that still don't match
// the target, forcing a second breeding round.
//
// The "target crosses" spoiler line was removed — the client's own brief
// is the only spec.

// A 4-sample bench: two visibly antennae, two visibly not.
// Genotype layout (hidden from player):
//   F-01: AA  (antennae, pure dominant)
//   F-02: Aa  (antennae, carrier)
//   M-01: Aa  (antennae, carrier)
//   M-02: aa  (no antennae, pure recessive)
// A player targeting "no antennae" who breeds F-01 × any male loses:
// F-01 can only give A. They have to figure out F-02 × M-02 (or F-02 × M-01)
// gives the recessive. A player targeting "antennae" can get it from many
// pairings but the shortest budget requires spotting F-01 × M-02 (all A).
const antennaeBench: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'A'], spots: ['s', 's'] },
    defaultName: 'Sample F-01',
  },
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample F-02',
  },
  {
    sex: 'M',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-01',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-02',
  },
]

// A 3-sample bench: mystery mother + two very different fathers. The player
// must decide whether to backcross with the recessive tester or with the
// heterozygote to reach the target most efficiently.
const antennaeChoiceBench: Mission['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Mystery F-03',
  },
  {
    sex: 'M',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-03',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-04',
  },
]

export const mendelTier1Missions: Mission[] = [
  {
    id: 'mission-mendel-01',
    chapterTier: 'curious',
    minCompletedChapters: 1,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      "The new family has sensitive fingers. No antennae, please — a smooth-headed little blob. Four samples on the bench; pick a pair.",
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeBench,
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'unlocks a follow-up mission from Dr. Mendel',
  },
  {
    id: 'mission-mendel-02',
    chapterTier: 'curious',
    minCompletedChapters: 1,
    clientCharacterId: 'dr-mendel',
    clientBrief:
      "They've always wanted a blob with antennae. The right pair from the sample bench should get one in a single cross.",
    targetPhenotype: { antennae: 'A' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeBench,
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
      "A researcher up north wants an antennae-free blob for a display case. The bench has three samples — think about which cross narrows down fastest.",
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeChoiceBench,
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
      "Quick errand: an antennae blob for a school demonstration. If you pair the two showing antennae, you might not get one first litter — plan for an F2.",
    targetPhenotype: { antennae: 'A' },
    visibleGeneIds: ['antennae'],
    labStarters: antennaeChoiceBench,
    breedBudget: 5,
    mode: 'breed',
    rewardPreviewText: 'a quiet thank-you from Dr. Mendel',
  },
]
