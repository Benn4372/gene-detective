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

// A layer can opt into being drawn BEFORE the body ellipse — used for tails,
// fins, heat auras, and anything else that should visually tuck behind the
// body silhouette. Default is 'over-body' (drawn after body + eyes + mouth).
export type RenderOrder = 'under-body' | 'over-body'

interface RegisteredLayer {
  component: LayerComponent
  renderOrder: RenderOrder
}

const registry: Record<string, RegisteredLayer> = {}

export function registerLayer(
  traitId: string,
  component: LayerComponent,
  opts?: { renderOrder?: RenderOrder },
): void {
  registry[traitId] = {
    component,
    renderOrder: opts?.renderOrder ?? 'over-body',
  }
}

export function getLayer(traitId: string): LayerComponent | undefined {
  return registry[traitId]?.component
}

export function getLayerRenderOrder(traitId: string): RenderOrder {
  return registry[traitId]?.renderOrder ?? 'over-body'
}

export function allLayerTraitIds(): string[] {
  return Object.keys(registry)
}
