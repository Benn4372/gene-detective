import type { Mission } from '../types'

// Prof. Weaver's tier-2 mission set — one mission per new inheritance model
// introduced in Ch 5-23. Each mission's minCompletedChapters points at the
// chapter that teaches the model, so it appears on the board immediately
// after the player finishes that chapter.
//
// Every mission ships with 3-4 samples on the bench. The player has to pick
// the right pair. Picking the wrong pair typically produces an F1 that can't
// reach the target, forcing an F2 breeding round — which is the whole point
// of turning missions from "click breed until you pass" into a real puzzle.

export const weaverTier2Missions: Mission[] = [
  // Ch 5 — codominance. 3 samples: pure-R, pure-B, RB heterozygote.
  // Target RB is reachable in 1 cross from R × B; other pairs need F2.
  {
    id: 'mission-w2-codominance-both',
    chapterTier: 'curious',
    minCompletedChapters: 5,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A field decorator needs a specimen with BOTH stripes and blotches. Three samples on the bench — figure out the pair whose F1 will show both patterns.",
    targetPhenotype: { pattern: 'RB' },
    visibleGeneIds: ['pattern'],
    labStarters: [
      { sex: 'F', genotype: { pattern: ['R', 'R'] }, defaultName: 'Stripe mother' },
      { sex: 'F', genotype: { pattern: ['R', 'B'] }, defaultName: 'Both-pattern mother' },
      { sex: 'M', genotype: { pattern: ['B', 'B'] }, defaultName: 'Blotch father' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: "adds a codominant sample to Prof. Weaver's teaching wall",
  },
  // Ch 6 — multiple alleles. 4 samples spanning the L>M>n hierarchy.
  //   F-Ln (long, hides n) · F-nn (short) · M-Mn (medium, hides n) · M-LM (long, hides M).
  // Only some pairs can yield a medium-horn (Mn or MM) child.
  {
    id: 'mission-w2-multiallele-medium',
    chapterTier: 'curious',
    minCompletedChapters: 6,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Horn breeder wants a MEDIUM-horned specimen. Four samples, mixed horn types — you'll need to think about which cross can even produce a Mn child.",
    targetPhenotype: { horns: 'M' },
    visibleGeneIds: ['horns'],
    labStarters: [
      { sex: 'F', genotype: { horns: ['L', 'n'] }, defaultName: 'Long-horn F' },
      { sex: 'F', genotype: { horns: ['n', 'n'] }, defaultName: 'Short-horn F' },
      { sex: 'M', genotype: { horns: ['M', 'n'] }, defaultName: 'Mid-horn M' },
      { sex: 'M', genotype: { horns: ['L', 'M'] }, defaultName: 'Long-hidden-M M' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'confirms a multi-allele test-cross record',
  },
  // Ch 7 — sex-linked. 3 samples on X-linked eyeGlow.
  //   F-Gg carrier (glows) · F-GG homozygous glow · M-G glow.
  // Target = no-glow son. Only Gg × G can produce a g son (25% of sons).
  // If player picks GG × G, no offspring can ever be g — forces retry.
  {
    id: 'mission-w2-sexlinked-son',
    chapterTier: 'curious',
    minCompletedChapters: 7,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "An observer needs a no-glow male specimen. Three samples — two glowing females, one glowing father. But only ONE female can produce a no-glow son. Which?",
    targetPhenotype: { eyeGlow: 'g' },
    visibleGeneIds: ['eyeGlow'],
    labStarters: [
      { sex: 'F', genotype: { eyeGlow: ['G', 'g'] }, defaultName: 'Glow F-α' },
      { sex: 'F', genotype: { eyeGlow: ['G', 'G'] }, defaultName: 'Glow F-β' },
      { sex: 'M', genotype: { eyeGlow: ['G'] }, defaultName: 'Glowing father' },
    ],
    breedBudget: 8,
    mode: 'breed',
    rewardPreviewText: 'gets filed as evidence of X-linked recessive segregation',
  },
  // Ch 8 — linkage. 3 samples of linked antennae-fins.
  //   F-coupling (AF/af) · F-repulsion (Af/aF) · M-pure-recessive (aa ff).
  // Only the repulsion mother × recessive father gives Af or aF as PARENTAL
  // gametes (~47.5% each), making antennae-without-fins common; coupling
  // mother × recessive gives Af only as rare recombinant (~2.5%).
  {
    id: 'mission-w2-linkage-recombinant',
    chapterTier: 'curious',
    minCompletedChapters: 8,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'Linkage-lab needs an antennae-only offspring (no fins). Two females on the bench carry both genes but in different phases — one gets the target as a PARENTAL, the other only as a rare recombinant.',
    targetPhenotype: { antennae: 'A', fins: 'f' },
    visibleGeneIds: ['antennae', 'fins'],
    labStarters: [
      { sex: 'F', genotype: { antennae: ['A', 'a'], fins: ['F', 'f'] }, defaultName: 'Coupling F' },
      { sex: 'F', genotype: { antennae: ['A', 'a'], fins: ['f', 'F'] }, defaultName: 'Repulsion F' },
      { sex: 'M', genotype: { antennae: ['a', 'a'], fins: ['f', 'f'] }, defaultName: 'Recessive tester' },
    ],
    breedBudget: 12,
    mode: 'breed',
    rewardPreviewText: 'documents a rare crossover event for the linkage map',
  },
  // Ch 9 — epistasis. 3 samples on tailGrowth/tail combo.
  //   F-PP long-tail · F-Pp carrier long-tail · M-Pp carrier long-tail.
  // Target = tail-less (pp offspring, epistasis mask). Only Pp × Pp gives
  // it; PP × Pp guarantees at least one P → every child grows a tail.
  {
    id: 'mission-w2-epistasis-tailless',
    chapterTier: 'curious',
    minCompletedChapters: 9,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "I need a tail-LESS offspring from three tailed samples. Only the pairing where BOTH parents carry the recessive p can ever produce one. Pick carefully.",
    targetPhenotype: { tail: 'none' },
    visibleGeneIds: ['tail', 'tailGrowth'],
    labStarters: [
      { sex: 'F', genotype: { tail: ['T', 'T'], tailGrowth: ['P', 'P'] }, defaultName: 'Long-tail F-α' },
      { sex: 'F', genotype: { tail: ['T', 'T'], tailGrowth: ['P', 'p'] }, defaultName: 'Long-tail F-β' },
      { sex: 'M', genotype: { tail: ['T', 'T'], tailGrowth: ['P', 'p'] }, defaultName: 'Long-tail M' },
    ],
    breedBudget: 8,
    mode: 'breed',
    rewardPreviewText: 'closes out an epistasis field-record',
  },
  // Ch 10 — polygenic. 4 samples spanning the size range.
  //   F-largest (DDEEVV) · F-medium (DdEeVv) · M-medium (DdEeVv) · M-smallest (ddeevv).
  // Target = giant (6). Fastest path is DDEEVV × DdEeVv (F2 to reach 6 is
  // common). DdEeVv × DdEeVv is the bell-curve grind (1/64 → 6). largest ×
  // smallest gives all-3 F1s — need F2 for extremes.
  {
    id: 'mission-w2-polygenic-giant',
    chapterTier: 'student',
    minCompletedChapters: 10,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A collector wants a GIANT blob — size 6. Four samples: two mediums, one giant, one smallest. The pair you pick sets whether you can reach the target in one cross or need several.',
    targetPhenotype: { size: '6' },
    visibleGeneIds: [],
    labStarters: [
      {
        sex: 'F',
        genotype: { sizeA: ['D', 'D'], sizeB: ['E', 'E'], sizeC: ['V', 'V'] },
        defaultName: 'Giant F',
      },
      {
        sex: 'F',
        genotype: { sizeA: ['D', 'd'], sizeB: ['E', 'e'], sizeC: ['V', 'v'] },
        defaultName: 'Medium F',
      },
      {
        sex: 'M',
        genotype: { sizeA: ['D', 'd'], sizeB: ['E', 'e'], sizeC: ['V', 'v'] },
        defaultName: 'Medium M',
      },
      {
        sex: 'M',
        genotype: { sizeA: ['d', 'd'], sizeB: ['e', 'e'], sizeC: ['v', 'v'] },
        defaultName: 'Smallest M',
      },
    ],
    breedBudget: 20,
    mode: 'breed',
    rewardPreviewText: 'a headline entry in the size-distribution field study',
  },
  // Ch 11 — environmental. 3 samples: HH F, hh F, hh M.
  // Only HH × hh produces guaranteed Hh (target); hh × hh can never carry H.
  {
    id: 'mission-w2-environmental-Hh',
    chapterTier: 'student',
    minCompletedChapters: 11,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A heat-lab wants an Hh carrier. Three samples on the bench — pick the pair that guarantees an H-carrier F1.',
    targetPhenotype: { heatSpot: 'H' },
    visibleGeneIds: ['heatSpot'],
    labStarters: [
      { sex: 'F', genotype: { heatSpot: ['H', 'H'] }, defaultName: 'Warm F' },
      { sex: 'F', genotype: { heatSpot: ['h', 'h'] }, defaultName: 'Cold F' },
      { sex: 'M', genotype: { heatSpot: ['h', 'h'] }, defaultName: 'Cold M' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'enrolls a specimen in the temperature-sensitive study',
  },
  // Ch 13 — mutation. 4 kk samples — all plain, none sparkle. Mutation is
  // the only path. Multiple starters here mostly gives the player more
  // pair combinations to try; the underlying rate is still ~3% per gamete.
  {
    id: 'mission-w2-mutation-sparkler',
    chapterTier: 'student',
    minCompletedChapters: 13,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A jeweller wants a sparkling blob. None of the four samples sparkle — all kk. Mutation is the only source of a K allele. Pick a pair, breed a lot.",
    targetPhenotype: { sparkle: 'K' },
    visibleGeneIds: ['sparkle'],
    labStarters: [
      { sex: 'F', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain F-α' },
      { sex: 'F', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain F-β' },
      { sex: 'M', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain M-α' },
      { sex: 'M', genotype: { sparkle: ['k', 'k'] }, defaultName: 'Plain M-β' },
    ],
    breedBudget: 30,
    mode: 'breed',
    rewardPreviewText: 'records a spontaneous mutation event for the archive',
  },
  // Ch 14 — lethal. 3 samples: two Cc yellows + one cc dark. Target cc dark.
  // Cc × Cc gives 1/3 dark survivors (2:1 distortion). Cc × cc gives 1/2.
  // cc × cc impossible (need female + male, only Cc females here).
  {
    id: 'mission-w2-lethal-dark',
    chapterTier: 'student',
    minCompletedChapters: 14,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'A morphology study wants a dark-coat (cc) offspring. Three samples — two carriers, one already dark. The fastest cross is one Cc × cc; think about which combo maximises the recessive.',
    targetPhenotype: { lethalCoat: 'c' },
    visibleGeneIds: ['lethalCoat'],
    labStarters: [
      { sex: 'F', genotype: { lethalCoat: ['C', 'c'] }, defaultName: 'Yellow F-α' },
      { sex: 'F', genotype: { lethalCoat: ['C', 'c'] }, defaultName: 'Yellow F-β' },
      { sex: 'M', genotype: { lethalCoat: ['c', 'c'] }, defaultName: 'Dark M' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'joins the lethal-allele ratio-distortion dossier',
  },
  // Ch 15 — pleiotropy. 3 samples on antennae. Target aa. Only crosses with
  // enough 'a' between them produce aa; AA × Aa can never.
  {
    id: 'mission-w2-pleiotropy-aa',
    chapterTier: 'student',
    minCompletedChapters: 15,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Deliver a no-antennae (aa) child. The metabolism marker follows automatically since it's pleiotropic. Three samples — one pure dominant among them.",
    targetPhenotype: { antennae: 'a' },
    visibleGeneIds: ['antennae'],
    labStarters: [
      { sex: 'F', genotype: { antennae: ['A', 'A'] }, defaultName: 'Pure-A F' },
      { sex: 'F', genotype: { antennae: ['A', 'a'] }, defaultName: 'Carrier F' },
      { sex: 'M', genotype: { antennae: ['A', 'a'] }, defaultName: 'Carrier M' },
    ],
    breedBudget: 5,
    mode: 'breed',
    rewardPreviewText: 'confirms a pleiotropic co-segregation record',
  },
  // Ch 16 — sex-influenced. 3 samples on braincrest.
  //   F-WW · F-Ww (looks plain — w dominates in F) · M-ww.
  // Target crest-showing male (W_ in males). WW × ww → all F1 Ww: males show
  // crest, females don't. Ww × ww → half Ww (crested M), half ww (plain M).
  // WW × WW impossible (no WW M).
  {
    id: 'mission-w2-sexinfluenced-crest',
    chapterTier: 'student',
    minCompletedChapters: 16,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "Bring me a crested SON. Sex-influenced — same genotype expresses in males but not females. Three samples: figure out which pair puts W into a male offspring.",
    targetPhenotype: { braincrest: 'W' },
    visibleGeneIds: ['braincrest'],
    labStarters: [
      { sex: 'F', genotype: { braincrest: ['W', 'W'] }, defaultName: 'Homoz F' },
      { sex: 'F', genotype: { braincrest: ['W', 'w'] }, defaultName: 'Plain-looking carrier F' },
      { sex: 'M', genotype: { braincrest: ['w', 'w'] }, defaultName: 'Plain M' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'evidence for sex-influenced dominance flip',
  },
  // Ch 17 — sex-limited. 3 samples: UU F, Uu F, uu M.
  // Target = pouched daughter (U_ in F). UU × uu → all F1 Uu; F daughters
  // all show pouch. Uu × uu → 1/2 Uu daughters show. uu impossible.
  {
    id: 'mission-w2-sexlimited-daughter',
    chapterTier: 'student',
    minCompletedChapters: 17,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A wildlife lab wants a brood-pouch daughter. Only females express the trait. Three samples — one pair guarantees the pouch in every daughter.",
    targetPhenotype: { broodPouch: 'U' },
    visibleGeneIds: ['broodPouch'],
    labStarters: [
      { sex: 'F', genotype: { broodPouch: ['U', 'U'] }, defaultName: 'Pouch homoz F' },
      { sex: 'F', genotype: { broodPouch: ['U', 'u'] }, defaultName: 'Pouch carrier F' },
      { sex: 'M', genotype: { broodPouch: ['u', 'u'] }, defaultName: 'Silent M' },
    ],
    breedBudget: 6,
    mode: 'breed',
    rewardPreviewText: 'files a sex-limited expression note',
  },
  // Ch 18 — mitochondrial. 3 samples: Q F, q F, q M.
  // Target Q. Only the Q mother produces Q offspring; father is irrelevant.
  {
    id: 'mission-w2-mito-halo',
    chapterTier: 'student',
    minCompletedChapters: 18,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      "A halo blob for display. Three samples — two mothers, one father. Only ONE mother can pass the halo; father's contribution to mtDNA is zero.",
    targetPhenotype: { mitoHalo: 'Q' },
    visibleGeneIds: ['mitoHalo'],
    labStarters: [
      { sex: 'F', genotype: { mitoHalo: ['Q'] }, defaultName: 'Halo F' },
      { sex: 'F', genotype: { mitoHalo: ['q'] }, defaultName: 'No-halo F' },
      { sex: 'M', genotype: { mitoHalo: ['q'] }, defaultName: 'No-halo M' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'anchors the maternal-inheritance evidence chain',
  },
  // Ch 19 — imprinting. 4 samples spanning reciprocal parent-of-origin.
  //   F-jj, F-JJ, M-jj, M-JJ.
  // Target = J-expressing offspring. Only pairings where FATHER contributes
  // a J work (paternal copy is the active one; maternal is silenced). So
  // jj F × JJ M works; JJ F × jj M does NOT (mother's J is silenced).
  {
    id: 'mission-w2-imprint-Jexpr',
    chapterTier: 'student',
    minCompletedChapters: 19,
    clientCharacterId: 'prof-weaver',
    clientBrief:
      'Four samples — two mothers, two fathers. Only one pairing produces a J-expressing child. Which parent has to carry the J for the mark to show?',
    targetPhenotype: { imprintMark: 'J' },
    visibleGeneIds: ['imprintMark'],
    labStarters: [
      { sex: 'F', genotype: { imprintMark: ['j', 'j'] }, defaultName: 'j-mother' },
      { sex: 'F', genotype: { imprintMark: ['J', 'J'] }, defaultName: 'J-mother' },
      { sex: 'M', genotype: { imprintMark: ['j', 'j'] }, defaultName: 'j-father' },
      { sex: 'M', genotype: { imprintMark: ['J', 'J'] }, defaultName: 'J-father' },
    ],
    breedBudget: 4,
    mode: 'breed',
    rewardPreviewText: 'documents paternal-imprint expression',
  },
  // Ch 23 — alternative sex determination is more theoretical; skip the
  // breeding-mission format. Ch 20/22 use non-Workbench interaction modes;
  // Ch 21 modifier is the same tailGrowth mechanic as Ch 9 — already covered.
]
