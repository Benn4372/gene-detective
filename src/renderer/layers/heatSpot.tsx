import { registerLayer, type LayerComponent } from '../layerRegistry'

// Heat-spot layer — a bright orange radial glow on the blob's back when
// phenotype is 'H'. Only appears at warm ambient temperatures (the phenotype
// itself has been gated to recessive under the temperature threshold).
export const HeatSpotLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'H') return null
  return (
    <g>
      <defs>
        <radialGradient id="heat-spot-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="45" r="10" fill="url(#heat-spot-grad)" />
    </g>
  )
}

registerLayer('heatSpot', HeatSpotLayer)
