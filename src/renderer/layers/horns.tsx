import { registerLayer, type LayerComponent } from '../layerRegistry'

// Horns layer — three phenotype variants sized by allele.
// Phenotype value is the dominant allele's symbol: L / M / n.
// Anything else (absent, unknown) → no horns drawn at all so blobs from
// chapters that don't touch the horns gene stay clean.
export const HornsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'L' && phenotypeValue !== 'M' && phenotypeValue !== 'n') {
    return null
  }
  const height =
    phenotypeValue === 'L' ? 20 : phenotypeValue === 'M' ? 12 : 5
  if (height <= 0) return null
  // Two symmetric horns curving outward from the top of the head. Height
  // scales with allele length; short horns are still visible nubs.
  const yTop = 25 - height
  return (
    <g stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" fill="none">
      <path
        d={`M 36 25 Q 30 ${25 - height / 2} 28 ${yTop}`}
      />
      <path
        d={`M 64 25 Q 70 ${25 - height / 2} 72 ${yTop}`}
      />
    </g>
  )
}

registerLayer('horns', HornsLayer)
