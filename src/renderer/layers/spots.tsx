import { registerLayer, type LayerComponent } from '../layerRegistry'

// Spots — flat pigment markings when 'S'. Five ellipses (not circles) with
// slight rx/ry skew so they look organic instead of geometric. Deeper purple
// than before so they stand out against the body without needing highlights.
export const SpotsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'S') return null
  return (
    <g fill="#3b0764">
      <ellipse cx="30" cy="60" rx="6" ry="5.2" />
      <ellipse cx="62" cy="72" rx="5.8" ry="5" />
      <ellipse cx="47" cy="78" rx="4.8" ry="4.2" />
      <ellipse cx="68" cy="52" rx="4" ry="3.6" />
      <ellipse cx="43" cy="43" rx="3.4" ry="3" />
    </g>
  )
}

registerLayer('spots', SpotsLayer)
