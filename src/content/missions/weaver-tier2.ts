import type { Mission } from '../types'

// Prof. Weaver's tier-2 mission set — one mission per new inheritance model
// introduced in Ch 5-23. Each mission's minCompletedChapters points at the
// chapter that teaches the model, so it appears on the board immediately
// after the player finishes that chapter.
//
// Every mission is a straightforward breeding challenge — deliver an
// offspring with a specific target phenotype. The genotype gymnastics
// happen in the chapter's Workbench; the mission is the applied test.

export const weaverTier2Missions: Mission[] = [
  // Ch 5 — codominance. Pair of homozygous (pure stripes × pure blotches).
  // Every F1 is RB (both patterns) so the target is easy; the value is
  // getting the player to WATCH the codominant heterozygote form.
  {
    id: 'mission-w2-codominance-both',
    chapterTier: 'curious',
    minCompletedChapters: 5,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A field decorator needs a specimen with BOTH stripes and blotches. Pure-stripes mother, pure-blotches father — every child should oblige. Bring me one.",
    targetPhenotype: { pattern: 'RB' },
    visibleGeneIds: ['pattern'],
    labStarters: [
      { sex: 'F', genotype: { pattern: ['R', 'R'] }, defaultName: 'Stripe mother' },
      { sex: 'M', genotype: { pattern: ['B', 'B'] }, defaultName: 'Blotch father' },
    ],
    breedBudget: 3,
    mode: 'breed',
    rewardPreviewText: "adds a codominant sample to Prof. Weaver's teaching wall",
  },
  // Ch 6 — multiple alleles. Mystery Mn × known nn testcross — deliver a
  // medium-horn offspring to prove the mother carries M.
  {
    id: 'mission-w2-multiallele-medium',
    chapterTier: 'curious',
    minCompletedChapters: 6,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Horn breeder wants a medium-horned specimen. I lined up a testcross pair — bring me a Mn offspring (medium horns).",
    targetPhenotype: { horns: 'M' },
    visibleGeneIds: ['horns'],
    labStarters: [
      { sex: 'F', genotype: { horns: ['M', 'n'] }, defaultName: 'Long-hidden-mid' },
      { sex: 'M', genotype: { horns: ['n', 'n'] }, defaultName: 'Short-horn tester' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'confirms a multi-allele test-cross record',
  },
  // Ch 7 — sex-linked. Carrier mother × glow father. Deliver a NO-GLOW son
  // (the X-linked recessive phenotype).
  {
    id: 'mission-w2-sexlinked-son',
    chapterTier: 'curious',
    minCompletedChapters: 7,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "An observer needs a no-glow male specimen. His mother is a Gg carrier; the father glows. Watch which offspring inherit her recessive X.",
    targetPhenotype: { eyeGlow: 'g' },
    visibleGeneIds: ['eyeGlow'],
    labStarters: [
      { sex: 'F', genotype: { eyeGlow: ['G', 'g'] }, defaultName: 'Carrier mother' },
      { sex: 'M', genotype: { eyeGlow: ['G'] }, defaultName: 'Glowing father' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'gets filed as evidence of X-linked recessive segregation',
  },
  // Ch 8 — linkage. Coupling AF/af mother × ff aa tester. Rare recombinant Af
  // (antennae, no fins) is the target — teaches that linkage != impossibility.
  {
    id: 'mission-w2-linkage-recombinant',
    chapterTier: 'curious',
    minCompletedChapters: 8,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'Linkage-lab needs a rare recombinant — antennae WITHOUT fins. Genes are 5 cM apart; the recombinant only shows up in ~5% of gametes. Patience.',
    targetPhenotype: { antennae: 'A', fins: 'f' },
    visibleGeneIds: ['antennae', 'fins'],
    labStarters: [
      {
        sex: 'F',
        genotype: { antennae: ['A', 'a'], fins: ['F', 'f'] },
        defaultName: 'Coupling mother',
      },
      {
        sex: 'M',
        genotype: { antennae: ['a', 'a'], fins: ['f', 'f'] },
        defaultName: 'Recessive tester',
      },
    ],
    breedBudget: 20,
    mode: 'breed',
    rewardPreviewText: 'documents a rare crossover event for the linkage map',
  },
  // Ch 9 — epistasis. Pp × Pp cross. Deliver a tail-less offspring (pp)
  // even though both parents have tails.
  {
    id: 'mission-w2-epistasis-tailless',
    chapterTier: 'curious',
    minCompletedChapters: 9,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Two long-tailed parents. I need a tail-LESS offspring. Both carry the recessive p — expect ~1 in 4.",
    targetPhenotype: { tail: 'none' },
    visibleGeneIds: ['tail', 'tailGrowth'],
    labStarters: [
      {
        sex: 'F',
        genotype: { tail: ['T', 'T'], tailGrowth: ['P', 'p'] },
        defaultName: 'Long-tail carrier α',
      },
      {
        sex: 'M',
        genotype: { tail: ['T', 'T'], tailGrowth: ['P', 'p'] },
        defaultName: 'Long-tail carrier β',
      },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'closes out an epistasis field-record',
  },
  // Ch 10 — polygenic. DdEeVv × DdEeVv. Deliver the RARE largest (DDEEVV,
  // all 6 large alleles) or smallest (all 0). Extreme end of the bell curve.
  {
    id: 'mission-w2-polygenic-giant',
    chapterTier: 'student',
    minCompletedChapters: 10,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A collector wants a GIANT blob — size 6 out of 6 across all three additive genes. Very rare from a medium × medium cross. Expect to work at it.',
    targetPhenotype: { size: '6' },
    visibleGeneIds: [],
    labStarters: [
      {
        sex: 'F',
        genotype: {
          sizeA: ['D', 'd'],
          sizeB: ['E', 'e'],
          sizeC: ['V', 'v'],
        },
        defaultName: 'Medium mother',
      },
      {
        sex: 'M',
        genotype: {
          sizeA: ['D', 'd'],
          sizeB: ['E', 'e'],
          sizeC: ['V', 'v'],
        },
        defaultName: 'Medium father',
      },
    ],
    breedBudget: 24,
    mode: 'breed',
    rewardPreviewText: 'a headline entry in the size-distribution field study',
  },
  // Ch 11 — environmental. Requires the workbench's environment slider
  // eventually; for a mission-style breeding puzzle, the trait naturally
  // hides at room temperature. Deliver an Hh offspring (still solvable via
  // genotype since the phenotype flips with heat).
  {
    id: 'mission-w2-environmental-Hh',
    chapterTier: 'student',
    minCompletedChapters: 11,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A heat-lab wants a heatSpot-carrier for their warm-side experiments. HH × hh cross — every F1 will be Hh, ready to glow when heated.',
    targetPhenotype: { heatSpot: 'H' },
    visibleGeneIds: ['heatSpot'],
    labStarters: [
      { sex: 'F', genotype: { heatSpot: ['H', 'H'] }, defaultName: 'Warm mother' },
      { sex: 'M', genotype: { heatSpot: ['h', 'h'] }, defaultName: 'Cold father' },
    ],
    breedBudget: 3,
    mode: 'breed',
    rewardPreviewText: 'enrolls a specimen in the temperature-sensitive study',
  },
  // Ch 13 — mutation. Two kk parents. Mutation flips k→K ~3% of gametes.
  // Deliver a sparkling (K-carrying) offspring — impossible under classical
  // rules, statistically inevitable given mutation rate.
  {
    id: 'mission-w2-mutation-sparkler',
    chapterTier: 'student',
    minCompletedChapters: 13,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A jeweller wants a sparkling blob. Neither parent sparkles — both are kk. Impossible? Not with the sparkle gene's mutation rate.",
    targetPhenotype: { sparkle: 'K' },
    visibleGeneIds: ['sparkle'],
    labStarters: [
      { sex: 'F', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain mother' },
      { sex: 'M', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain father' },
    ],
    breedBudget: 30,
    mode: 'breed',
    rewardPreviewText: 'records a spontaneous mutation event for the archive',
  },
  // Ch 14 — lethal. Cc × Cc. Deliver a dark-coat (cc) offspring. Note: the
  // 2:1 distortion means dark is 1/3 not 1/4 — actually slightly EASIER
  // than a classical 3:1 recessive.
  {
    id: 'mission-w2-lethal-dark',
    chapterTier: 'student',
    minCompletedChapters: 14,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A morphology study wants a dark-coat (cc) offspring from two yellow (Cc) parents. Lethal CC quietly boosts the dark ratio to 1 in 3.',
    targetPhenotype: { lethalCoat: 'c' },
    visibleGeneIds: ['lethalCoat'],
    labStarters: [
      { sex: 'F', genotype: { lethalCoat: ['C', 'c'] }, defaultName: 'Yellow mother' },
      { sex: 'M', genotype: { lethalCoat: ['C', 'c'] }, defaultName: 'Yellow father' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'joins the lethal-allele ratio-distortion dossier',
  },
  // Ch 15 — pleiotropy. Same antennae gene expresses metabolism. Deliver
  // an offspring with the antennae phenotype absent (aa). The pleiotropic
  // marker follows automatically.
  {
    id: 'mission-w2-pleiotropy-aa',
    chapterTier: 'student',
    minCompletedChapters: 15,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Two Aa parents. Deliver a no-antennae child (aa) — the metabolism marker will absent itself too, since it's the same gene. Two phenotypes, one segregation.",
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: [
      { sex: 'F', genotype: { antennae: ['A', 'a'] }, defaultName: 'Antenna carrier α' },
      { sex: 'M', genotype: { antennae: ['A', 'a'] }, defaultName: 'Antenna carrier β' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'confirms a pleiotropic co-segregation record',
  },
  // Ch 16 — sex-influenced. Same genotype (Ww) shows crest in males, not
  // females. Deliver a crest-showing MALE offspring.
  {
    id: 'mission-w2-sexinfluenced-crest',
    chapterTier: 'student',
    minCompletedChapters: 16,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Two Ww parents. A ridge-crest MALE is common; his sister with the same genotype will look plain. Bring me the crested son.",
    targetPhenotype: { braincrest: 'W' },
    visibleGeneIds: ['braincrest'],
    labStarters: [
      { sex: 'F', genotype: { braincrest: ['W', 'w'] }, defaultName: 'Crest carrier mother' },
      { sex: 'M', genotype: { braincrest: ['W', 'w'] }, defaultName: 'Crest carrier father' },
    ],
    breedBudget: 5,
    mode: 'breed',
    rewardPreviewText: 'evidence for sex-influenced dominance flip',
  },
  // Ch 17 — sex-limited. UU × uu. All F1 are Uu; only daughters express the
  // brood pouch. Deliver a Uu DAUGHTER — males will silently carry the
  // allele but never show it.
  {
    id: 'mission-w2-sexlimited-daughter',
    chapterTier: 'student',
    minCompletedChapters: 17,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Broadside from a wildlife lab: a brood-pouch daughter. Uu × uu — half of offspring are Uu; among those, only daughters show the pouch.",
    targetPhenotype: { broodPouch: 'U' },
    visibleGeneIds: ['broodPouch'],
    labStarters: [
      { sex: 'F', genotype: { broodPouch: ['U', 'u'] }, defaultName: 'Pouch mother' },
      { sex: 'M', genotype: { broodPouch: ['u', 'u'] }, defaultName: 'Silent-carrier tester' },
    ],
    breedBudget: 8,
    mode: 'breed',
    rewardPreviewText: 'files a sex-limited expression note',
  },
  // Ch 18 — mitochondrial. Q mother × any father → all offspring Q. This
  // demonstrates single-parent inheritance — the father contributes nothing.
  {
    id: 'mission-w2-mito-halo',
    chapterTier: 'student',
    minCompletedChapters: 18,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A halo blob for a display case. Mother has Q (halo); father has q. Every offspring inherits from the mother — the father's mitochondria are discarded at fertilisation.",
    targetPhenotype: { mitoHalo: 'Q' },
    visibleGeneIds: ['mitoHalo'],
    labStarters: [
      { sex: 'F', genotype: { mitoHalo: ['Q'] }, defaultName: 'Halo mother' },
      { sex: 'M', genotype: { mitoHalo: ['q'] }, defaultName: 'No-halo father' },
    ],
    breedBudget: 3,
    mode: 'breed',
    rewardPreviewText: 'anchors the maternal-inheritance evidence chain',
  },
  // Ch 19 — imprinting. Maternal-imprinted gene. jj mother × JJ father →
  // every offspring is Jj, and expresses J (from father — paternal copy is
  // the active one). Reciprocal cross (JJ mother × jj father) would give
  // silent-J offspring. Ask the player to notice which parent matters.
  {
    id: 'mission-w2-imprint-Jexpr',
    chapterTier: 'student',
    minCompletedChapters: 19,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'Two Jj parents — reciprocal breeding demonstration. Deliver a J-expressing offspring; the mark shows only when the paternal J is inherited.',
    targetPhenotype: { imprintMark: 'J' },
    visibleGeneIds: ['imprintMark'],
    labStarters: [
      { sex: 'F', genotype: { imprintMark: ['j', 'j'] }, defaultName: 'Silent-J mother' },
      { sex: 'M', genotype: { imprintMark: ['J', 'J'] }, defaultName: 'Active-J father' },
    ],
    breedBudget: 3,
    mode: 'breed',
    rewardPreviewText: 'documents paternal-imprint expression',
  },
  // Ch 23 — alternative sex determination is more theoretical; skip the
  // breeding-mission format. Ch 20/22 use non-Workbench interaction modes;
  // Ch 21 modifier is the same tailGrowth mechanic as Ch 9 — already covered.
]
