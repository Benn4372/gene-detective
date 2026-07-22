import type { OrderTemplate } from './types'

// Tier-1 orders for Dr. Mendel. Each opens a self-contained lab where the
// player breeds fresh unknown "sample" blobs to try to hit the target phenotype.
// The two starter genotypes below are the same for both orders — an Aa mother
// and an aa father — so Aa × aa produces roughly 50/50 A and a offspring, and
// either target is reachable from the same pair.
const labStartersAntennae: OrderTemplate['labStarters'] = [
  {
    sex: 'F',
    genotype: { antennae: ['A', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample F-01',
  },
  {
    sex: 'M',
    genotype: { antennae: ['a', 'a'], spots: ['s', 's'] },
    defaultName: 'Sample M-01',
  },
]

export const orderTemplates: OrderTemplate[] = [
  {
    id: 'order-mendel-1',
    characterId: 'dr-mendel',
    tier: 1,
    requiredPhenotype: { antennae: 'a' },
    coinReward: 10,
    flavorText:
      'The new family has sensitive fingers. No antennae, please — a smooth-headed little blob.',
    labStarters: labStartersAntennae,
    visibleGeneIds: ['antennae'],
  },
  {
    id: 'order-mendel-2',
    characterId: 'dr-mendel',
    tier: 1,
    requiredPhenotype: { antennae: 'A' },
    coinReward: 8,
    flavorText:
      "They've always wanted a blob with antennae. Nothing fancy — just antennae.",
    labStarters: labStartersAntennae,
    visibleGeneIds: ['antennae'],
  },
]

export const orderTemplateById: Record<string, OrderTemplate> = Object.fromEntries(
  orderTemplates.map(o => [o.id, o]),
)
