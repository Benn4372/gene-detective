import { registerLayer, type LayerComponent } from '../layerRegistry'

// Braincrest — a tall spiky ridge over the top of the head when phenotype is
// 'W'. Was a single low arc that read as a pencil scribble; now a solid
// crest shape with sawtooth top and a shaded fill so it clearly reads as a
// biological feature above the head, not decoration.
export const BraincrestLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'W') return null
  return (
    <g>
      {/* Crest fin — filled taper from the head. Extends well above the head
          silhouette so it's unmistakable at any card size. */}
      <path
        d="M 30 30 L 34 12 L 42 14 L 46 8 L 54 8 L 58 14 L 66 12 L 70 30 L 60 26 L 52 24 L 44 24 L 38 26 Z"
        fill="#f59e0b"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Darker centre stripe running along the crest length */}
      <path
        d="M 50 8 L 50 26"
        stroke="#78350f"
        strokeWidth="0.8"
        opacity="0.7"
      />
    </g>
  )
}

registerLayer('braincrest', BraincrestLayer)
