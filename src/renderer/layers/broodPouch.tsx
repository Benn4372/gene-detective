import { registerLayer, type LayerComponent } from '../layerRegistry'

// Brood pouch — a filled pink pouch on the lower belly when 'U' expresses in
// a female (the gene is sex-limited to F). Previously a thin arc that read
// as a second smile; now a full filled shape with a faint interior seam
// suggesting the opening.
export const BroodPouchLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'U') return null
  return (
    <g>
      <path
        d="M 37 72 Q 33 84 42 84 Q 50 85 58 84 Q 67 84 63 72 Q 55 74 50 74 Q 45 74 37 72 Z"
        fill="#e879f9"
        stroke="#a21caf"
        strokeWidth="1"
      />
      {/* Interior seam — implies the pouch opening */}
      <path
        d="M 44 80 Q 50 82 56 80"
        stroke="#a21caf"
        strokeWidth="0.7"
        fill="none"
        opacity="0.7"
      />
    </g>
  )
}

registerLayer('broodPouch', BroodPouchLayer)
