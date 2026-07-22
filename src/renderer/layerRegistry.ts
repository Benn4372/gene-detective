import type { ComponentType } from 'react'

export interface LayerProps {
  phenotypeValue: string | undefined
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
