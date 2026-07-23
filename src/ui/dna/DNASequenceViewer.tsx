import { useState } from 'react'

interface Props {
  variants: Array<{
    label: string
    before: string
    after: string
    consequence: string
  }>
}

// DNA sequence viewer — mono-spaced strip with colored A/C/G/T. Shows a
// before/after pair per variant with a plain-language consequence. Used from
// Ch 41 to teach point/silent/missense/nonsense/frameshift/splice mutations.
const NUCLEOTIDE_COLOR: Record<string, string> = {
  A: '#22c55e',
  C: '#0ea5e9',
  G: '#f59e0b',
  T: '#ef4444',
  U: '#a855f7',
  '-': '#94a3b8',
}

export function DNASequenceViewer({ variants }: Props) {
  const [pick, setPick] = useState(0)
  const variant = variants[pick] ?? variants[0]
  if (!variant) return null
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {variants.map((v, i) => (
          <button
            key={i}
            onClick={() => setPick(i)}
            className={
              'px-3 py-1.5 rounded text-xs font-medium ' +
              (i === pick
                ? 'bg-amber-500 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200')
            }
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <SequenceRow label="Wild-type" seq={variant.before} />
        <SequenceRow label="Mutant" seq={variant.after} highlightVs={variant.before} />
      </div>
      <div className="mt-3 text-sm text-stone-700 italic border-t border-stone-200 pt-3">
        <span className="font-semibold not-italic">Consequence:</span>{' '}
        {variant.consequence}
      </div>
    </div>
  )
}

function SequenceRow({
  label,
  seq,
  highlightVs,
}: {
  label: string
  seq: string
  highlightVs?: string
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
        {label}
      </div>
      <div
        className="font-mono text-lg overflow-x-auto whitespace-nowrap p-2 rounded bg-stone-50 border border-stone-200"
        style={{ letterSpacing: '0.15em' }}
      >
        {seq.split('').map((ch, i) => {
          const changed = highlightVs && highlightVs[i] !== ch
          return (
            <span
              key={i}
              style={{
                color: NUCLEOTIDE_COLOR[ch.toUpperCase()] ?? '#334155',
                backgroundColor: changed ? '#fef08a' : 'transparent',
                padding: changed ? '0 2px' : '0',
                fontWeight: changed ? 700 : 400,
              }}
            >
              {ch}
            </span>
          )
        })}
      </div>
    </div>
  )
}
