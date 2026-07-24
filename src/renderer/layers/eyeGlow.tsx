import { registerLayer, type LayerComponent } from '../layerRegistry'

// Eye-glow layer — X-linked. Females inactivate one X per cell in early
// development, so a heterozygous Gg female is a MOSAIC: some cells express
// G (glow), others express g (dark). Renders as patchy glow — one eye
// full-bright, the other dim, plus scattered body glow-flecks.
//
//   'G' phenotype + male hemizygous     → uniform glow both eyes
//   'G' phenotype + female homozygous GG → uniform glow both eyes
//   'G' phenotype + female heterozygous Gg → MOSAIC (patchy)
//   'g' phenotype                       → no glow
export const EyeGlowLayer: LayerComponent = ({ phenotypeValue, creature }) => {
  if (phenotypeValue !== 'G') return null

  const alleles = creature?.genotype.eyeGlow ?? []
  // Deterministic per-creature "which eye got the G X" — hash the id so the
  // pattern is stable across renders instead of flickering every re-render.
  const isMosaic =
    creature?.sex === 'F' && alleles.length === 2 && alleles[0] !== alleles[1]
  const hash = creature ? hashString(creature.id) : 0
  const rightEyeIsG = (hash & 1) === 0

  const gradient = (
    <defs>
      <radialGradient id="eye-glow-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
        <stop offset="60%" stopColor="#facc15" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="eye-glow-dim-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.25" />
        <stop offset="70%" stopColor="#fef3c7" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
      </radialGradient>
    </defs>
  )

  if (!isMosaic) {
    return (
      <g>
        {gradient}
        <circle cx="40" cy="50" r="8" fill="url(#eye-glow-grad)" />
        <circle cx="60" cy="50" r="8" fill="url(#eye-glow-grad)" />
      </g>
    )
  }

  // Mosaic female Gg: one eye is bright (cells with active G-X), the other
  // dim (cells with active g-X). Plus a few speckled glow-patches around the
  // body to convey per-cell mosaicism, positioned deterministically from the
  // creature id.
  const brightEye = rightEyeIsG ? 60 : 40
  const dimEye = rightEyeIsG ? 40 : 60
  return (
    <g>
      {gradient}
      <circle cx={brightEye} cy="50" r="8" fill="url(#eye-glow-grad)" />
      <circle cx={dimEye} cy="50" r="8" fill="url(#eye-glow-dim-grad)" />
      {/* Body speckles — a handful of small glow-cells scattered inside the
          body ellipse (rx 35, ry 30 around cx=50 cy=55). Positions derived
          from the id hash so mosaic looks distinct per creature but stable. */}
      <g fill="#fde047" opacity="0.6">
        {speckleOffsets(hash).map(([dx, dy], i) => (
          <circle key={i} cx={50 + dx} cy={55 + dy} r={1.2} />
        ))}
      </g>
      {/* Mosaic mode legend — a tiny "X" on the head area, only visible on
          careful inspection but present so a curious player can spot it. */}
      <text x="50" y="34" fontSize="4.5" textAnchor="middle" fill="#78350f" opacity="0.65">
        mosaic
      </text>
    </g>
  )
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function speckleOffsets(hash: number): [number, number][] {
  // 6 speckles positioned inside the body ellipse using deterministic offsets
  // derived from the hash.
  const offsets: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = ((hash >> (i * 3)) & 0xff) / 255 * Math.PI * 2
    const radius = 8 + (((hash >> (i * 5)) & 0xff) / 255) * 18
    offsets.push([
      Math.round(Math.cos(angle) * radius * 10) / 10,
      Math.round(Math.sin(angle) * radius * 0.75 * 10) / 10,
    ])
  }
  return offsets
}

registerLayer('eyeGlow', EyeGlowLayer)
