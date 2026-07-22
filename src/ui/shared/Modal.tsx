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

// Centered modal that stays in the viewport regardless of scroll. Content
// scrolls inside the panel (max-h-[90vh] + inner overflow-y-auto) so tall
// pages don't push the panel off-screen.
export function Modal({ open, onClose, title, icon, children, wide, z = 50 }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: z }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
        className={
          'bg-slate-50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ' +
          (wide ? 'max-w-6xl w-full' : 'max-w-3xl w-full')
        }
      >
        {(title || icon) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              {icon && <span className="text-3xl">{icon}</span>}
              {title && (
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center"
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
