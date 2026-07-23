import { registerLayer, type LayerComponent } from '../layerRegistry'

// Fins layer — small triangular fins on each side of the body when 'F'.
export const FinsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'F') return null
  return (
    <g fill="#7c3aed" stroke="#4c1d95" strokeWidth="1">
      {/* Left fin */}
      <path d="M 15 55 L 6 48 L 6 62 Z" />
      {/* Right fin */}
      <path d="M 85 55 L 94 48 L 94 62 Z" />
    </g>
  )
}

registerLayer('fins', FinsLayer)
