import { registerLayer, type LayerComponent } from '../layerRegistry'

// Tail — three natural states via incomplete dominance:
//   'T'   → long tail
//   'T/t' → medium tail (blend heterozygote)
//   't'   → short/nub tail
// Any other value (absent, 'none' from epistasis mask) hides the tail.
//
// Sized to stay inside the 0-100 viewBox even at the long-tail extreme —
// tips reach (94, 59), leaving a small margin against the top/right edges.
export const TailLayer: LayerComponent = ({ phenotypeValue }) => {
  const length =
    phenotypeValue === 'T' ? 13 :
    phenotypeValue === 'T/t' ? 8 :
    phenotypeValue === 't' ? 3 :
    0
  if (length <= 0) return null
  // Tail curls out from the lower-right of the body, curving upward.
  // Bezier control points scale with length.
  const startX = 80
  const startY = 72
  const endX = startX + length + 1
  const endY = startY - length
  const ctrlX = startX + length / 2 + 2
  const ctrlY = startY + length / 3
  return (
    <g
      stroke="#6d28d9"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    >
      <path d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`} />
      {/* Small tuft at tip for long/medium tails */}
      {length >= 8 && (
        <circle cx={endX} cy={endY} r={length >= 12 ? 3 : 2} fill="#6d28d9" />
      )}
    </g>
  )
}

registerLayer('tail', TailLayer)
