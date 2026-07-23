import { motion } from 'framer-motion'
import { useGameStore, useTrophyBlobs } from '../../state/gameStore'
import { chapters, blobSpecies } from '../../content'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { computePhenotype } from '../../engine/phenotype'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { SexBadge } from '../atoms/SexBadge'

// Deterministic-per-blob idle jiggle offsets so each trophy has its own
// personality instead of moving in lockstep.
function jiggleDelay(id: string): number {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return (h % 1000) / 1000
}

export function TrophyShelf() {
  const setActiveScreen = useGameStore(s => s.setActiveScreen)
  const trophyBlobs = useTrophyBlobs()
  const trophyMap = useGameStore(s => s.trophyBlobs)
  const completedChapters = useGameStore(s => s.completedChapters)
  const unlockedTraits = useGameStore(s => s.unlockedTraits)

  const trophyByChapter = new Map<string, string>(
    Object.entries(trophyMap),
  )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setActiveScreen({ kind: 'station' })}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Return to Station
        </button>
        <h1 className="text-3xl font-bold text-stone-800 font-serif mb-1">
          🏆 Trophy Shelf
        </h1>
        <p className="text-sm text-stone-600 italic mb-6">
          One blob from every chapter you've completed. Sentimental only —
          they're safely displayed here and never leave.
        </p>

        {trophyBlobs.length === 0 ? (
          <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-8 text-center">
            <div className="text-4xl mb-2">🪴</div>
            <div className="text-stone-600 italic">
              The shelf is empty. Complete a chapter to add your first trophy.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chapters
              .filter(ch => completedChapters.includes(ch.id))
              .map(ch => {
                const trophyId = trophyByChapter.get(ch.id)
                const blob = trophyId ? trophyBlobs.find(t => t.id === trophyId) : null
                if (!blob) return null
                const phen = computePhenotype(blob, blobSpecies)
                const delay = jiggleDelay(blob.id) * 2
                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="rounded-xl border-2 border-stone-300 bg-[color:var(--paper)] p-4 shadow-md flex flex-col items-center"
                  >
                    <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                      Chapter {ch.order}
                    </div>
                    <div className="text-sm font-semibold text-stone-800 font-serif mb-1 text-center">
                      {ch.title}
                    </div>
                    <div className="text-[10px] italic text-stone-600 mb-2 text-center max-w-[180px] leading-tight">
                      {ch.concept}
                    </div>
                    <motion.div
                      animate={{ y: [0, -4, 0, -2, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay,
                      }}
                    >
                      <BlobRenderer creature={blob} species={blobSpecies} size={80} />
                    </motion.div>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <SexBadge sex={blob.sex} />
                      <span className="text-stone-700">
                        {blob.ownerName ?? `#${blob.id.slice(-4)}`}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-stone-500">
                      {blobSpecies.traits
                        // Only show traits the player has been taught. Ch 1
                        // trophies were listing "s" for spots before Ch 3
                        // introduced the concept.
                        .filter(t =>
                          t.category === 'visible' &&
                          unlockedTraits.includes(t.id),
                        )
                        .map(t => ({ id: t.id, val: phen[t.id] }))
                        .filter(({ val }) => val && val !== 'absent')
                        .map(({ id, val }) => phenotypeLabel(id, val))
                        .join(' · ') || '—'}
                    </div>
                  </motion.div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
