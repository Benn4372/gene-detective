import { motion } from 'framer-motion'
import { useGameStore, useVillageCreatures } from '../../state/gameStore'

export function TopBar() {
  const coins = useGameStore(s => s.coins)
  const village = useVillageCreatures()
  const cap = useGameStore(s => s.stableCap)

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/70 backdrop-blur-md border-b border-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🧬</span>
        <h1 className="text-lg font-bold text-slate-800">Gene Detective</h1>
      </div>
      <div className="flex items-center gap-3">
        <motion.div
          key={`village-${village.length}`}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-sm font-medium bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full"
        >
          🏡 {village.length}/{cap}
        </motion.div>
        <motion.div
          key={`coins-${coins}`}
          initial={{ scale: 1.3, y: -2 }}
          animate={{ scale: 1, y: 0 }}
          className="text-sm font-medium bg-amber-100 text-amber-800 px-3 py-1 rounded-full"
        >
          🪙 {coins}
        </motion.div>
      </div>
    </header>
  )
}
