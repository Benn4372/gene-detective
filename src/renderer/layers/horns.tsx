import { registerLayer, type LayerComponent } from '../layerRegistry'

// Horns — three phenotype variants sized by the dominant allele's symbol.
// Filled tapered horns instead of thin arcs so they read as biological
// horns rather than pencil scribbles.
//   'L' → long, tall tapered spikes with a shading stripe
//   'M' → medium, shorter tapered spikes
//   'n' → short, small round nubs (still visible at card size)
export const HornsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue === 'L') {
    return (
      <g>
        <path
          d="M 32 26 Q 30 12 27 3 Q 32 10 38 26 Z"
          fill="#b45309"
          stroke="#451a03"
          strokeWidth="0.8"
        />
        <path
          d="M 68 26 Q 70 12 73 3 Q 68 10 62 26 Z"
          fill="#b45309"
          stroke="#451a03"
          strokeWidth="0.8"
        />
        {/* Shading stripe along each horn for dimension */}
        <path
          d="M 33 24 Q 31 15 29 8"
          stroke="#78350f"
          strokeWidth="0.6"
          opacity="0.6"
          fill="none"
        />
        <path
          d="M 67 24 Q 69 15 71 8"
          stroke="#78350f"
          strokeWidth="0.6"
          opacity="0.6"
          fill="none"
        />
      </g>
    )
  }
  if (phenotypeValue === 'M') {
    return (
      <g>
        <path
          d="M 32 26 Q 31 18 29 12 Q 34 16 38 26 Z"
          fill="#b45309"
          stroke="#451a03"
          strokeWidth="0.8"
        />
        <path
          d="M 68 26 Q 69 18 71 12 Q 66 16 62 26 Z"
          fill="#b45309"
          stroke="#451a03"
          strokeWidth="0.8"
        />
      </g>
    )
  }
  if (phenotypeValue === 'n') {
    // Short — small round nubs. Still readable at card size.
    return (
      <g fill="#b45309" stroke="#451a03" strokeWidth="0.6">
        <ellipse cx="35" cy="24" rx="3" ry="2.2" />
        <ellipse cx="65" cy="24" rx="3" ry="2.2" />
      </g>
    )
  }
  return null
}

registerLayer('horns', HornsLayer)
