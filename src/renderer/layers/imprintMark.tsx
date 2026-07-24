import { registerLayer, type LayerComponent } from '../layerRegistry'

// Imprint mark — a stylised wax-seal / fingerprint emblem on the chest when
// the 'J' allele expresses (paternal copy of the imprinted gene). Previously
// drawn as a horizontal band, which visually collided with the pattern-gene
// stripes (also horizontal bands). Circular emblem with radial ridges is
// unambiguous against every other layer's shapes.
export const ImprintMarkLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'J') return null
  return (
    <g transform="translate(50 63)">
      {/* Outer seal ring */}
      <circle cx="0" cy="0" r="7" fill="#c084fc" stroke="#5b21b6" strokeWidth="1.2" />
      {/* Inner ring */}
      <circle cx="0" cy="0" r="4.5" fill="none" stroke="#5b21b6" strokeWidth="0.7" opacity="0.7" />
      {/* Radial ridges — imprint fingerprint look */}
      <g stroke="#5b21b6" strokeWidth="0.7" strokeLinecap="round" opacity="0.85">
        <line x1="0" y1="-5.5" x2="0" y2="-3" />
        <line x1="0" y1="3" x2="0" y2="5.5" />
        <line x1="-5.5" y1="0" x2="-3" y2="0" />
        <line x1="3" y1="0" x2="5.5" y2="0" />
      </g>
      {/* Centre dot */}
      <circle cx="0" cy="0" r="1.2" fill="#5b21b6" />
    </g>
  )
}

registerLayer('imprintMark', ImprintMarkLayer)
