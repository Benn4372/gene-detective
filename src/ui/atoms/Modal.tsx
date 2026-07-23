import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose(): void
  title?: string
  icon?: string
  children: ReactNode
  wide?: boolean
  z?: number
}

// Center-anchored, viewport-safe modal. Content scrolls inside (max-h-[90vh]).
// No exit animation — a persistent hard-close pattern that avoids stuck
// transparent-but-clickable backdrops.
export function Modal({ open, onClose, title, icon, children, wide, z = 50 }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: z }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
        className={
          'bg-[color:var(--paper)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-300 ' +
          (wide ? 'max-w-6xl w-full' : 'max-w-3xl w-full')
        }
      >
        {(title || icon) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-300 flex-shrink-0">
            <div className="flex items-center gap-3">
              {icon && <span className="text-3xl">{icon}</span>}
              {title && (
                <h2 className="text-xl font-bold text-stone-800 font-serif">{title}</h2>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-50 border border-stone-300 text-stone-600 hover:text-stone-900 flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </motion.button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </motion.div>
    </div>
  )
}
