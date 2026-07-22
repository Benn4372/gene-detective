import type { Character } from './types'

export const characters: Character[] = [
  {
    id: 'dr-mendel',
    name: 'Dr. Mendel',
    emoji: '🧑‍🔬',
    bio: 'A retired botanist who spent forty years staring at pea plants. Now runs a small blob rescue and needs your help finding good homes.',
    voice: {
      orderIntro: 'I have a family looking for a very specific blob. Can you find one — or breed one — that matches?',
      orderComplete: 'Perfect. This little one is going to a wonderful home. Here are your coins.',
    },
    specialty: ['simple-dominance', 'test-cross'],
    unlockedFrom: 'lesson-1',
  },
]

export const characterById: Record<string, Character> = Object.fromEntries(
  characters.map(c => [c.id, c]),
)
