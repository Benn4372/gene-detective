import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose(): void
  title?: string
  icon?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, icon, children, wide }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className={
              'bg-slate-50 rounded-2xl shadow-2xl my-8 flex flex-col ' +
              (wide ? 'max-w-6xl w-full' : 'max-w-3xl w-full')
            }
          >
            {(title || icon) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
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
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
