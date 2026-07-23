import { registerLayer, type LayerComponent } from '../layerRegistry'

// Pattern layer — codominant.
// Phenotype values (from expressCodominant):
//   'T'  → stripes only    — thin horizontal dark lines across the body
//   'B'  → blotches only   — irregular rust-brown teardrop patches
//   'TB' → both simultaneously (heterozygote codominant expression)
//
// The blotch design deliberately uses non-circular teardrop paths in a
// rust-brown tone so it never gets confused with the (circular purple) spots
// layer — same body region, distinctly different shape + colour.
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
          <g fill="#7c2d12" opacity="0.6">
            {/* Irregular teardrop-shaped patches — organic, non-circular. */}
            <path d="M 24 55 Q 34 46 38 58 Q 32 67 24 55 Z" />
            <path d="M 62 40 Q 74 40 74 52 Q 66 54 62 40 Z" />
            <path d="M 46 70 Q 60 68 62 78 Q 52 82 46 70 Z" />
          </g>
        )}
      </g>
    </g>
  )
}

registerLayer('pattern', PatternLayer)
