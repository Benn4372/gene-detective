import { registerLayer, type LayerComponent } from '../layerRegistry'

// Sparkle — a diamond-shaped 4-point star with a small burst of surrounding
// rays and two tiny companion sparkles, when 'K' expresses. Previously a
// single lonely 5-point star; the burst + companions make it feel like the
// gene actually sparkles rather than just holding one star.
export const SparkleLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'K') return null
  return (
    <g>
      {/* Burst rays around the main sparkle */}
      <g stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" opacity="0.85">
        <line x1="72" y1="30" x2="72" y2="26" />
        <line x1="72" y1="52" x2="72" y2="56" />
        <line x1="60" y1="41" x2="56" y2="41" />
        <line x1="84" y1="41" x2="88" y2="41" />
      </g>
      {/* Main 4-point diamond star */}
      <g fill="#fde047" stroke="#b45309" strokeWidth="0.7">
        <polygon points="72,33 74,39 80,41 74,43 72,49 70,43 64,41 70,39" />
      </g>
      {/* Companion micro-sparkles */}
      <g fill="#fbbf24" opacity="0.85">
        <polygon points="35,72 36.2,74.5 39,75.2 36.2,75.9 35,78.4 33.8,75.9 31,75.2 33.8,74.5" />
        <polygon points="58,78 58.8,79.7 60.8,80.2 58.8,80.7 58,82.4 57.2,80.7 55.2,80.2 57.2,79.7" />
      </g>
    </g>
  )
}

registerLayer('sparkle', SparkleLayer)
