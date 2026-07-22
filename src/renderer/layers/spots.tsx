import { registerLayer, type LayerComponent } from '../layerRegistry'

export const SpotsLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'S') return null
  return (
    <g>
      <circle cx="34" cy="58" r="4" fill="#5b21b6" />
      <circle cx="60" cy="66" r="4" fill="#5b21b6" />
      <circle cx="46" cy="76" r="3.5" fill="#5b21b6" />
      <circle cx="66" cy="50" r="3" fill="#5b21b6" />
    </g>
  )
}

registerLayer('spots', SpotsLayer)
