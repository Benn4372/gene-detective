import { registerLayer, type LayerComponent } from '../layerRegistry'

// Pattern layer — codominant.
// Phenotype values (from expressCodominant):
//   'T'  → stripes only
//   'B'  → blotches only
//   'TB' → both stripes AND blotches (heterozygote — codominant expression)
export const PatternLayer: LayerComponent = ({ phenotypeValue }) => {
  if (!phenotypeValue) return null
  const showStripes = phenotypeValue.includes('T')
  const showBlotches = phenotypeValue.includes('B')
  if (!showStripes && !showBlotches) return null
  return (
    <g>
      {/* Clip stripes + blotches inside the body ellipse via mask */}
      <defs>
        <clipPath id="pattern-body-clip">
          <ellipse cx="50" cy="55" rx="35" ry="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#pattern-body-clip)">
        {showStripes && (
          <g stroke="#3f3f46" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
            <line x1="14" y1="42" x2="86" y2="42" />
            <line x1="14" y1="52" x2="86" y2="52" />
            <line x1="14" y1="62" x2="86" y2="62" />
            <line x1="14" y1="72" x2="86" y2="72" />
          </g>
        )}
        {showBlotches && (
          <g fill="#3730a3" opacity="0.55">
            <ellipse cx="30" cy="60" rx="7" ry="5" />
            <ellipse cx="66" cy="46" rx="6" ry="4.5" />
            <ellipse cx="58" cy="72" rx="6.5" ry="5" />
          </g>
        )}
      </g>
    </g>
  )
}

registerLayer('pattern', PatternLayer)
