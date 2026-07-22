import { motion } from 'framer-motion'
import type { Creature } from '../../engine/types'
import { BlobRenderer, SexBadge } from '../../renderer/BlobRenderer'
import { blobSpecies } from '../../content'

interface Props {
  creature: Creature
  x: number
  y: number
  drift: { dx: number; dy: number }
  jiggleDelay: number
  onClick?(): void
}

// One blob living in the village. Idles with a jiggle + subtle position drift,
// and springs on click.
export function BlobActor({ creature, x, y, drift, jiggleDelay, onClick }: Props) {
  const name = creature.ownerName ?? `Blob #${creature.id.slice(-4)}`
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{
        x: [x, x + drift.dx, x - drift.dx * 0.4, x],
        y: [y, y + drift.dy, y - drift.dy * 0.4, y],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: jiggleDelay,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="absolute left-0 top-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-full"
      style={{ transformOrigin: 'center' }}
    >
      <motion.div
        animate={{ y: [0, -6, 0, -3, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: jiggleDelay * 0.3,
        }}
        className="flex flex-col items-center"
      >
        <BlobRenderer creature={creature} species={blobSpecies} size={100} />
        <div className="mt-1 flex items-center gap-1 text-xs bg-white/80 backdrop-blur px-2 py-0.5 rounded-full shadow-sm">
          <SexBadge sex={creature.sex} />
          <span className="font-medium text-slate-700">{name}</span>
        </div>
      </motion.div>
    </motion.button>
  )
}
