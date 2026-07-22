import { registerLayer, type LayerComponent } from '../layerRegistry'

export const AntennaeLayer: LayerComponent = ({ phenotypeValue }) => {
  if (phenotypeValue !== 'A') return null
  return (
    <g>
      <line x1="40" y1="25" x2="34" y2="8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="25" x2="66" y2="8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="34" cy="8" r="3" fill="#1e293b" />
      <circle cx="66" cy="8" r="3" fill="#1e293b" />
    </g>
  )
}

registerLayer('antennae', AntennaeLayer)
