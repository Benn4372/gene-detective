import { registerLayer, type LayerComponent } from '../layerRegistry'

// Pattern layer — codominant.
// Phenotype values (from expressCodominant):
//   'R'  → stripes only    — thick alternating bands recolouring the body
//   'B'  → blotches only   — cow-print splashes, some deliberately at the
//                            body's silhouette edge so they read as intended
//   'RB' → both simultaneously (heterozygote codominant expression)
//
// Both variants recolour the body itself rather than sitting on top of it, so
// the pattern looks like the blob's skin rather than paint stuck to it.
// Everything is clipped to the body ellipse via the same pattern-body-clip
// path that BlobRenderer's body uses (cx 50, cy 55, rx 35, ry 30).
export const PatternLayer: LayerComponent = ({ phenotypeValue }) => {
  if (!phenotypeValue) return null
  const showStripes = phenotypeValue.includes('R')
  const showBlotches = phenotypeValue.includes('B')
  if (!showStripes && !showBlotches) return null
  return (
    <g>
      <defs>
        <clipPath id="pattern-body-clip">
          <ellipse cx="50" cy="55" rx="35" ry="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#pattern-body-clip)">
        {showStripes && (
          // Thick horizontal bands that recolour whole slabs of the body.
          // Rendered as filled rects (not strokes) so they read as skin, not
          // pinstripes. The band colours alternate warm/cool violet so they
          // sit naturally on the base body without looking painted on. The
          // top and bottom bands extend past the body's y-range and get
          // clipped by pattern-body-clip so they follow the curved silhouette.
          <g>
            <rect x="10" y="26" width="80" height="10" fill="#9d7cf5" />
            <rect x="10" y="46" width="80" height="10" fill="#7c5be0" />
            <rect x="10" y="66" width="80" height="10" fill="#9d7cf5" />
            {/* Thin darker seam between bands so eye reads them as bands, not
                one solid colour block. */}
            <line x1="10" y1="36" x2="90" y2="36" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />
            <line x1="10" y1="46" x2="90" y2="46" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />
            <line x1="10" y1="56" x2="90" y2="56" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />
            <line x1="10" y1="66" x2="90" y2="66" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />
            <line x1="10" y1="76" x2="90" y2="76" stroke="#4c1d95" strokeWidth="0.6" opacity="0.4" />
          </g>
        )}
        {showBlotches && (
          // Cow-print blotches — irregular, mostly interior but two ride the
          // silhouette edge on purpose so it looks like natural coat markings
          // rather than stickers. Dark ink-blue that reads as pigment against
          // the violet body.
          <g fill="#1e293b" opacity="0.82">
            {/* Edge-hugging left blob (spills off the top-left curve, gets clipped) */}
            <path d="M 12 32 Q 22 26 32 34 Q 36 44 28 48 Q 18 46 12 42 Z" />
            {/* Interior right-middle blob — the classic irregular splash */}
            <path d="M 54 44 Q 68 42 72 52 Q 66 60 58 58 Q 50 54 54 44 Z" />
            {/* Edge-hugging bottom-right blob (spills off the bottom curve) */}
            <path d="M 60 68 Q 74 66 80 76 Q 70 84 58 80 Q 54 74 60 68 Z" />
            {/* Small interior blob for asymmetric detail */}
            <path d="M 32 62 Q 42 60 44 68 Q 38 74 30 70 Q 28 66 32 62 Z" />
          </g>
        )}
      </g>
    </g>
  )
}

registerLayer('pattern', PatternLayer)
