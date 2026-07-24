import type { Mission } from '../types'
import { mendelTier1Missions } from './mendel-tier1'
import { weaverTier1Missions } from './weaver-tier1'
import { weaverTier2Missions } from './weaver-tier2'

export const missions: Mission[] = [
  ...mendelTier1Missions,
  ...weaverTier1Missions,
  ...weaverTier2Missions,
]

export const missionById: Record<string, Mission> = Object.fromEntries(
  missions.map(m => [m.id, m]),
)
