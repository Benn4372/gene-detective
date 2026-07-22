import type { GlossaryTerm } from './types'

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'chromosome',
    name: 'Chromosome',
    overview: `A chromosome is a long strand of DNA — think of it as one very thick book packed with hundreds or thousands of "recipes" (genes). Every blob has multiple chromosomes; the exact number depends on the species.

Chromosomes come in matched pairs. One copy of each pair comes from the mother, one from the father. When a blob makes egg or sperm cells, the pairs split apart so each cell gets just one copy of every chromosome.`,
    fullArticle: `Chromosomes are the physical structures that carry genes. In humans, there are 23 pairs; different species have different numbers.

Because chromosomes come in pairs, every gene exists in duplicate — one copy from each parent. This is why we can talk about "two versions" of any gene. When the two versions differ, we call each a different **allele** of the gene.

Chromosomes also matter for which traits get inherited together. Genes on the same chromosome tend to move as a unit unless a process called *recombination* shuffles them. Genes on different chromosomes are inherited completely independently. That's why the very first genetic experiments (Mendel's peas) worked so cleanly — he happened to pick traits on separate chromosomes.`,
    relatedTerms: ['gene', 'allele', 'independent-assortment'],
  },
  {
    id: 'gene',
    name: 'Gene',
    overview: `A gene is a specific stretch of DNA that carries the instructions for one trait. Think of it as a single recipe in a huge cookbook.

Every blob has two copies of every gene — one inherited from mother, one from father. The two copies don't have to be identical; when they differ, we call each version an *allele*.`,
    fullArticle: `Every gene sits at a specific location, or *locus*, on a specific chromosome. That location is fixed — a gene doesn't move around.

What varies is the *content* at that location: the sequence of DNA letters. Different sequences can produce different versions of the same recipe, and those variants are called **alleles**. A gene for antennae might have an allele that says "grow antennae" and another that says "don't grow antennae."

Because every blob has two copies of every gene, it has two alleles at every locus. Those two alleles interact — sometimes one dominates the other, sometimes they blend, sometimes both show up at once. Which rule applies is a property of the gene, and it's what these lessons walk through one at a time.`,
    relatedTerms: ['chromosome', 'allele', 'genotype'],
  },
  {
    id: 'allele',
    name: 'Allele',
    overview: `An allele is one specific version of a gene. If a gene has a "with antennae" version and a "without antennae" version, each of those is an allele.

We usually write alleles as single letters — capital for dominant (like "A"), lowercase for recessive (like "a"). A blob with two copies of the same allele is *homozygous* for that trait; a blob with two different alleles is *heterozygous*.`,
    fullArticle: `Because every blob has two copies of every gene, it also has two alleles at every locus. Those two alleles can be the same (homozygous) or different (heterozygous).

Some genes have more than two possible alleles in the population — human ABO blood type has three (I<sup>A</sup>, I<sup>B</sup>, i), for instance. Any one individual still only carries two of them, but the *population* pool of possible variants can be larger. This is the setup for the "multiple alleles" lessons later.`,
    relatedTerms: ['gene', 'genotype', 'dominant', 'recessive'],
  },
  {
    id: 'genotype',
    name: 'Genotype',
    overview: `A genotype is the actual set of alleles a blob carries — its genetic identity for one gene or many. It's the information side of things: what's written in the DNA.

You write a genotype as the two alleles, side by side. "AA" means two dominant alleles; "aa" means two recessives; "Aa" means one of each.`,
    fullArticle: `Genotypes are hidden. You can't see them by looking at a blob — you can only *deduce* them from what the blob looks like (phenotype) and what its offspring look like (breeding evidence).

That's the core detective mechanic of this game. The notebook won't accept a genotype guess until your breeding results actually rule out the alternatives. A blob with antennae could be AA or Aa — you have to breed it and watch what comes out to know which.`,
    relatedTerms: ['phenotype', 'allele', 'homozygous', 'heterozygous'],
  },
  {
    id: 'phenotype',
    name: 'Phenotype',
    overview: `A phenotype is what you actually see. It's the outward appearance or trait that results from the genotype.

Two blobs can share a phenotype but have different genotypes. A blob with antennae could be AA (two "with antennae" alleles) or Aa (one of each) — either way, the antennae show up.`,
    fullArticle: `Phenotype is the observable side of genetics. It includes color, shape, size, patterns — anything you can see (or measure).

Because a dominant allele overrides a recessive one in simple dominance, a heterozygote (Aa) has the same phenotype as a dominant homozygote (AA). This is why detective work matters: the phenotype tells you what's expressed, not what's carried. Hidden recessive alleles only show up in offspring when both parents happen to pass one along.

Later lessons introduce inheritance patterns where phenotype is more complicated — incomplete dominance blends the two alleles into an intermediate, codominance shows both at once, and environmental factors can shift phenotype without changing genotype at all.`,
    relatedTerms: ['genotype', 'dominant', 'recessive'],
  },
  {
    id: 'dominant',
    name: 'Dominant allele',
    overview: `A dominant allele is one that shows up in the phenotype whenever it's present, even if the other allele is different. In simple dominance, one copy is enough.

Convention: dominant alleles are written with a capital letter (A). If a blob is Aa, the A is dominant, so the blob shows the "A" phenotype and hides the "a" allele.`,
    fullArticle: `Dominance is a property of the *relationship between two alleles*, not an inherent property of one allele. The A allele is dominant *over* a — but if we introduced a third allele that overrode A, then A would be recessive to that new one.

The word "dominant" doesn't mean "better" or "more common." Plenty of recessive alleles are much more common than the dominant ones. Being dominant just means the trait shows up with one copy.`,
    relatedTerms: ['recessive', 'allele', 'phenotype'],
  },
  {
    id: 'recessive',
    name: 'Recessive allele',
    overview: `A recessive allele is one that only shows up in the phenotype when the blob has *two* copies of it. One copy alone stays hidden behind a dominant partner.

Convention: recessive alleles are written with a lowercase letter (a). A blob is only "a" phenotype if its genotype is aa.`,
    fullArticle: `Recessive alleles are the reason genetics is a detective game. Because they hide behind dominant partners, a heterozygous blob (Aa) can silently carry a recessive allele for generations before it happens to meet another carrier and produce visibly-recessive offspring.

The moment a recessive phenotype appears in a litter is a huge clue. It means *both* parents must be carrying at least one copy of the recessive allele — either homozygous recessive themselves, or heterozygous carriers.`,
    relatedTerms: ['dominant', 'allele', 'phenotype'],
  },
  {
    id: 'homozygous',
    name: 'Homozygous',
    overview: `A blob is homozygous for a gene when its two alleles are the same. AA is homozygous dominant; aa is homozygous recessive.

A homozygous blob will always pass on the same allele — every one of its gametes carries that same version.`,
    fullArticle: `Homozygous individuals are often called "true-breeding" for a trait, because their offspring (when crossed with another homozygote of the same type) will always show the same phenotype.`,
    relatedTerms: ['heterozygous', 'true-breeding', 'genotype'],
  },
  {
    id: 'heterozygous',
    name: 'Heterozygous',
    overview: `A blob is heterozygous for a gene when its two alleles are different. Aa is heterozygous.

Heterozygotes are the interesting ones. They carry a hidden recessive allele that can surface in the next generation.`,
    fullArticle: `Because a heterozygote (Aa) has two different alleles, half of its gametes carry A and half carry a. This 50/50 split is the source of the classic 3:1 phenotype ratio in monohybrid crosses.

Heterozygotes are sometimes called "carriers" for a recessive trait, especially when the recessive form is a genetic disease. They don't show the trait themselves but can pass it on.`,
    relatedTerms: ['homozygous', 'allele', 'genotype'],
  },
  {
    id: 'punnett-square',
    name: 'Punnett square',
    overview: `A Punnett square is a grid used to work out all the possible offspring from a cross. Along the top go the possible alleles from one parent; down the side, the alleles from the other. Each cell shows one possible offspring genotype.

For an Aa × Aa cross, the square has four cells: AA, Aa, Aa, aa — the classic 1:2:1 genotype ratio.`,
    fullArticle: `The Punnett square is a bookkeeping tool. It doesn't predict what any single offspring will be — it shows the probability distribution across all possible outcomes.

For two-gene (dihybrid) crosses, the square gets larger — 16 cells for AaBb × AaBb. Larger still for three or four traits. At some point spreadsheets or math take over from the visual grid, but the underlying logic is the same: enumerate every possible combination and count them.

The notebook has a Punnett generator built in: drag two hypothesized genotypes into it and it fills in the grid for you.`,
    relatedTerms: ['gamete', 'monohybrid-cross', 'dihybrid-cross'],
  },
  {
    id: 'gamete',
    name: 'Gamete',
    overview: `A gamete is a reproductive cell — an egg or a sperm. It carries just one copy of every gene, so that when egg and sperm meet, the offspring ends up with two copies again.

If a blob is Aa, its gametes are 50% A and 50% a. If it's AA, all its gametes are A.`,
    fullArticle: `Gametes are produced by a special cell division called *meiosis*, which splits the two copies of each chromosome apart. That's why offspring get exactly one allele from each parent per gene.

Meiosis also shuffles which allele goes into which gamete, independently for each chromosome. This shuffling is what makes independent assortment work.`,
    relatedTerms: ['punnett-square', 'meiosis', 'chromosome'],
  },
  {
    id: 'test-cross',
    name: 'Test cross',
    overview: `A test cross is a cross with a homozygous recessive partner (aa) done specifically to figure out whether a mystery blob is AA or Aa.

If the mystery blob is AA, all offspring will be Aa (dominant phenotype). If it's Aa, about half the offspring will be aa (recessive phenotype). The difference is the give-away.`,
    fullArticle: `The test cross is the workhorse technique of classical genetics. Any time you have a dominant-phenotype individual and want to know its genotype, you cross it against a known homozygous recessive.

The larger the litter, the more confident you can be. If a suspected-Aa parent produces 20 offspring and none are recessive, that's very unlikely if it truly is Aa — you'd expect about 10. That's the intuition behind the more formal statistical tests that come later.`,
    relatedTerms: ['punnett-square', 'homozygous', 'heterozygous'],
  },
  {
    id: 'monohybrid-cross',
    name: 'Monohybrid cross',
    overview: `A monohybrid cross tracks just one trait at a time. Two parents, one gene, one Punnett square.

The classic Aa × Aa monohybrid cross produces a 3:1 dominant:recessive phenotype ratio (and 1:2:1 AA:Aa:aa genotype ratio).`,
    fullArticle: `Monohybrid crosses are the starting point for genetics. By isolating one gene at a time, you can figure out its inheritance pattern without other genes muddying the picture.`,
    relatedTerms: ['dihybrid-cross', 'punnett-square'],
  },
  {
    id: 'dihybrid-cross',
    name: 'Dihybrid cross',
    overview: `A dihybrid cross tracks two traits at once. If both traits are on different chromosomes, they get shuffled independently.

The classic AaBb × AaBb dihybrid cross produces a 9:3:3:1 phenotype ratio across the four combinations of dominant/recessive for each trait.`,
    fullArticle: `Dihybrid ratios like 9:3:3:1 only hold when the two genes are on different chromosomes (or so far apart on the same chromosome that recombination effectively unlinks them). If they're linked, the ratios distort — which becomes its own detective clue later.`,
    relatedTerms: ['monohybrid-cross', 'independent-assortment', 'linked-genes'],
  },
  {
    id: 'independent-assortment',
    name: 'Independent assortment',
    overview: `Independent assortment is the rule that says: which allele of gene A ends up in a gamete has nothing to do with which allele of gene B ends up in the same gamete — as long as A and B are on different chromosomes.

This is why two-trait crosses of unlinked genes produce the 9:3:3:1 ratio: each trait segregates independently, and the ratios multiply.`,
    fullArticle: `The rule breaks down for genes on the same chromosome — those tend to stay together as the chromosome moves through meiosis. This exception is the doorway to linkage mapping, a technique that lets scientists work out the physical order of genes along a chromosome from how often traits are inherited together.`,
    relatedTerms: ['dihybrid-cross', 'linked-genes'],
  },
  {
    id: 'f1-generation',
    name: 'F1 generation',
    overview: `The F1 generation is the offspring of the original cross — the "first filial" generation. If you cross AA × aa (the parental or P generation), all F1 offspring are Aa.

F1 offspring of two true-breeding parents are all heterozygous and all look identical, which is why F1s are usually uniform.`,
    fullArticle: `F1 crosses are the setup for F2 discoveries. The F2 (F1 × F1) is where the classic 3:1 ratios show up — the hidden recessive alleles that F1 heterozygotes have been carrying finally get a chance to combine.`,
    relatedTerms: ['f2-generation', 'true-breeding'],
  },
  {
    id: 'f2-generation',
    name: 'F2 generation',
    overview: `The F2 generation is the offspring of two F1 individuals — the "second filial" generation. If F1 is Aa, then F2 (from Aa × Aa) shows the classic 1:2:1 genotype and 3:1 phenotype ratios.

F2 is where the hidden recessive alleles finally resurface.`,
    fullArticle: `Mendel discovered inheritance by counting F2 phenotypes in his pea plants. He noticed the same 3:1 ratio for trait after trait, and reasoned backward from that pattern to the concept of dominant and recessive alleles.`,
    relatedTerms: ['f1-generation', 'monohybrid-cross'],
  },
  {
    id: 'true-breeding',
    name: 'True-breeding',
    overview: `A true-breeding blob is homozygous for the trait in question — either AA or aa — so when bred with another true-breeder of the same type, all offspring share that trait.

Pea plants that always produce yellow seeds when self-crossed are true-breeding for yellow.`,
    fullArticle: `True-breeding lines are useful because their offspring are predictable. Breeders and geneticists rely on them as reference points — a "known quantity" they can cross against to reveal what an unknown parent is carrying (see: test cross).`,
    relatedTerms: ['homozygous', 'test-cross'],
  },
]

export const glossaryById: Record<string, GlossaryTerm> = Object.fromEntries(
  glossaryTerms.map(t => [t.id, t]),
)
