import { motion } from 'framer-motion'
import type { ModalKey } from '../../app/App'

interface NavItem {
  key: ModalKey
  icon: string
  label: string
  color: string
}

const NAV: NavItem[] = [
  { key: 'orders', icon: '📋', label: 'Orders & Lessons', color: 'bg-amber-400' },
  { key: 'breed', icon: '❤️', label: 'Breed', color: 'bg-pink-500' },
  { key: 'shop', icon: '🛒', label: 'Shop', color: 'bg-sky-500' },
]

interface Props {
  active: ModalKey | null
  onOpen(k: ModalKey): void
}

export function NavBar({ active, onOpen }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-end gap-4 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white">
        {NAV.map(item => {
          const isActive = active === item.key
          return (
            <div key={item.key} className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.12, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onOpen(item.key)}
                className={
                  'w-16 h-16 rounded-full text-3xl shadow-lg flex items-center justify-center transition-colors ' +
                  item.color +
                  (isActive ? ' ring-4 ring-white' : ' hover:brightness-110')
                }
                aria-label={item.label}
                title={item.label}
              >
                <span>{item.icon}</span>
              </motion.button>
              <span className="mt-1 text-[10px] font-semibold text-slate-700 uppercase tracking-wide">
                {item.label.split(' ')[0]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
