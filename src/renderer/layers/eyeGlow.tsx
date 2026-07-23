import { registerLayer, type LayerComponent } from '../layerRegistry'

// Eye-glow layer — X-linked. Phenotype 'G' → soft amber halo around each eye.
// The base eyes are drawn by BlobRenderer; this just decorates them.
export const EyeGlowLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'G') return null
  return (
    <g>
      <defs>
        <radialGradient id="eye-glow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#facc15" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="50" r="8" fill="url(#eye-glow-grad)" />
      <circle cx="60" cy="50" r="8" fill="url(#eye-glow-grad)" />
    </g>
  )
}

registerLayer('eyeGlow', EyeGlowLayer)
