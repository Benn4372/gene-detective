import { registerLayer, type LayerComponent } from '../layerRegistry'

// LethalCoat layer — recolours the body when the C (yellow) allele expresses.
// Phenotype values (from expressSimpleDominant):
//   'C' → yellow coat (Cc heterozygote; CC is lethal so it never renders here)
//   'c' → dark coat  (baseline blob body)
// Only 'C' needs a visible override — the body's default violet stands in
// for "dark" without needing extra ink. Symbol updated after Y→C rename.
export const LethalCoatLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'C') return null
  return (
    <g>
      <defs>
        <clipPath id="lethal-coat-clip">
          <ellipse cx="50" cy="55" rx="35" ry="30" />
        </clipPath>
      </defs>
      {/* Yellow body-fill overlay clipped to body shape. Opacity keeps some
          of the underlying violet so the outline still reads consistently
          across all blobs, but the yellow tint is unmistakable. */}
      <g clipPath="url(#lethal-coat-clip)">
        <ellipse
          cx="50" cy="55" rx="35" ry="30"
          fill="#fbbf24"
          opacity="0.78"
        />
      </g>
      {/* Slightly darker gold rim so the yellow blob doesn't look washed-out
          against the page background. */}
      <ellipse
        cx="50" cy="55" rx="35" ry="30"
        fill="none"
        stroke="#b45309"
        strokeWidth="1.6"
      />
    </g>
  )
}

registerLayer('lethalCoat', LethalCoatLayer)
