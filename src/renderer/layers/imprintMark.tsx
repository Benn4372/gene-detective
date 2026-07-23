import { registerLayer, type LayerComponent } from '../layerRegistry'

// Imprint mark — horizontal band across the middle when 'J' expresses.
export const ImprintMarkLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'J') return null
  return (
    <rect x="15" y="53" width="70" height="4" fill="#4338ca" opacity="0.75" />
  )
}

registerLayer('imprintMark', ImprintMarkLayer)
