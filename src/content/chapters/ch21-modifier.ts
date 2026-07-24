import type { Chapter } from '../types'
import { NEUTRAL_FEMALE, NEUTRAL_MALE } from './_scaffold'

// Ch 21 — Modifier genes. Genes that don't cause a trait themselves but tune
// (or, at the extreme, switch off) another gene's expression. Uses the same
// tailGrowth mechanism the player met in Ch 9, but framed as the broader
// "modifier" concept, and posed as a TEST CROSS puzzle to keep it distinct
// from Ch 9's both-parents-mystery arrangement.
export const ch21: Chapter = {
  id: 'ch21',
  order: 21,
  tier: 'student',
  concept: 'Modifier genes — one gene tuning another',
  title: 'The volume knob',
  mentorId: 'prof-weaver',

  storyIntro: `Prof. Weaver, tapping a field notebook:
"Back in Chapter 9 you met tailGrowth — the gene that switches the tail off entirely. That's the extreme end of a bigger category called **modifier genes**: genes whose whole job is to change how another gene expresses."
"Today, a mystery mother. I know the father is a Pp carrier — I bred him myself. Figure out whether the mother is PP or Pp."`,

  storyOutro: `Prof. Weaver:
"A test cross with a known heterozygote — the field geneticist's staple. If any offspring were tail-less, the mother had to be Pp. If none appeared across a big enough litter, she's almost certainly PP."
"Modifier genes explain variable expressivity in real biology — why the same disease-causing allele can be mild in one family and severe in another. Different modifier backgrounds."`,

  pinnedGlossaryTerms: ['modifier-gene', 'expressivity', 'test-cross'],

  stages: {
    show: {
      body: `A **modifier gene** doesn't produce its own visible trait — it changes how another gene expresses. Think of it as a volume knob on the other gene's output.

**tailGrowth** is the modifier you already know. Its two alleles:

- **PP or Pp** → tail-growth pathway on. The tail gene (T/t) expresses normally.
- **pp** → tail-growth pathway off. No tail forms, whatever the T/t alleles say.

That's an all-or-nothing modifier — a switch. Other modifier genes act as dimmers, tuning the *intensity* of another gene's phenotype rather than turning it off. Same category, different strength.

Today's puzzle: the father is a known **Pp** carrier. The mother is a mystery — either PP or Pp. A single test cross will tell you which. If any tail-less offspring appear, she must be Pp. If none appear across a big enough litter, she's almost certainly PP.`,
      workedExample: {
        parents: [
          {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'P'], // show walks through Case A: mother is PP
          },
          {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'], // known Pp
          },
        ],
        narration: [
          'Case A walkthrough: mother is PP. Every gamete she produces is P.',
          'Father: known Pp. He passes P or p with 50/50 odds.',
          'Every offspring gets P from mother, so pp is impossible — no tail-less children ever appear.',
          'Case B (mother is Pp): about 1/4 of offspring would be pp. Even one tail-less child settles it.',
        ],
      },
    },

    guided: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Mystery mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Known-carrier father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Pp' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Pp' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "The father is a known Pp carrier. Cross him with the mother a few times. Any tail-less offspring settles the mother's genotype instantly.",
        onWrongHypothesis: {
          'mother:tailGrowth:PP':
            "If a tail-less offspring appeared, the mother can't be PP — she must be Pp.",
          'mother:tailGrowth:pp':
            "pp would mean SHE has no tail. She clearly does — she has at least one P.",
          'father:tailGrowth:PP':
            "The father's genotype is stated in the brief — he's Pp.",
          'father:tailGrowth:pp':
            "The father visibly has a tail. He's not pp.",
        },
      },
    },

    // Solo is a fresh puzzle rather than the reciprocal — otherwise the
    // "answer" is exactly the same Pp × Pp the guided asked for. This one
    // pairs a known-tail-less (pp) mother with a mystery long-tailed father.
    // Any tail-less offspring settles it: the father must be Pp carrying a
    // silent p. If none appear across many crosses, father is PP.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['p', 'p'],
          },
          defaultName: 'Tail-less mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['P', 'p'],
          },
          defaultName: 'Mystery father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'pp' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Pp' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'Mother is visibly tail-less — she has to be pp. Every offspring inherits one of her p alleles automatically. So the father alone controls whether that offspring grows a tail.',
        },
        {
          stage: 'point',
          text: 'If ALL offspring grow tails → father is PP. If ROUGHLY HALF are tail-less → father is Pp, carrying one silent p.',
        },
        {
          stage: 'suggest',
          text: 'Look at the offspring tally. About 50/50 tailed vs tail-less → mother pp, father Pp.',
        },
      ],
    },
  },

  unlocks: { nextChapterId: 'ch22' },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { ...NEUTRAL_FEMALE, tail: ['T', 'T'], tailGrowth: ['P', 'p'] },
    defaultName: 'Modifier Trophy',
  },
}
