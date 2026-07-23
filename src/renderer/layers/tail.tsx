import { registerLayer, type LayerComponent } from '../layerRegistry'

// Tail — three natural states via incomplete dominance:
//   'T'   → long tail
//   'T/t' → medium tail (blend heterozygote)
//   't'   → short/nub tail
// Any other value (absent, 'none' from epistasis mask) hides the tail.
export const TailLayer: LayerComponent = ({ phenotypeValue }) => {
  const length =
    phenotypeValue === 'T' ? 18 :
    phenotypeValue === 'T/t' ? 10 :
    phenotypeValue === 't' ? 4 :
    0
  if (length <= 0) return null
  // Tail curls out from the lower-right of the body, curving upward.
  // Bezier control points scale with length.
  const startX = 82
  const startY = 72
  const endX = startX + length + 4
  const endY = startY - length / 2
  const ctrlX = startX + length / 2
  const ctrlY = startY + length / 2
  return (
    <g
      stroke="#6d28d9"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    >
      <path d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`} />
      {/* Small tuft at tip for long/medium tails */}
      {length >= 10 && (
        <circle cx={endX} cy={endY} r={length >= 15 ? 3 : 2} fill="#6d28d9" />
      )}
    </g>
  )
}

registerLayer('tail', TailLayer)
