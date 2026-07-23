import type { Chapter } from '../types'

// Chapter 6 — Multiple Alleles
//
// The horns gene has THREE alleles in a linear dominance hierarchy:
// L (long, rank 3) > M (medium, rank 2) > n (short, rank 1). Any diploid
// combination expresses the highest-ranked allele.
export const ch06: Chapter = {
  id: 'ch06',
  order: 6,
  tier: 'curious',
  concept: 'Multiple alleles — more than two versions of a gene',
  title: 'A three-way choice',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, pointing at three blobs of markedly different horn length:
"Look at their horns — long, medium, and short. Same gene, three alleles instead of two."
"L is dominant to both M and n. M is dominant to n. Any blob will show its highest-ranked allele's phenotype."`,

  storyOutro: `Prof. Weaver:
"With three alleles the possibilities grow — six genotypes but only three visible phenotypes. Long-horned blobs can hide either an M or an n; medium-horned ones can hide an n. Fieldwork needs care."
"Tomorrow: an even weirder twist. Some genes only really show up in one sex."`,

  pinnedGlossaryTerms: [
    'multiple-alleles',
    'dominance-series',
    'allele',
    'genotype',
  ],

  stages: {
    show: {
      body: `Most genes we've seen so far have had two alleles. But nothing stops a gene from having **three, four, or more** — as long as any single blob still only carries two of them (one from each parent).

Our horns gene has three alleles:

- **L** (long, dominant over M and n)
- **M** (medium, dominant over n only)
- **n** (short, recessive to both)

Genotypes and their phenotypes:

- **LL, LM, Ln** → long horns
- **MM, Mn** → medium horns
- **nn** → short horns

Six genotypes, only three phenotypes. A long-horned blob might be LL, LM, or Ln — you can't tell from looking. It takes a testcross to unmask.`,
      workedExample: {
        parents: [
          { horns: ['L', 'n'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
          { horns: ['M', 'n'], antennae: ['a', 'a'], spots: ['s', 's'], tail: ['t', 't'] },
        ],
        narration: [
          'Mother is Ln — long horns, hiding an n.',
          'Father is Mn — medium horns, hiding an n.',
          'Possible offspring: LM, Ln, Mn, nn — four genotypes, three phenotypes.',
          'The nn short-horn offspring is the smoking gun that both parents were heterozygous.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            horns: ['L', 'n'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Long-horn α',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            horns: ['M', 'n'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Mid-horn β',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'horns', correctGenotype: 'Ln' },
        { creatureRole: 'father', geneId: 'horns', correctGenotype: 'Mn' },
      ],
      litterSize: 6,
      scaffolding: {
        onOpen:
          "Mother shows long horns, father shows medium. Both hide something — but what? Try breeding and look for short-horn offspring: they can only exist if BOTH parents carry an n.",
        onWrongHypothesis: {
          'mother:horns:LL':
            "Possible in principle — but if she were LL, she couldn't produce a short-horn child. Have you seen one? If yes, she isn't LL.",
          'mother:horns:LM':
            "LM is possible for a long-horned blob — but LM × Mn couldn't produce a short-horn (nn) child. If you've bred one, LM is ruled out.",
          'father:horns:MM':
            "MM would rule out any nn offspring. If you've seen a short-horn child, father must be Mn.",
        },
      },
    },

    // Solo poses the same three-allele reasoning with a same-phenotype pair.
    // Both parents show medium horns — the visible dominant is 'M' — but
    // short-horn offspring reveal both are hiding an n.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            horns: ['M', 'n'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Mid-horn γ',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            horns: ['M', 'n'],
            antennae: ['a', 'a'],
            spots: ['s', 's'],
            tail: ['t', 't'],
          },
          defaultName: 'Mid-horn δ',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'horns', correctGenotype: 'Mn' },
        { creatureRole: 'father', geneId: 'horns', correctGenotype: 'Mn' },
      ],
      litterSize: 6,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: "This time both parents look identical — medium horns. Each could be MM or Mn. Which is it?",
        },
        {
          stage: 'point',
          text: "MM × MM → every offspring MM (medium). If ANY short-horn (nn) child appears, both parents must be carrying n.",
        },
        {
          stage: 'suggest',
          text: 'Look for a short-horn offspring. Enter Mn for both. Roughly 1 in 4 offspring should be nn.',
        },
      ],
    },
  },

  unlocks: {
    traits: ['horns'],
    nextChapterId: 'ch07',
  },

  trophyBlobPreset: {
    sex: 'F',
    genotype: {
      horns: ['L', 'M'],
      antennae: ['a', 'a'],
      spots: ['s', 's'],
      tail: ['t', 't'],
    },
    defaultName: 'LM Trophy',
  },
}
