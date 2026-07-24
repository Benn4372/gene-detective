import { registerLayer, type LayerComponent } from '../layerRegistry'

// Heat-spot — a full-body radiating warmth aura when 'H' expresses. The
// phenotype only expresses above the environmental temperature threshold
// (70°) — below that the gene reads as recessive and no aura draws.
//
// Rendered UNDER the body so the aura's inner (transparent) region is
// overpainted by the body itself, and only the outer bright ring reads.
// Result: the blob looks like it's glowing from within, radiating outward.
export const HeatSpotLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'H') return null
  return (
    <g>
      <defs>
        <radialGradient
          id="heat-body-aura"
          cx="50"
          cy="55"
          r="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.55" stopColor="#f97316" stopOpacity="0" />
          <stop offset="0.72" stopColor="#fb923c" stopOpacity="0.7" />
          <stop offset="0.88" stopColor="#f97316" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="48" ry="43" fill="url(#heat-body-aura)" />
    </g>
  )
}

registerLayer('heatSpot', HeatSpotLayer, { renderOrder: 'under-body' })
