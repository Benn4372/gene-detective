import type { Creature, Species } from '../engine/types'
import { computePhenotype } from '../engine/phenotype'
import { getLayer } from './layerRegistry'
import './layers/antennae'
import './layers/spots'

interface Props {
  creature: Creature
  species: Species
  size?: number
}

export function BlobRenderer({ creature, species, size = 120 }: Props) {
  const phenotype = computePhenotype(creature, species)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      {/* Base blob body */}
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
        const Layer = getLayer(t.id)
        return Layer ? <Layer key={t.id} phenotypeValue={phenotype[t.id]} /> : null
      })}
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
