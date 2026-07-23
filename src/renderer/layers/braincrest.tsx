import { registerLayer, type LayerComponent } from '../layerRegistry'

// Braincrest — a low ridge over the top of the head when phenotype is 'W'.
export const BraincrestLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'W') return null
  return (
    <path
      d="M 33 27 Q 50 15 67 27"
      stroke="#a16207"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  )
}

registerLayer('braincrest', BraincrestLayer)
