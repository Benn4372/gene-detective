import type { Mission } from '../types'
import { mendelTier1Missions } from './mendel-tier1'
import { weaverTier1Missions } from './weaver-tier1'
import { deltaTier2Missions } from './delta-tier2'
import { nyxTier3Missions } from './nyx-tier3'

export const missions: Mission[] = [
  ...mendelTier1Missions,
  ...weaverTier1Missions,
  ...deltaTier2Missions,
  ...nyxTier3Missions,
]

export const missionById: Record<string, Mission> = Object.fromEntries(
  missions.map(m => [m.id, m]),
)
