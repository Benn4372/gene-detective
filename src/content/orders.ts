import type { OrderTemplate } from './types'

// Static order templates for MVP. A dynamic generator will replace this in Phase 2.
export const orderTemplates: OrderTemplate[] = [
  {
    id: 'order-mendel-1',
    characterId: 'dr-mendel',
    tier: 1,
    requiredPhenotype: { antennae: 'a' },
    coinReward: 10,
    flavorText: 'The new family has sensitive fingers. No antennae, please — a smooth-headed little blob.',
  },
  {
    id: 'order-mendel-2',
    characterId: 'dr-mendel',
    tier: 1,
    requiredPhenotype: { antennae: 'A' },
    coinReward: 8,
    flavorText: 'They\'ve always wanted a blob with antennae. Nothing fancy — just antennae.',
  },
  {
    id: 'order-mendel-3',
    characterId: 'dr-mendel',
    tier: 1,
    requiredPhenotype: { antennae: 'A', spots: 'S' },
    coinReward: 15,
    flavorText: 'The children are obsessed with polka dots. Antennae plus spots would be ideal.',
  },
]

export const orderTemplateById: Record<string, OrderTemplate> = Object.fromEntries(
  orderTemplates.map(o => [o.id, o]),
)
