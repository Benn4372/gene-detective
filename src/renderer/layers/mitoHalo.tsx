import { registerLayer, type LayerComponent } from '../layerRegistry'

// Mitochondrial halo — a diffuse blue-teal ring drawn behind the head when Q.
export const MitoHaloLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'Q') return null
  return (
    <g>
      <defs>
        <radialGradient id="mito-halo-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#0891b2" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="30" r="18" fill="url(#mito-halo-grad)" />
    </g>
  )
}

registerLayer('mitoHalo', MitoHaloLayer)
