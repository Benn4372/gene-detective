import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVillageCreatures, useGameStore } from '../../state/gameStore'
import { BlobActor } from './BlobActor'
import { CreatureCard } from '../shared/CreatureCard'

// Hash a string to a deterministic float in [0, 1). Cheap; good enough for
// spreading blobs around the field consistently per id.
function hashUnit(s: string, salt = 0): number {
  let h = 2166136261 ^ salt
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 100000) / 100000
}

interface Placement {
  x: number
  y: number
  drift: { dx: number; dy: number }
  jiggleDelay: number
}

function placeCreatures(
  ids: string[],
  width: number,
  height: number,
): Record<string, Placement> {
  const padX = 80
  const padY = 80
  const out: Record<string, Placement> = {}
  for (const id of ids) {
    const rx = hashUnit(id, 1)
    const ry = hashUnit(id, 2)
    const dx = (hashUnit(id, 3) - 0.5) * 40
    const dy = (hashUnit(id, 4) - 0.5) * 20
    const delay = hashUnit(id, 5) * 2
    out[id] = {
      x: padX + rx * Math.max(1, width - padX * 2),
      y: padY + ry * Math.max(1, height - padY * 2),
      drift: { dx, dy },
      jiggleDelay: delay,
    }
  }
  return out
}

export function Village() {
  const villageCreatures = useVillageCreatures()
  const renameCreature = useGameStore(s => s.renameCreature)
  const releaseCreature = useGameStore(s => s.releaseCreature)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Use a fixed virtual canvas — the village sits inside a scrollable area on
  // small screens but this keeps blob positions stable.
  const CANVAS_W = 1100
  const CANVAS_H = 500

  const placements = useMemo(
    () => placeCreatures(villageCreatures.map(c => c.id), CANVAS_W, CANVAS_H),
    [villageCreatures],
  )

  const selected = selectedId ? villageCreatures.find(c => c.id === selectedId) : null

  return (
    <div className="absolute inset-0 pt-14 pb-28 overflow-hidden">
      {/* Grassy background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, #a7f3d0 0%, #6ee7b7 40%, #34d399 100%)',
        }}
      />
      {/* Decorative "grass" tufts */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {Array.from({ length: 40 }).map((_, i) => {
          const x = hashUnit(String(i), 11) * 100
          const y = hashUnit(String(i), 12) * 100
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontSize: 20 + hashUnit(String(i), 13) * 12,
              }}
            >
              🌱
            </div>
          )
        })}
      </div>

      {/* Blob field */}
      <div className="relative h-full overflow-auto">
        <div
          className="relative mx-auto"
          style={{ width: CANVAS_W, height: CANVAS_H }}
        >
          {villageCreatures.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur rounded-lg px-6 py-4 text-center shadow-md">
                <div className="text-3xl mb-2">🌾</div>
                <div className="text-slate-700 font-medium">Your village is empty.</div>
                <div className="text-slate-500 text-sm mt-1">
                  Open <span className="font-semibold">Orders</span> to start your first
                  lesson — you'll earn your first blobs there.
                </div>
              </div>
            </div>
          ) : (
            villageCreatures.map(c => {
              const p = placements[c.id]
              if (!p) return null
              return (
                <BlobActor
                  key={c.id}
                  creature={c}
                  x={p.x}
                  y={p.y}
                  drift={p.drift}
                  jiggleDelay={p.jiggleDelay}
                  onClick={() => {
                    setSelectedId(c.id)
                    setRenameValue(c.ownerName ?? '')
                  }}
                />
              )
            })
          )}
        </div>
      </div>

      {/* Selected creature detail popover */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 z-40 flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <CreatureCard creature={selected} />
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  placeholder="Rename"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
                />
                <button
                  onClick={() => {
                    renameCreature(selected.id, renameValue.trim())
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    releaseCreature(selected.id)
                    setSelectedId(null)
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Release into the wild
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
