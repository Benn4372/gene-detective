import { registerLayer, type LayerComponent } from '../layerRegistry'

// Brood pouch — small pouch on the belly, drawn only when phenotype is 'U'.
export const BroodPouchLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'U') return null
  return (
    <path
      d="M 42 78 Q 50 88 58 78"
      stroke="#c026d3"
      strokeWidth="2.4"
      fill="#f0abfc"
      strokeLinecap="round"
      opacity="0.85"
    />
  )
}

registerLayer('broodPouch', BroodPouchLayer)
