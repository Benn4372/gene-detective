import type { Creature, Species } from '../engine/types'
import { computePhenotype } from '../engine/phenotype'
import { getLayer } from './layerRegistry'
import './layers/antennae'
import './layers/spots'
import './layers/pattern'
import './layers/horns'
import './layers/eyeGlow'
import './layers/fins'
import './layers/heatSpot'
import './layers/sparkle'
import './layers/lethalCoat'
import './layers/mitoHalo'
import './layers/braincrest'
import './layers/broodPouch'
import './layers/imprintMark'
import './layers/tail'
import './layers/metabolism'

interface Props {
  creature: Creature
  species: Species
  size?: number
}

// Map the polygenic size phenotype (a numeric string 0-6, or undefined) to a
// visual scale multiplier applied to the whole blob group. Range is wide on
// purpose so a size-0 and a size-6 read as noticeably different sizes at a
// glance — no ring / dot markers, the scale alone carries the info.
function scaleFor(sizePhenotype: string | undefined): number {
  const n = sizePhenotype === undefined ? NaN : Number(sizePhenotype)
  if (!Number.isFinite(n)) return 1
  // 0 → 0.45, 6 → 1.55, linear in between; unset falls to 1.
  return 0.45 + (1.1 * n) / 6
}

export function BlobRenderer({ creature, species, size = 120 }: Props) {
  const phenotype = computePhenotype(creature, species)
  const scale = scaleFor(phenotype.size)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      {/* All blob content scaled around the body's center (50, 55). */}
      <g transform={`translate(50 55) scale(${scale}) translate(-50 -55)`}>
        {/* Base blob body — neutral purple, colour is no longer a genotype. */}
        <ellipse cx="50" cy="55" rx="35" ry="30" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Eyes */}
        <circle cx="40" cy="50" r="3.5" fill="#1e293b" />
        <circle cx="60" cy="50" r="3.5" fill="#1e293b" />
        <circle cx="41" cy="49" r="1" fill="white" />
        <circle cx="61" cy="49" r="1" fill="white" />
        {/* Mouth */}
        <path d="M 42 66 Q 50 71 58 66" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Trait-driven layers */}
        {species.traits.map(t => {
          if (t.id === 'size') return null // size drives group scale
          if (t.id === 'tailGrowth') return null // masks tail, no direct render
          const Layer = getLayer(t.id)
          return Layer ? <Layer key={t.id} phenotypeValue={phenotype[t.id]} /> : null
        })}
      </g>
    </svg>
  )
}

// Small badge used inside cards next to the blob's name.
export function SexBadge({ sex }: { sex: 'M' | 'F' }) {
  const isFemale = sex === 'F'
  return (
    <span
      title={isFemale ? 'Female' : 'Male'}
      className={
        'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ' +
        (isFemale ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700')
      }
    >
      {isFemale ? '♀' : '♂'}
    </span>
  )
}
