import { researcherChapter } from './_researcher'

// D1 — Quantitative + statistical (Ch 36-40)

export const ch36 = researcherChapter({
  id: 'ch36', order: 36,
  concept: 'Heritability and breeder\'s equation',
  title: 'How much is genetic?',
  storyIntro: 'Prof. Weaver:\n"Heritability is the fraction of phenotypic variance that\'s genetic. Selective breeding depends on it — no genetic variance, no selection response."',
  storyOutro: 'Prof. Weaver:\n"R = h² × S. That\'s the breeder\'s equation. R = response to selection, h² = heritability, S = selection differential."',
  body: `**Heritability** (h²) is the fraction of trait variance attributable to genetics. The **breeder\'s equation** predicts how fast selection changes a population:

R = h² × S

Where R is the mean phenotype change per generation and S is how strong the selection is.`,
  glossary: ['heritability', 'breeders-equation'],
  nextChapterId: 'ch37',
  interactionMode: { kind: 'researcher-widget', widget: 'heritability' },
})

export const ch37 = researcherChapter({
  id: 'ch37', order: 37,
  concept: 'QTL mapping',
  title: 'Locus hunt',
  storyIntro: 'Prof. Weaver:\n"Quantitative Trait Loci — the genomic regions influencing a continuous trait. Modern statistics maps them by association."',
  storyOutro: 'Prof. Weaver:\n"QTL mapping needs a mapping population and lots of markers. Then LOD scores tell you where the causal loci sit."',
  body: `**QTL mapping** identifies the genomic regions that contribute to a **quantitative trait**. You breed a mapping population, genotype markers across the genome, and score each marker\'s association with the trait.

Regions with high **LOD scores** are the QTLs.`,
  glossary: ['qtl', 'lod-score'],
  nextChapterId: 'ch38',
  interactionMode: { kind: 'researcher-widget', widget: 'qtl-scan' },
})

export const ch38 = researcherChapter({
  id: 'ch38', order: 38,
  concept: 'Norm of reaction',
  title: 'Same genes, different worlds',
  storyIntro: 'Prof. Weaver:\n"Same genotype, different environment, different phenotype. Plot phenotype vs environment for each genotype — that\'s the norm of reaction."',
  storyOutro: 'Prof. Weaver:\n"Crossing reaction norms are the tell-tale sign of gene × environment interaction — G×E."',
  body: `A **norm of reaction** is the plot of phenotype against environment for a fixed genotype. Different genotypes have different curves.

When curves **cross**, no single genotype is best in every environment — that\'s **G×E interaction**.`,
  glossary: ['norm-of-reaction', 'gxe'],
  nextChapterId: 'ch39',
  interactionMode: { kind: 'researcher-widget', widget: 'reaction-norm' },
})

export const ch39 = researcherChapter({
  id: 'ch39', order: 39,
  concept: 'Three-point cross / linkage mapping',
  title: 'Ordering the loci',
  storyIntro: 'Prof. Weaver:\n"Three markers on one chromosome. Cross a triple heterozygote to a triple recessive. Count offspring classes — the rare ones tell you the gene order."',
  storyOutro: 'Prof. Weaver:\n"The rarest offspring classes are DOUBLE crossovers between the outer pair. That gives you the middle marker."',
  body: `A **three-point cross** determines the ORDER of three linked genes. Cross AaBbCc × aabbcc. Count offspring by class. The two rarest classes are the double-crossovers — their genotype tells you which gene sits in the middle.`,
  glossary: ['three-point-cross', 'linkage-map'],
  nextChapterId: 'ch40',
  interactionMode: { kind: 'researcher-widget', widget: 'three-point-cross' },
})

export const ch40 = researcherChapter({
  id: 'ch40', order: 40,
  concept: 'Threshold traits',
  title: 'Above the line',
  storyIntro: 'Prof. Weaver:\n"Some traits look discrete but hide a continuous underlying value. Cross a threshold and the phenotype flips."',
  storyOutro: 'Prof. Weaver:\n"Threshold traits explain a lot of \'is it there or not\' phenotypes — clubfoot, cleft palate, schizophrenia. All polygenic + threshold."',
  body: `A **threshold trait** appears discrete (present/absent) but is actually driven by an underlying continuous polygenic score. Only individuals above the threshold show the trait.

That's why a "yes/no" family history can produce mysterious inheritance patterns: siblings on either side of the threshold.`,
  glossary: ['threshold-trait', 'polygenic'],
  nextChapterId: 'ch41',
  unlockMentors: ['dr-nyx'],
  interactionMode: { kind: 'researcher-widget', widget: 'threshold-trait' },
})

// D2 — Molecular + epigenetic (Ch 41-47)

export const ch41 = researcherChapter({
  id: 'ch41', order: 41,
  concept: 'Mutation types',
  title: 'The taxonomy of change',
  storyIntro: 'Dr. Nyx:\n"Point, silent, missense, nonsense, frameshift, splice. Each has its own consequence — some silent, some catastrophic."',
  storyOutro: 'Dr. Nyx:\n"Read the DNA sequence to know which type. Same chromosome location, wildly different biological effect."',
  body: `Mutation types at the DNA level:

- **Silent** — codon change, same amino acid. No protein effect.
- **Missense** — codon change, different amino acid. Usually minor.
- **Nonsense** — codon change to a stop codon. Protein truncated. Severe.
- **Frameshift** — insertion/deletion off multiple of 3. Downstream nonsense. Very severe.
- **Splice-site** — disrupts intron/exon boundaries. Effects vary.`,
  glossary: ['point-mutation', 'frameshift', 'missense'],
  nextChapterId: 'ch42',
  interactionMode: {
    kind: 'dna-sequence',
    variants: [
      {
        label: 'Silent',
        before: 'ATG CGA GAT CCC TAA',
        after:  'ATG CGA GAC CCC TAA',
        consequence: 'GAT → GAC still codes aspartate. Protein unchanged.',
      },
      {
        label: 'Missense',
        before: 'ATG CGA GAT CCC TAA',
        after:  'ATG CGA GTT CCC TAA',
        consequence: 'GAT (Asp) → GTT (Val). One amino-acid substitution. Usually minor, sometimes disease-causing.',
      },
      {
        label: 'Nonsense',
        before: 'ATG CGA GAT CCC TAA',
        after:  'ATG CGA TAA CCC TAA',
        consequence: 'GAT → TAA (STOP). Protein truncated early. Almost always severe.',
      },
      {
        label: 'Frameshift (insertion)',
        before: 'ATG CGA GAT CCC TAA',
        after:  'ATG ACG AGA TCC CTA A--',
        consequence: 'One-base insertion shifts every downstream codon. Downstream sequence becomes garbage.',
      },
      {
        label: 'Splice-site',
        before: 'ATG CGA GAT ~CCC TAA',
        after:  'ATG CGA GAT ~CCT AAA',
        consequence: 'The intron boundary marker is corrupted. Splicing fails; the wrong exons join.',
      },
    ],
  },
})

export const ch42 = researcherChapter({
  id: 'ch42', order: 42,
  concept: 'Epigenetics — methylation',
  title: 'Marks on the DNA',
  storyIntro: 'Dr. Nyx:\n"DNA methylation silences genes without changing sequence. Heritable, reversible, environmentally-responsive."',
  storyOutro: 'Dr. Nyx:\n"Methylation marks pass through the maternal germline. Sometimes they get reset each generation. The rules are still being worked out."',
  body: `**Epigenetics** — heritable changes in gene expression WITHOUT changes in DNA sequence. The most common mechanism is **DNA methylation** at CpG sites.

Methylated regions are silenced. In our engine, methylating a gene forces its phenotype to the recessive value regardless of genotype. Try it below.`,
  glossary: ['epigenetics', 'methylation'],
  nextChapterId: 'ch43',
  interactionMode: {
    kind: 'methylation',
    focusGeneId: 'tail',
    motherGenotype: ['R', 'R'],
    fatherGenotype: ['w', 'w'],
  },
})

export const ch43 = researcherChapter({
  id: 'ch43', order: 43,
  concept: 'Transgenerational epigenetic inheritance',
  title: 'Grandpa\'s environment',
  storyIntro: 'Prof. Weaver:\n"When grandparents\' environment affects grandchildren via methylation, not sequence — that\'s transgenerational epigenetic inheritance."',
  storyOutro: 'Prof. Weaver:\n"Dutch Hunger Winter babies, Överkalix — humans have this too. Real, mysterious, controversial."',
  body: `**Transgenerational epigenetic inheritance** is when an environmental effect on one generation reaches grandchildren through methylation marks that survive germline reprogramming.

Documented in mice, plants, and cautiously in humans (Dutch Hunger Winter cohort, Överkalix cohort studies).`,
  glossary: ['transgenerational-epigenetics'],
  nextChapterId: 'ch44',
  interactionMode: { kind: 'researcher-widget', widget: 'transgenerational' },
})

export const ch44 = researcherChapter({
  id: 'ch44', order: 44,
  concept: 'Gene regulation and operons',
  title: 'Switches, not just wires',
  storyIntro: 'Prof. Weaver:\n"Genes don\'t just have alleles. They have regulatory regions — promoters, enhancers, silencers. Turn a gene on and off with signals."',
  storyOutro: 'Prof. Weaver:\n"The lac operon in E. coli is the classic case. Sugar tells the bacterium to switch on the genes that eat sugar."',
  body: `Gene expression is regulated at multiple levels — transcription factors binding promoters, enhancers acting from a distance, silencers repressing, methylation, chromatin state.

The **lac operon** in *E. coli* is the archetype: a cluster of genes controlled together, responsive to lactose availability.`,
  glossary: ['gene-regulation', 'operon', 'promoter'],
  nextChapterId: 'ch45',
  interactionMode: { kind: 'researcher-widget', widget: 'operon' },
})

export const ch45 = researcherChapter({
  id: 'ch45', order: 45,
  concept: 'Transposable elements',
  title: 'Jumping genes',
  storyIntro: 'Prof. Weaver:\n"Some DNA sequences cut themselves out and paste in elsewhere. Or copy themselves. Transposable elements. Barbara McClintock got the Nobel for spotting them in maize."',
  storyOutro: 'Prof. Weaver:\n"A big fraction of eukaryotic genomes is TE-derived. Most are dormant; a few still jump."',
  body: `**Transposable elements (TEs)** are DNA sequences that move around within a genome. Two main flavors:

- **DNA transposons** cut themselves out and paste in elsewhere.
- **Retrotransposons** copy themselves via an RNA intermediate.

TEs can disrupt genes, and revert (jump back out).`,
  glossary: ['transposable-elements', 'retrotransposon'],
  nextChapterId: 'ch46',
  interactionMode: { kind: 'researcher-widget', widget: 'transposable-element' },
})

export const ch46 = researcherChapter({
  id: 'ch46', order: 46,
  concept: 'Copy number variation',
  title: 'How many is too many?',
  storyIntro: 'Prof. Weaver:\n"Sometimes an individual has more than two copies of a gene. Sometimes fewer. Dosage matters."',
  storyOutro: 'Prof. Weaver:\n"CNVs contribute to disease risk. Autism, schizophrenia — polygenic and CNV-driven."',
  body: `**Copy Number Variation (CNV)** — genomic regions duplicated or deleted, giving individuals 1, 3, or more copies of certain genes instead of the usual 2. Phenotype scales with dosage.`,
  glossary: ['copy-number-variation'],
  nextChapterId: 'ch47',
  interactionMode: { kind: 'researcher-widget', widget: 'copy-number' },
})

export const ch47 = researcherChapter({
  id: 'ch47', order: 47,
  concept: 'Chimeras and mosaics',
  title: 'Two genotypes in one body',
  storyIntro: 'Prof. Weaver:\n"A chimera has cells from two different zygotes. A mosaic has cells from one zygote that diverged after fertilisation. Both bend the rules of \'one genotype per individual\'."',
  storyOutro: 'Prof. Weaver:\n"Chimeras happen in embryonic fusion, twin absorption, transplantation. Human blood chimeras are documented."',
  body: `A **chimera** contains cells from two originally separate zygotes. A **mosaic** contains genetically diverse cells derived from one zygote (via post-fertilisation mutation or X-inactivation).

Both make the "one individual, one genome" assumption occasionally false.`,
  glossary: ['chimera', 'mosaic'],
  nextChapterId: 'ch48',
  interactionMode: { kind: 'researcher-widget', widget: 'chimera' },
})

// D3 — Capstone (Ch 48-54)

export const ch48 = researcherChapter({
  id: 'ch48', order: 48,
  concept: 'CRISPR and gene editing',
  title: 'Rewriting the genome',
  storyIntro: 'Prof. Weaver:\n"You can now edit a specific allele in a live creature. CRISPR-Cas9 makes it cheap. Off-target risk is the catch."',
  storyOutro: 'Prof. Weaver:\n"Ethical and biological implications are still being worked out. Edited food animals are here; edited humans are contentious."',
  body: `**CRISPR-Cas9** is a directed nuclease system that cuts DNA at a sequence specified by a guide RNA. The cell repairs the break — sometimes accurately, sometimes with a small deletion, sometimes with a desired sequence template.

Result: targeted editing. But off-target cuts happen too, and every edit has a risk profile.`,
  glossary: ['crispr', 'gene-editing'],
  nextChapterId: 'ch49',
  interactionMode: { kind: 'researcher-widget', widget: 'crispr-editor' },
})

export const ch49 = researcherChapter({
  id: 'ch49', order: 49,
  concept: 'Cancer genetics',
  title: 'Cells that don\'t stop',
  storyIntro: 'Prof. Weaver:\n"Cancer is somatic mutation. Enough acquired mutations in tumour-suppressor and oncogene loci and a cell escapes its brakes."',
  storyOutro: 'Prof. Weaver:\n"Inherited cancer predispositions (BRCA, Rb) speed the process. But most cancers are somatic — acquired, not inherited."',
  body: `Cancer arises from accumulated **somatic mutations** in cells. Classical model: mutations in **oncogenes** (activators) and **tumour suppressors** (brakes) let a cell divide uncontrollably.

Some germline mutations (BRCA1, RB1) start the clock earlier — familial cancer syndromes.`,
  glossary: ['oncogene', 'tumour-suppressor'],
  nextChapterId: 'ch50',
  interactionMode: { kind: 'researcher-widget', widget: 'cancer-somatic' },
})

export const ch50 = researcherChapter({
  id: 'ch50', order: 50,
  concept: 'Conservation genetics',
  title: 'Rescue mission',
  storyIntro: 'Prof. Weaver:\n"An endangered blob population is collapsing under inbreeding depression. Can you build a rescue plan?"',
  storyOutro: 'Prof. Weaver:\n"Conservation genetics is applied population genetics. Every bit of theory you learned in the Curious tier matters here."',
  body: `**Conservation genetics** manages endangered populations to preserve genetic diversity. Key tools: inbreeding coefficient, effective population size (Ne), managed migration between subpopulations.

Genetic rescue via outcrossing to distant populations is often the difference between recovery and extinction.`,
  glossary: ['conservation-genetics', 'genetic-rescue'],
  nextChapterId: 'ch51',
  interactionMode: { kind: 'researcher-widget', widget: 'conservation-rescue' },
})

export const ch51 = researcherChapter({
  id: 'ch51', order: 51,
  concept: 'GWAS and personal genomics',
  title: 'Finding a needle in a haystack',
  storyIntro: 'Prof. Weaver:\n"You have a big population dataset and one trait. Which SNP is responsible? GWAS."',
  storyOutro: 'Prof. Weaver:\n"Consumer DNA tests use exactly this — polygenic risk scores. Predictive but not deterministic."',
  body: `A **Genome-Wide Association Study** compares genotype at millions of SNPs between individuals with and without a trait. SNPs that differ significantly (correcting for testing) point at causal or linked variants.

Personal genomics uses the same math to give individuals **polygenic risk scores**.`,
  glossary: ['gwas', 'snp', 'polygenic-risk-score'],
  nextChapterId: 'ch52',
  interactionMode: { kind: 'researcher-widget', widget: 'gwas-manhattan' },
})

export const ch52 = researcherChapter({
  id: 'ch52', order: 52,
  concept: 'Phylogenetics and the molecular clock',
  title: 'Trees from sequences',
  storyIntro: 'Prof. Weaver:\n"Related populations diverge over time. If mutation rate is roughly constant, sequence differences measure divergence time — the molecular clock."',
  storyOutro: 'Prof. Weaver:\n"Every branch of the tree of life was reconstructed with these methods. And it keeps getting revised as more genomes are sequenced."',
  body: `**Phylogenetics** infers evolutionary relationships from sequence data. Similar sequences → recent common ancestor. The **molecular clock** approximates divergence time as substitution count / mutation rate.

Not always constant (rate variation exists), but a workhorse of comparative genomics.`,
  glossary: ['phylogenetics', 'molecular-clock'],
  nextChapterId: 'ch53',
  interactionMode: { kind: 'researcher-widget', widget: 'phylogenetics-tree' },
})

export const ch53 = researcherChapter({
  id: 'ch53', order: 53,
  concept: 'Horizontal gene transfer',
  title: 'Sharing sideways',
  storyIntro: 'Prof. Weaver:\n"Bacteria pass genes to unrelated bacteria — via plasmids, phages, transformation. Not always parent-to-offspring."',
  storyOutro: 'Prof. Weaver:\n"Antibiotic resistance spreads this way. So does the ability to metabolise industrial waste. HGT is why bacteria are so adaptable."',
  body: `**Horizontal gene transfer (HGT)** is inheritance between unrelated organisms. Mechanisms include **conjugation** (plasmid exchange), **transduction** (virus-mediated), and **transformation** (uptake of environmental DNA).

Common in bacteria; rare but documented in eukaryotes.`,
  glossary: ['horizontal-gene-transfer', 'plasmid'],
  nextChapterId: 'ch54',
  interactionMode: { kind: 'researcher-widget', widget: 'hgt-plasmid' },
})

export const ch54 = researcherChapter({
  id: 'ch54', order: 54,
  concept: 'Prions — protein-only inheritance',
  title: 'When the protein IS the gene',
  storyIntro: 'Prof. Weaver:\n"Not all inheritance uses DNA. A prion is a misfolded protein that templates other copies of itself into the same misfolding."',
  storyOutro: 'Prof. Weaver:\n"You\'ve reached the end of the curriculum. The Curious tier asked \'what\'; the Student tier asked \'why\'; the Researcher tier asked \'how do we know\'. From here, the Master Sandbox is yours. The wild blob population is waiting."',
  body: `A **prion** is a protein that inherits its shape by templating other copies of the same protein into that shape. No DNA involved. Once seeded, the misfolded conformation propagates.

Classical examples: yeast [PSI+], mammalian scrapie / BSE / CJD. Deliberately weird capstone — protein-only heritable information.`,
  glossary: ['prion', 'protein-inheritance'],
  nextChapterId: undefined,
  trophyName: 'End-of-Course Trophy',
  interactionMode: { kind: 'researcher-widget', widget: 'prion-conformation' },
})
