import { registerLayer, type LayerComponent } from '../layerRegistry'

// Fins — filled pectoral fans on each side of the body when 'F' expresses.
// Rendered UNDER the body so the fin's innermost edge tucks behind the body
// silhouette (looks attached rather than floating alongside). Three thin
// ridge lines per fin add dimension without extra shapes.
export const FinsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'F') return null
  return (
    <g>
      {/* Left pectoral fan */}
      <path
        d="M 16 55 Q 4 45 1 58 Q 4 72 18 66 Q 20 60 16 55 Z"
        fill="#8b5cf6"
        stroke="#4c1d95"
        strokeWidth="1"
      />
      {/* Right pectoral fan */}
      <path
        d="M 84 55 Q 96 45 99 58 Q 96 72 82 66 Q 80 60 84 55 Z"
        fill="#8b5cf6"
        stroke="#4c1d95"
        strokeWidth="1"
      />
      {/* Ridges — inline shading for depth */}
      <g stroke="#5b21b6" strokeWidth="0.6" fill="none" opacity="0.7">
        <path d="M 15 56 Q 8 55 4 60" />
        <path d="M 14 60 Q 8 62 5 65" />
        <path d="M 85 56 Q 92 55 96 60" />
        <path d="M 86 60 Q 92 62 95 65" />
      </g>
    </g>
  )
}

registerLayer('fins', FinsLayer, { renderOrder: 'under-body' })
