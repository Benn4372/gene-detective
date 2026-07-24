import { registerLayer, type LayerComponent } from '../layerRegistry'
import { useGameStore } from '../../state/gameStore'

// Metabolism layer — pleiotropic partner of the antennae gene. Rendered as a
// small chemistry-flask icon on the blob's shoulder. The 'A' allele grows
// antennae AND boosts the metabolic-marker pathway; 'a' does neither.
//
// The flask is INVISIBLE unless the player enables the metabolism assay via
// the Workbench control. Without that gating the flask would ride along on
// every antennae-carrying blob across every chapter — the pleiotropic
// co-segregation should be a deliberate check the player runs, not
// permanent shoulder decoration.
export const MetabolismLayer: LayerComponent = ({ phenotypeValue }) => {
  const enabled = useGameStore(s => s.metabolismAssayEnabled)
  if (!enabled) return null
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
      <line x1="2.5" y1="0" x2="5.5" y2="0" stroke="#166534" strokeWidth="0.7" />
      <circle cx="3.5" cy="7" r="0.6" fill="#ecfdf5" opacity="0.85" />
      <circle cx="5" cy="6" r="0.5" fill="#ecfdf5" opacity="0.85" />
    </g>
  )
}

registerLayer('metabolism', MetabolismLayer)
