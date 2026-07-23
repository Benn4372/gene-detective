import { registerLayer, type LayerComponent } from '../layerRegistry'

// Sparkle layer — a tiny yellow star at the top-right of the body when 'K'.
export const SparkleLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'K') return null
  return (
    <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
      <polygon points="72,35 74,41 80,41 75,45 77,51 72,47 67,51 69,45 64,41 70,41" />
    </g>
  )
}

registerLayer('sparkle', SparkleLayer)
