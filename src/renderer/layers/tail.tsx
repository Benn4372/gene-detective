import { registerLayer, type LayerComponent } from '../layerRegistry'

// Tail — three natural states via incomplete dominance:
//   'T'   → long tail, big tuft
//   'T/t' → medium tail, medium tuft
//   't'   → short stub, small tuft
// Any other value (absent, 'none' from epistasis mask) hides the tail.
//
// Rendered UNDER the body: the base of the stroke tucks behind the body
// silhouette so the tail looks attached rather than pasted on top. The tuft
// circle at the tip is drawn OVER the stroke's round cap so it reads as a
// distinct ball rather than merging into the stroke.
export const TailLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue === 'T') {
    return (
      <g>
        <path
          d="M 76 70 Q 94 62 94 42"
          stroke="#6d28d9"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="94" cy="42" r="5.5" fill="#7c3aed" stroke="#4c1d95" strokeWidth="1.2" />
      </g>
    )
  }
  if (phenotypeValue === 'T/t') {
    return (
      <g>
        <path
          d="M 76 70 Q 89 65 91 55"
          stroke="#6d28d9"
          strokeWidth="5.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="91" cy="55" r="4.5" fill="#7c3aed" stroke="#4c1d95" strokeWidth="1" />
      </g>
    )
  }
  if (phenotypeValue === 't') {
    return (
      <g>
        <path
          d="M 76 70 Q 83 68 86 66"
          stroke="#6d28d9"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="86" cy="66" r="3.5" fill="#7c3aed" stroke="#4c1d95" strokeWidth="1" />
      </g>
    )
  }
  return null
}

registerLayer('tail', TailLayer, { renderOrder: 'under-body' })
