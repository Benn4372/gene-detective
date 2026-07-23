import { registerLayer, type LayerComponent } from '../layerRegistry'

// Pattern layer — codominant.
// Phenotype values (from expressCodominant):
//   'R'  → stripes only    — thin uniform violet skin-bands across the body
//   'B'  → blotches only   — three large ink-blue cow-print splashes
//   'RB' → both simultaneously (heterozygote codominant expression)
//
// Both variants clip to the body ellipse AND to a face-cutout that removes
// the eyes and mouth region so pattern never draws over the face.
export const PatternLayer: LayerComponent = ({ phenotypeValue }) => {
  if (!phenotypeValue) return null
  const showStripes = phenotypeValue.includes('R')
  const showBlotches = phenotypeValue.includes('B')
  if (!showStripes && !showBlotches) return null
  return (
    <g>
      <defs>
        {/* Body outline. */}
        <clipPath id="pattern-body-clip">
          <ellipse cx="50" cy="55" rx="35" ry="30" />
        </clipPath>
        {/* Face cutout — pattern paints inside body BUT NOT over this
            rectangular face-zone that spans the eyes and mouth. Uses
            mask so black = hide, white = keep. */}
        <mask id="pattern-face-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {/* Eyes region — a soft rounded rect covering both eyes */}
          <rect x="30" y="42" width="40" height="16" rx="7" ry="7" fill="black" />
          {/* Mouth region — smaller rounded rect below eyes */}
          <rect x="38" y="62" width="24" height="12" rx="5" ry="5" fill="black" />
        </mask>
      </defs>
      <g clipPath="url(#pattern-body-clip)" mask="url(#pattern-face-mask)">
        {showStripes && (
          // Three thin uniform violet bands, all the same colour. Placed so
          // no band coincides with the eye/mouth y-ranges — the face mask
          // above also protects those regions in case future tweaks shift
          // things.
          <g fill="#7c5be0">
            <rect x="10" y="28" width="80" height="5" />
            <rect x="10" y="53" width="80" height="5" />
            <rect x="10" y="78" width="80" height="5" />
          </g>
        )}
        {showBlotches && (
          // Exactly three large cow-print splashes. Positioned to avoid the
          // eye zone (roughly y=42-58) and mouth zone (y=62-74). Two ride
          // the body silhouette on purpose so they read as coat markings.
          <g fill="#1e293b" opacity="0.82">
            {/* Top-right shoulder splash — big, hugs the upper-right curve. */}
            <path d="M 56 30 Q 78 26 84 40 Q 82 46 72 44 Q 60 42 56 30 Z" />
            {/* Bottom-left flank splash — big, hugs the bottom-left curve. */}
            <path d="M 14 66 Q 30 60 34 78 Q 22 84 12 76 Q 10 70 14 66 Z" />
            {/* Bottom-right flank splash — big, at the bottom-right curve. */}
            <path d="M 60 74 Q 78 70 82 82 Q 70 88 58 82 Q 54 78 60 74 Z" />
          </g>
        )}
      </g>
    </g>
  )
}

registerLayer('pattern', PatternLayer)
