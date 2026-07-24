import { registerLayer, type LayerComponent } from '../layerRegistry'

// Metabolism layer — pleiotropic partner of the antennae gene. The 'A' allele
// grows antennae AND boosts the metabolic-marker pathway; 'a' does neither.
// Rendered as a small chemistry-flask icon on the blob's shoulder so the
// pleiotropic co-segregation is directly visible: every antennae-carrying
// blob has a flask, every antennae-less blob doesn't.
//
// Ch15 (pleiotropy) is the chapter that explicitly names this; before Ch15
// the icon is present regardless (nothing hides pleiotropic effects) but the
// player has no vocabulary for it yet.
export const MetabolismLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'A') return null
  return (
    <g transform="translate(20 30)">
      {/* Flask body */}
      <path
        d="M 3 0 L 3 4 L 0 9 L 8 9 L 5 4 L 5 0 Z"
        fill="#22c55e"
        stroke="#166534"
        strokeWidth="0.5"
        opacity="0.9"
      />
      {/* Flask neck rim */}
      <line x1="2.5" y1="0" x2="5.5" y2="0" stroke="#166534" strokeWidth="0.7" />
      {/* Bubbles inside */}
      <circle cx="3.5" cy="7" r="0.6" fill="#ecfdf5" opacity="0.85" />
      <circle cx="5" cy="6" r="0.5" fill="#ecfdf5" opacity="0.85" />
    </g>
  )
}

registerLayer('metabolism', MetabolismLayer)
