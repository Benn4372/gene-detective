import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { lessonById } from '../../content'

interface Props {
  lessonId: string | null
  onDismiss(): void
}

// A floating card that appears when a lesson has just been completed.
// Auto-dismisses after a few seconds; player can also click to dismiss sooner.
export function Celebration({ lessonId, onDismiss }: Props) {
  const lesson = lessonId ? lessonById[lessonId] : null

  useEffect(() => {
    if (!lessonId) return
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [lessonId, onDismiss])

  return (
    <AnimatePresence>
      {lesson && (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] cursor-pointer"
          onClick={onDismiss}
        >
          <div className="bg-gradient-to-br from-amber-400 to-pink-500 text-white rounded-2xl shadow-2xl px-8 py-6 text-center max-w-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="text-5xl mb-2"
            >
              🎉
            </motion.div>
            <div className="text-lg font-bold">Lesson {lesson.order} complete!</div>
            <div className="text-sm mt-1 opacity-90">
              Your two blobs have joined the village. Check the Orders panel — you'll
              need to complete a few orders to unlock the next lesson.
            </div>
            <div className="text-[10px] uppercase tracking-wide mt-3 opacity-70">
              Click to dismiss
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
