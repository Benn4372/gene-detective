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

interface Props {
  creature: Creature
  species: Species
  size?: number
}

// Map the polygenic size phenotype (a numeric string 0-6, or undefined) to a
// visual scale multiplier applied to the whole blob group.
function scaleFor(sizePhenotype: string | undefined): number {
  const n = sizePhenotype === undefined ? NaN : Number(sizePhenotype)
  if (!Number.isFinite(n)) return 1
  // 0 → 0.7, 6 → 1.3, linear in between; unset falls to 1.
  return 0.7 + (0.6 * n) / 6
}

// The raw scale change alone isn't loud enough for players to distinguish a
// small blob from a medium one at a glance. Add a categorical size marker:
// outer halo ring for above-average, inner solid dot for below-average.
function sizeMarker(sizePhenotype: string | undefined): 'large' | 'small' | null {
  const n = sizePhenotype === undefined ? NaN : Number(sizePhenotype)
  if (!Number.isFinite(n)) return null
  if (n >= 4) return 'large'
  if (n <= 2) return 'small'
  return null
}

export function BlobRenderer({ creature, species, size = 120 }: Props) {
  const phenotype = computePhenotype(creature, species)
  const scale = scaleFor(phenotype.size)
  const marker = sizeMarker(phenotype.size)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      {/* All blob content scaled around the body's center (50, 55). */}
      <g transform={`translate(50 55) scale(${scale}) translate(-50 -55)`}>
        {/* Large-size halo — sits outside the body, dashed emerald ring. */}
        {marker === 'large' && (
          <ellipse
            cx="50" cy="55" rx="41" ry="36"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.4"
            strokeDasharray="3 2"
            opacity="0.85"
          />
        )}
        {/* Base blob body — neutral purple, colour is no longer a genotype. */}
        <ellipse cx="50" cy="55" rx="35" ry="30" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" />
        {/* Small-size marker — a small solid dot inside the body's centre. */}
        {marker === 'small' && (
          <circle cx="50" cy="55" r="3.5" fill="#4c1d95" opacity="0.55" />
        )}
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
          if (t.id === 'metabolism') return null // pleiotropic chemical, invisible
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
