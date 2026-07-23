import { motion } from 'framer-motion'
import { blobSpecies } from '../../content'
import type { NotebookAssertion } from '../../content/types'
import { Modal } from '../atoms/Modal'

interface Props {
  open: boolean
  assertions: NotebookAssertion[]
  explanation?: string
  onNext(): void
}

// Confetti + explanation modal shown when the player has solved the stage.
// No auto-advance — the player has to click "Next" to move on, giving them
// a moment to internalise what they just deduced.
export function SolveCelebration({ open, assertions, explanation, onNext }: Props) {
  if (!open) return null

  const summary = assertions.map(a => {
    const gene = blobSpecies.genes.find(g => g.id === a.geneId)
    const label = gene?.name ?? a.geneId
    return `${a.creatureRole === 'mother' ? 'Mother' : 'Father'}'s ${label} = ${a.correctGenotype}`
  })

  return (
    <Modal open={open} onClose={onNext} z={80}>
      {/* Confetti burst behind the content */}
      <div className="relative">
        <Confetti />

        <div className="relative text-center py-4">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">
            Nailed it!
          </h2>
          <p className="text-sm text-stone-600 italic mb-4">
            You just proved every genotype in the notebook using the evidence
            you gathered.
          </p>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-4 text-left">
            <div className="text-xs uppercase tracking-widest text-emerald-700 mb-2">
              Confirmed
            </div>
            <ul className="space-y-1 text-sm text-stone-800 font-mono">
              {summary.map(line => (
                <li key={line}>
                  <span className="text-emerald-600">✓</span>{' '}
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {explanation && (
            <div className="text-sm text-stone-700 mb-6 whitespace-pre-line">
              {explanation}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="px-8 py-3 rounded-lg bg-amber-500 text-white font-medium text-lg shadow-md hover:bg-amber-600"
          >
            Next →
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i)
  const colors = [
    '#f87171',
    '#fbbf24',
    '#34d399',
    '#60a5fa',
    '#a78bfa',
    '#f472b6',
  ]
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {pieces.map(i => {
        const x = (i * 37) % 100
        const rot = (i * 47) % 360
        const color = colors[i % colors.length]
        const delay = (i % 6) * 0.05
        return (
          <motion.div
            key={i}
            initial={{ y: -20, rotate: rot, opacity: 1 }}
            animate={{ y: 260, rotate: rot + 220, opacity: 0 }}
            transition={{
              duration: 2 + (i % 4) * 0.4,
              delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeIn',
            }}
            style={{
              position: 'absolute',
              left: `${x}%`,
              width: 10,
              height: 14,
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        )
      })}
    </div>
  )
}
