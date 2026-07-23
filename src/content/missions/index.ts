import type { Mission } from '../types'
import { mendelTier1Missions } from './mendel-tier1'

export const missions: Mission[] = [...mendelTier1Missions]

export const missionById: Record<string, Mission> = Object.fromEntries(
  missions.map(m => [m.id, m]),
)
