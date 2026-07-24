import type { ComponentType } from 'react'
import type { Creature } from '../engine/types'

export interface LayerProps {
  phenotypeValue: string | undefined
  // Optional — some layers need to inspect the creature itself (e.g. X-linked
  // female heterozygotes need to render mosaic, which can't be determined
  // from the summary phenotype alone).
  creature?: Creature
}

export type LayerComponent = ComponentType<LayerProps>

const registry: Record<string, LayerComponent> = {}

export function registerLayer(traitId: string, component: LayerComponent): void {
  registry[traitId] = component
}

export function getLayer(traitId: string): LayerComponent | undefined {
  return registry[traitId]
}

export function allLayerTraitIds(): string[] {
  return Object.keys(registry)
}
