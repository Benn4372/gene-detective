import { registerLayer, type LayerComponent } from '../layerRegistry'

// LethalCoat layer — a golden ring around the body when Y is expressed.
export const LethalCoatLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'Y') return null
  return (
    <ellipse
      cx="50"
      cy="55"
      rx="37"
      ry="32"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2.2"
      strokeDasharray="4 3"
      opacity="0.85"
    />
  )
}

registerLayer('lethalCoat', LethalCoatLayer)
