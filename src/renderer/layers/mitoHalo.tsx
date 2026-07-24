import { registerLayer, type LayerComponent } from '../layerRegistry'

// Mitochondrial halo — a proper angel-style halo ring floating above the head
// when 'Q' expresses. Previously a diffuse radial glow that read as nearly
// invisible; a solid ring reads unmistakably. Inherited only from the mother
// (mitochondrial DNA), so every offspring of a Q mother inherits this ring.
export const MitoHaloLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'Q') return null
  return (
    <g>
      <ellipse
        cx="50" cy="18" rx="18" ry="4"
        fill="none"
        stroke="#0891b2"
        strokeWidth="2.2"
        opacity="0.9"
      />
      {/* Inner brighter rim */}
      <ellipse
        cx="50" cy="18" rx="18" ry="4"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="0.9"
        opacity="0.8"
      />
    </g>
  )
}

registerLayer('mitoHalo', MitoHaloLayer)
