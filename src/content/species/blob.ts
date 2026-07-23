import type { Species } from '../../engine/types'

// The one and only species for now.
// Traits start binary and simple; more genes get added as later lessons unlock.
export const blobSpecies: Species = {
  id: 'blob',
  name: 'Blob',
  sexSystem: 'XY',
  chromosomes: [
    { id: 'auto-1', type: 'autosome', lengthCM: 100 },
    { id: 'auto-2', type: 'autosome', lengthCM: 100 },
    // Ch 24: a small nondisjunction rate so trisomy events are occasionally
    // observable in offspring from chapters after 24.
    { id: 'auto-3', type: 'autosome', lengthCM: 100, nondisjunctionRate: 0.008 },
    { id: 'X', type: 'sex-X', lengthCM: 100 },
    { id: 'Y', type: 'sex-Y', lengthCM: 20 },
    { id: 'mito', type: 'mitochondrial', lengthCM: 16 },
  ],
  genes: [
    {
      id: 'antennae',
      name: 'Antennae',
      chromosome: 'auto-1',
      locusCM: 50,
      inheritanceModel: 'simpleDominant',
      // Ch 15: pleiotropy — the same antennae gene also expresses a secondary
      // 'metabolism' trait. One gene, two phenotypes.
      expressesTraits: ['antennae', 'metabolism'],
      alleles: [
        { id: 'A', symbol: 'A', dominanceRank: 1 },
        { id: 'a', symbol: 'a', dominanceRank: 0 },
      ],
    },
    {
      id: 'spots',
      name: 'Spots',
      chromosome: 'auto-2',
      locusCM: 30,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['spots'],
      alleles: [
        { id: 'S', symbol: 'S', dominanceRank: 1 },
        { id: 's', symbol: 's', dominanceRank: 0 },
      ],
    },
    {
      id: 'color',
      name: 'Color',
      chromosome: 'auto-1',
      locusCM: 90,
      inheritanceModel: 'incompleteDominant',
      expressesTraits: ['color'],
      alleles: [
        { id: 'R', symbol: 'R', dominanceRank: 1 },
        { id: 'w', symbol: 'w', dominanceRank: 0 },
      ],
      // Epistasis: coatPigment 'cc' masks color as 'yellow' regardless of
      // R/w alleles. Introduced in Ch 9 — the pigment gene supplies the
      // biological reason for a coat's colour to appear at all.
      epistasisRules: [
        {
          ifGene: 'coatPigment',
          ifGenotypeMatches: (alleles) =>
            alleles.length === 2 && alleles.every(a => a === 'c'),
          maskWith: 'yellow',
        },
      ],
    },
    {
      id: 'coatPigment',
      name: 'Coat Pigment',
      chromosome: 'auto-2',
      locusCM: 15,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['coatPigment'],
      alleles: [
        { id: 'C', symbol: 'C', dominanceRank: 1 },
        { id: 'c', symbol: 'c', dominanceRank: 0 },
      ],
    },
    // Three polygenic size genes. Each contributes one "large" allele to the
    // additive tally. Total range: 0 (smallest) to 6 (largest). Renderer scales
    // the entire blob group based on the sum.
    {
      id: 'sizeA',
      name: 'Size (Ⅰ)',
      chromosome: 'auto-1',
      locusCM: 20,
      inheritanceModel: 'polygenic',
      expressesTraits: ['size'],
      alleles: [
        { id: 'X', symbol: 'X', dominanceRank: 1 },
        { id: 'x', symbol: 'x', dominanceRank: 0 },
      ],
    },
    {
      id: 'sizeB',
      name: 'Size (Ⅱ)',
      chromosome: 'auto-2',
      locusCM: 60,
      inheritanceModel: 'polygenic',
      expressesTraits: ['size'],
      alleles: [
        { id: 'Y', symbol: 'Y', dominanceRank: 1 },
        { id: 'y', symbol: 'y', dominanceRank: 0 },
      ],
    },
    {
      id: 'sizeC',
      name: 'Size (Ⅲ)',
      chromosome: 'auto-3',
      locusCM: 80,
      inheritanceModel: 'polygenic',
      expressesTraits: ['size'],
      alleles: [
        { id: 'Z', symbol: 'Z', dominanceRank: 1 },
        { id: 'z', symbol: 'z', dominanceRank: 0 },
      ],
    },
    {
      id: 'heatSpot',
      name: 'Heat Spot',
      chromosome: 'auto-3',
      locusCM: 20,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['heatSpot'],
      // Only expresses at warm temperatures. Below 70 the dominant H allele
      // reads as recessive — a temperature-sensitive gene.
      environmentalThreshold: 70,
      alleles: [
        { id: 'H', symbol: 'H', dominanceRank: 1 },
        { id: 'h', symbol: 'h', dominanceRank: 0 },
      ],
    },
    {
      id: 'sparkle',
      name: 'Sparkle',
      chromosome: 'auto-2',
      locusCM: 45,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['sparkle'],
      // Deliberately unstable — mutations flip an allele in ~3% of gametes.
      // Introduced in Ch13 to demonstrate spontaneous variation.
      mutationRate: 0.03,
      alleles: [
        { id: 'K', symbol: 'K', dominanceRank: 1 },
        { id: 'k', symbol: 'k', dominanceRank: 0 },
      ],
    },
    // Ch18 — mitochondrial. Single-allele inheritance from mother only.
    {
      id: 'mitoHalo',
      name: 'Mito Halo',
      chromosome: 'mito',
      locusCM: 5,
      inheritanceModel: 'mitochondrial',
      expressesTraits: ['mitoHalo'],
      alleles: [
        { id: 'Q', symbol: 'Q', dominanceRank: 1 },
        { id: 'q', symbol: 'q', dominanceRank: 0 },
      ],
    },
    // Ch 16 — sex-influenced dominance. In females the C-allele is recessive;
    // in males it's dominant. Same genotype, different phenotype by sex.
    {
      id: 'braincrest',
      name: 'Brain Crest',
      chromosome: 'auto-3',
      locusCM: 90,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['braincrest'],
      sexInfluenced: true,
      alleles: [
        { id: 'W', symbol: 'W', dominanceRank: 1 },
        { id: 'w', symbol: 'w', dominanceRank: 0 },
      ],
    },
    // Ch 17 — sex-limited. Only females can express a brood pouch.
    {
      id: 'broodPouch',
      name: 'Brood Pouch',
      chromosome: 'auto-2',
      locusCM: 5,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['broodPouch'],
      sexLimitedTo: 'F',
      alleles: [
        { id: 'U', symbol: 'U', dominanceRank: 1 },
        { id: 'u', symbol: 'u', dominanceRank: 0 },
      ],
    },
    // Ch 19 — imprinting. Maternal allele silenced; only paternal copy
    // expresses. Reciprocal crosses give different phenotypes.
    {
      id: 'imprintMark',
      name: 'Imprint Mark',
      chromosome: 'auto-3',
      locusCM: 40,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['imprintMark'],
      imprintOrigin: 'maternal',
      alleles: [
        { id: 'J', symbol: 'J', dominanceRank: 1 },
        { id: 'j', symbol: 'j', dominanceRank: 0 },
      ],
    },
    // Introduced in Ch14. The dominant 'Y' allele is lethal when homozygous
    // (YY dies before observation). Yy is viable and yellow; yy is viable and
    // black. Yellow × yellow crosses produce a 2:1 yellow:black ratio instead
    // of the expected 3:1.
    {
      id: 'lethalCoat',
      name: 'Lethal Coat',
      chromosome: 'auto-3',
      locusCM: 65,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['lethalCoat'],
      lethalGenotypes: ['YY'],
      alleles: [
        { id: 'Y', symbol: 'Y', dominanceRank: 1 },
        { id: 'y', symbol: 'y', dominanceRank: 0 },
      ],
    },
    {
      id: 'pattern',
      name: 'Pattern',
      chromosome: 'auto-2',
      locusCM: 80,
      inheritanceModel: 'codominant',
      expressesTraits: ['pattern'],
      alleles: [
        { id: 'T', symbol: 'T', dominanceRank: 1 },
        { id: 'B', symbol: 'B', dominanceRank: 1 },
      ],
    },
    {
      id: 'horns',
      name: 'Horns',
      chromosome: 'auto-3',
      locusCM: 50,
      inheritanceModel: 'multipleAllele',
      expressesTraits: ['horns'],
      alleles: [
        { id: 'L', symbol: 'L', dominanceRank: 3 },
        { id: 'M', symbol: 'M', dominanceRank: 2 },
        { id: 'n', symbol: 'n', dominanceRank: 1 },
      ],
    },
    {
      id: 'eyeGlow',
      name: 'Eye Glow',
      chromosome: 'X',
      locusCM: 40,
      inheritanceModel: 'sexLinked',
      expressesTraits: ['eyeGlow'],
      alleles: [
        { id: 'G', symbol: 'G', dominanceRank: 1 },
        { id: 'g', symbol: 'g', dominanceRank: 0 },
      ],
    },
    {
      id: 'fins',
      name: 'Fins',
      chromosome: 'auto-1', // 5 cM from antennae → tightly linked
      locusCM: 55,
      inheritanceModel: 'simpleDominant',
      expressesTraits: ['fins'],
      alleles: [
        { id: 'F', symbol: 'F', dominanceRank: 1 },
        { id: 'f', symbol: 'f', dominanceRank: 0 },
      ],
    },
  ],
  traits: [
    {
      id: 'antennae',
      name: 'Antennae',
      category: 'visible',
      description: 'Two little antennae on top of the head.',
    },
    {
      id: 'spots',
      name: 'Spots',
      category: 'visible',
      description: 'A polka-dot pattern on the body.',
    },
    {
      id: 'color',
      name: 'Color',
      category: 'visible',
      description:
        "A blob's body colour. Red and white blend into pink in the heterozygote — a textbook example of incomplete dominance.",
    },
    {
      id: 'pattern',
      name: 'Pattern',
      category: 'visible',
      description:
        'A codominant surface pattern — stripes, blotches, or both simultaneously in the heterozygote.',
    },
    {
      id: 'horns',
      name: 'Horns',
      category: 'visible',
      description:
        'Head horns. Three-allele series with linear dominance: long > medium > short.',
    },
    {
      id: 'eyeGlow',
      name: 'Eye Glow',
      category: 'visible',
      description:
        'A soft glow around the eyes. X-linked — much more common in males (with only one X) than females.',
    },
    {
      id: 'fins',
      name: 'Fins',
      category: 'visible',
      description:
        'Small side fins. Sits close to the antennae gene on chromosome 1 — linked, not independent.',
    },
    {
      id: 'coatPigment',
      name: 'Coat Pigment',
      category: 'chemical',
      description:
        'Whether the body deposits any colour at all. Recessive cc masks the color gene: cc individuals are yellow regardless of R/w.',
    },
    {
      id: 'size',
      name: 'Size',
      category: 'visible',
      description:
        'Body size — continuous, driven by three additive genes. Each large-allele copy adds a bit of size; the total ranges from 0 (smallest) to 6 (largest).',
    },
    {
      id: 'heatSpot',
      name: 'Heat Spot',
      category: 'visible',
      description:
        'A warm-glow spot on the back that only appears when the ambient temperature is warm enough (≥70). At cold temperatures, even H individuals look plain.',
    },
    {
      id: 'sparkle',
      name: 'Sparkle',
      category: 'visible',
      description:
        'A tiny sparkle-star on the body. Unstable gene: the K allele mutates spontaneously about 3% of the time — so sparkling offspring can appear even from non-sparkling parents.',
    },
    {
      id: 'mitoHalo',
      name: 'Mito Halo',
      category: 'visible',
      description:
        'A faint halo around the head, inherited only from the mother via mitochondrial DNA. All offspring look like their mother for this trait.',
    },
    {
      id: 'metabolism',
      name: 'Metabolism',
      category: 'chemical',
      description:
        'A metabolic signature secreted by antennae-gene-carriers. A pleiotropic effect of the antennae gene — not visible on the blob, but detectable via the Codex.',
    },
    {
      id: 'braincrest',
      name: 'Brain Crest',
      category: 'visible',
      description:
        'A ridge on top of the head. Sex-influenced: W dominates in males, but w dominates in females — same genotype, opposite phenotype.',
    },
    {
      id: 'broodPouch',
      name: 'Brood Pouch',
      category: 'visible',
      description:
        'A soft pouch on the underside. Sex-limited to females — males with the U allele carry it silently and can still pass it to daughters.',
    },
    {
      id: 'imprintMark',
      name: 'Imprint Mark',
      category: 'visible',
      description:
        "A tell-tale band across the middle. Genomically imprinted — only the paternal copy expresses. Reciprocal crosses give opposite results.",
    },
    {
      id: 'lethalCoat',
      name: 'Lethal Coat',
      category: 'visible',
      description:
        'A vivid coat colour where the dominant Y allele is lethal when homozygous. Yy blobs are yellow-tinged; yy blobs are dark. YY offspring die before observation, distorting the expected 3:1 ratio to 2:1.',
    },
  ],
}
