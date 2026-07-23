import { evolutionaryChapter } from './_evolutionary'

// Ch 27 — Genetic drift.
export const ch27 = evolutionaryChapter({
  id: 'ch27',
  order: 27,
  concept: 'Genetic drift — random change in small populations',
  title: 'Small crowd, big wobble',
  storyIntro: 'Prof. Weaver:\n"In small populations, random sampling error tosses allele frequencies around each generation. That\'s drift."',
  storyOutro: 'Prof. Weaver:\n"Drift is strongest when populations are small. Given enough generations, one allele always wins — even without selection."',
  body: `**Drift** is random change in allele frequency between generations. In a large population, sample size is huge and drift is negligible. In a small population, sample size is small and drift dominates.

Run the sandbox with a small population. Frequencies wobble. Given enough time, one allele fixes at 100%.`,
  glossary: ['genetic-drift'],
  focusGeneId: 'color',
  initialDominantFreq: 0.5,
  populationSize: 24,
  generationsToExplore: 5,
  nextChapterId: 'ch28',
  force: 'drift',
})

// Ch 28 — Founder / bottleneck.
export const ch28 = evolutionaryChapter({
  id: 'ch28',
  order: 28,
  concept: 'Founder effect and bottlenecks',
  title: 'When a few carry all',
  storyIntro: 'Prof. Weaver:\n"Small group breaks off from the main population. Their allele frequencies don\'t match the source. That\'s the founder effect."',
  storyOutro: 'Prof. Weaver:\n"Bottlenecks work the same way — plague, disaster, whatever. What survives shapes the future."',
  body: `A **founder effect** happens when a small group starts a new population. Their allele frequencies are a random sample of the parent group's — often skewed.

A **bottleneck** is the same principle: a population crashes to a small size, then rebuilds. The rebuilt population reflects the survivors' frequencies, not the original's.`,
  glossary: ['founder-effect', 'bottleneck'],
  focusGeneId: 'color',
  initialDominantFreq: 0.25,
  populationSize: 20,
  generationsToExplore: 5,
  nextChapterId: 'ch29',
  force: 'founder',
})

// Ch 29 — Gene flow / migration.
export const ch29 = evolutionaryChapter({
  id: 'ch29',
  order: 29,
  concept: 'Gene flow between connected populations',
  title: 'Blobs on the move',
  storyIntro: 'Prof. Weaver:\n"When individuals move between populations, their alleles come along. Gene flow homogenises."',
  storyOutro: 'Prof. Weaver:\n"Gene flow opposes drift and diversifies. Balance is what keeps most real populations moving but distinct."',
  body: `**Gene flow** is the movement of alleles between populations via migrating individuals. It reduces genetic differences between groups.

If you had two isolated populations at different starting frequencies, gene flow would drag them together over time.`,
  glossary: ['gene-flow', 'migration'],
  focusGeneId: 'color',
  initialDominantFreq: 0.7,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch30',
  force: 'migration',
})

// Ch 30 — Natural selection.
export const ch30 = evolutionaryChapter({
  id: 'ch30',
  order: 30,
  concept: 'Natural selection — fitness differences',
  title: 'The environment votes',
  storyIntro: 'Prof. Weaver:\n"When one phenotype survives or reproduces better, its allele frequency climbs. Every generation. Compound interest of biology."',
  storyOutro: 'Prof. Weaver:\n"Selection is the only evolutionary force with a direction. Drift is random, mutation is random, flow homogenises — selection sculpts."',
  body: `**Natural selection** occurs when genotypes differ in survival or reproductive success. The high-fitness allele climbs each generation.

Directional, stabilising, disruptive — selection has three main flavors, depending on which phenotype the environment favors.`,
  glossary: ['natural-selection', 'fitness'],
  focusGeneId: 'color',
  initialDominantFreq: 0.1,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch31',
  force: 'selection',
})

// Ch 31 — Balancing selection.
export const ch31 = evolutionaryChapter({
  id: 'ch31',
  order: 31,
  concept: 'Balancing selection — heterozygote advantage',
  title: 'Both alleles win',
  storyIntro: 'Prof. Weaver:\n"When the heterozygote is fitter than either homozygote, both alleles persist forever. Sickle-cell in malarial regions is the textbook case."',
  storyOutro: 'Prof. Weaver:\n"Balancing selection is why some diseases stay common — the recessive allele is bad, but the heterozygous carrier is protected against something else."',
  body: `**Balancing selection** keeps multiple alleles in a population indefinitely. The classic mechanism is **heterozygote advantage**: Aa is fitter than either AA or aa.

Even under strong selection, the allele that's bad in homozygous form is protected because it\'s valuable in heterozygous form.`,
  glossary: ['balancing-selection', 'heterozygote-advantage'],
  focusGeneId: 'color',
  initialDominantFreq: 0.4,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch32',
  force: 'balancing',
})

// Ch 32 — Sexual / assortative mating.
export const ch32 = evolutionaryChapter({
  id: 'ch32',
  order: 32,
  concept: 'Sexual and assortative mating',
  title: 'Picky partners',
  storyIntro: 'Prof. Weaver:\n"Random mating is a nice assumption. Real animals pick partners with specific phenotypes."',
  storyOutro: 'Prof. Weaver:\n"Assortative mating raises homozygosity even without changing allele frequencies. Great for divergence."',
  body: `Under **random mating**, gametes combine independently of phenotype. Under **assortative mating**, like mates with like — pinks with pinks, whites with whites.

Assortative mating doesn't change allele frequencies but raises homozygosity: fewer heterozygotes than HW predicts.`,
  glossary: ['assortative-mating', 'sexual-selection'],
  focusGeneId: 'color',
  initialDominantFreq: 0.5,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch33',
  force: 'assortative',
})

// Ch 33 — Inbreeding depression.
export const ch33 = evolutionaryChapter({
  id: 'ch33',
  order: 33,
  concept: 'Inbreeding depression',
  title: 'The cost of relatives',
  storyIntro: 'Prof. Weaver:\n"Related individuals share alleles. Their offspring are homozygous more often — including for recessive deleterious ones."',
  storyOutro: 'Prof. Weaver:\n"Zoos and conservation programs fight inbreeding depression constantly. Small populations need external gene flow."',
  body: `**Inbreeding** is mating between relatives. Their gametes share alleles more often than random pairs\'. Result: offspring are homozygous more often, including for recessive deleterious alleles.

**Inbreeding depression** is the fitness loss from raised homozygosity for bad recessives.`,
  glossary: ['inbreeding', 'homozygosity'],
  focusGeneId: 'color',
  initialDominantFreq: 0.5,
  populationSize: 16,
  generationsToExplore: 5,
  nextChapterId: 'ch34',
  force: 'inbreeding',
})

// Ch 34 — Hybrid vigor.
export const ch34 = evolutionaryChapter({
  id: 'ch34',
  order: 34,
  concept: 'Hybrid vigor — heterosis',
  title: 'Distant is stronger',
  storyIntro: 'Prof. Weaver:\n"Cross two inbred lines and their hybrids can outperform either parent line. Heterosis."',
  storyOutro: 'Prof. Weaver:\n"Modern agricultural yields depend on heterosis. Corn, in particular, is basically all hybrids."',
  body: `**Hybrid vigor** (**heterosis**) is when hybrids of two distant lineages outperform either parent. Mechanisms include heterozygosity at deleterious recessives and complementation of gene dosage.

The mirror image of inbreeding depression.`,
  glossary: ['hybrid-vigor', 'heterosis'],
  focusGeneId: 'color',
  initialDominantFreq: 0.5,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch35',
  force: 'hybrid-vigor',
})

// Ch 35 — Speciation.
export const ch35 = evolutionaryChapter({
  id: 'ch35',
  order: 35,
  concept: 'Speciation — populations become species',
  title: 'Two roads diverge',
  storyIntro: 'Prof. Weaver:\n"Given enough isolation, gene flow drops to zero. Populations diverge. Eventually they can\'t breed even when reintroduced. That\'s a species split."',
  storyOutro: 'Prof. Weaver:\n"You\'ve completed the Student tier. Every major evolutionary force has been in your hands. The Researcher tier ahead deals in molecules — sequences, methylation, editing."',
  body: `**Speciation** is the formation of new species from ancestral populations. Isolation lets populations accumulate genetic differences (via drift, selection, mutation) until they can no longer interbreed successfully.

Mechanisms: **allopatric** (geographic separation), **sympatric** (same location, ecological or behavioral separation), and everything in between.`,
  glossary: ['speciation', 'reproductive-isolation'],
  focusGeneId: 'color',
  initialDominantFreq: 0.5,
  populationSize: 48,
  generationsToExplore: 5,
  nextChapterId: 'ch36',
  force: 'speciation',
})
