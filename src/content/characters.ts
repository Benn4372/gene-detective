import type { Character, Mentor } from './types'

// -- Mentors: characters who inhabit the Station scene at their own desks.

export const mentors: Mentor[] = [
  {
    id: 'dr-mendel',
    name: 'Dr. Mendel',
    emoji: '🧑‍🔬',
    bio: 'A retired botanist who spent forty years staring at pea plants. Now runs the Station and mentors newcomers.',
    voice: {
      orderIntro:
        'I have a family looking for a very specific blob. Can you find one — or breed one — that matches?',
      orderComplete:
        'Perfect. This little one is going to a wonderful home. Well done.',
    },
    specialty: ['simple-dominance', 'test-cross'],
    joinsAtChapterId: 'ch01', // present from day one
    desk: { x: 30, y: 55, color: '#c084fc' },
  },
  {
    id: 'prof-weaver',
    name: 'Prof. Weaver',
    emoji: '🧑‍🏫',
    bio: 'A former quantitative geneticist. Speaks in ratios and lives for large sample sizes. Joins the Station once you can handle two-trait crosses.',
    voice: {
      orderIntro:
        "I've got a puzzle that'll stretch your Punnett skills. Ready to try?",
      orderComplete: "Beautifully done. That's the pattern I was looking for.",
    },
    specialty: ['independent-assortment', 'linkage'],
    joinsAtChapterId: 'ch03',
    desk: { x: 68, y: 55, color: '#60a5fa' },
  },
  {
    id: 'prof-delta',
    name: 'Prof. Delta',
    emoji: '🧑‍🔬',
    bio: 'A population geneticist with a talent for making Hardy-Weinberg feel obvious. Arrives with the Student tier\'s evolutionary chapters.',
    voice: {
      orderIntro:
        "I have a population-scale question. Bring me an outcome that fits a specific frequency.",
      orderComplete: "Excellent. The population is doing what the theory says it should.",
    },
    specialty: ['population-genetics', 'evolutionary-forces'],
    joinsAtChapterId: 'ch27',
    desk: { x: 45, y: 40, color: '#10b981' },
  },
  {
    id: 'dr-nyx',
    name: 'Dr. Nyx',
    emoji: '🧑‍⚕️',
    bio: 'Molecular geneticist and clinician. Arrives with the Researcher tier — the DNA-sequence-level chapters.',
    voice: {
      orderIntro:
        "Sequence-level puzzle. Might get technical — you ready?",
      orderComplete: "Clean. Add it to the tissue registry.",
    },
    specialty: ['molecular-genetics', 'epigenetics', 'crispr'],
    joinsAtChapterId: 'ch41',
    desk: { x: 20, y: 40, color: '#f472b6' },
  },
]

// -- Clients: characters who submit missions but aren't full mentors.
// (Currently empty — client roles are filled by mentors themselves at low tiers.)
export const clients: Character[] = []

// -- Combined character lookup, used by Mission UIs that just want a portrait
//    + name for a character id.
export const characters: Character[] = [...mentors, ...clients]

export const characterById: Record<string, Character> = Object.fromEntries(
  characters.map(c => [c.id, c]),
)

export const mentorById: Record<string, Mentor> = Object.fromEntries(
  mentors.map(m => [m.id, m]),
)
