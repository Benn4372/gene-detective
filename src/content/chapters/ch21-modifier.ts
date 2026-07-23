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
"Today, a mystery mother. I know the father is a Gg carrier — I bred him myself. Figure out whether the mother is GG or Gg."`,

  storyOutro: `Prof. Weaver:
"A test cross with a known heterozygote — the field geneticist's staple. If any offspring were tail-less, the mother had to be Gg. If none appeared across a big enough litter, she's almost certainly GG."
"Modifier genes explain variable expressivity in real biology — why the same disease-causing allele can be mild in one family and severe in another. Different modifier backgrounds."`,

  pinnedGlossaryTerms: ['modifier-gene', 'expressivity', 'test-cross'],

  stages: {
    show: {
      body: `A **modifier gene** doesn't produce its own visible trait — it changes how another gene expresses. Think of it as a volume knob on the other gene's output.

**tailGrowth** is the modifier you already know. Its two alleles:

- **GG or Gg** → tail-growth pathway on. The tail gene (T/t) expresses normally.
- **gg** → tail-growth pathway off. No tail forms, whatever the T/t alleles say.

That's an all-or-nothing modifier — a switch. Other modifier genes act as dimmers, tuning the *intensity* of another gene's phenotype rather than turning it off. Same category, different strength.

Today's puzzle: the father is a known **Gg** carrier. The mother is a mystery — either GG or Gg. A single test cross will tell you which. If any tail-less offspring appear, she must be Gg. If none appear across a big enough litter, she's almost certainly GG.`,
      workedExample: {
        parents: [
          {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'], // mystery mother — you don't KNOW yet
          },
          {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'], // known Gg
          },
        ],
        narration: [
          'Mother: mystery. Tail visible → she carries at least one G.',
          'Father: known Gg. He passes G or g with 50/50 odds.',
          'Case A — mother is GG. Every offspring inherits G from her; no tail-less children ever appear.',
          'Case B — mother is Gg. About 1/4 of offspring are gg → tail-less. Even one settles it.',
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
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Mystery mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Known-carrier father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Gg' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      scaffolding: {
        onOpen:
          "The father is a known Gg carrier. Cross him with the mother a few times. Any tail-less offspring settles the mother's genotype instantly.",
        onWrongHypothesis: {
          'mother:tailGrowth:GG':
            "If a tail-less offspring appeared, the mother can't be GG — she must be Gg.",
          'mother:tailGrowth:gg':
            "gg would mean SHE has no tail. She clearly does — she has at least one G.",
          'father:tailGrowth:GG':
            "The father's genotype is stated in the brief — he's Gg.",
          'father:tailGrowth:gg':
            "The father visibly has a tail. He's not gg.",
        },
      },
    },

    // Solo is the RECIPROCAL test cross — this time the mother is the known
    // Gg carrier and the FATHER is the mystery. Every offspring inherits her
    // g half the time. If any tail-less children appear, father must also be
    // carrying g; if none appear across a big litter, he's GG.
    solo: {
      starterCreatures: [
        {
          role: 'mother',
          sex: 'F',
          genotype: {
            ...NEUTRAL_FEMALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Known-carrier mother',
        },
        {
          role: 'father',
          sex: 'M',
          genotype: {
            ...NEUTRAL_MALE,
            tail: ['T', 'T'],
            tailGrowth: ['G', 'g'],
          },
          defaultName: 'Mystery father',
        },
      ],
      correctAssertions: [
        { creatureRole: 'mother', geneId: 'tailGrowth', correctGenotype: 'Gg' },
        { creatureRole: 'father', geneId: 'tailGrowth', correctGenotype: 'Gg' },
      ],
      supportingGeneIds: ['tail'],
      litterSize: 8,
      validationTier: 'medium',
      hints: [
        {
          stage: 'reframe',
          text: 'This time the mother is the known Gg — the father is the unknown. If no tail-less offspring appear across many litters, father must be GG.',
        },
        {
          stage: 'point',
          text: "Tail-less offspring (gg) mean father carries g AND mother passed her g on the same gamete. Watch the tally.",
        },
        {
          stage: 'suggest',
          text: 'If tail-less offspring appear, enter Gg for the father. The mother is stated as Gg in the brief.',
        },
      ],
    },
  },

  unlocks: { nextChapterId: 'ch22' },

  trophyBlobPreset: {
    sex: 'F',
    genotype: { ...NEUTRAL_FEMALE, tail: ['T', 'T'], tailGrowth: ['G', 'g'] },
    defaultName: 'Modifier Trophy',
  },
}
