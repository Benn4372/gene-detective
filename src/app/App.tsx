import { useEffect } from 'react'
import { TopBar } from '../ui/shared/TopBar'
import { NavBar } from '../ui/shared/NavBar'
import { Modal } from '../ui/shared/Modal'
import { Village } from '../ui/village/Village'
import { OrdersPanel } from '../ui/orders/OrdersPanel'
import { BreedingRoom } from '../ui/breeding/BreedingRoom'
import { ShopPanel } from '../ui/shop/ShopPanel'
import { LabPanel } from '../ui/lab/LabPanel'
import { Celebration } from '../ui/shared/Celebration'
import { useGameStore } from '../state/gameStore'
import { orderTemplateById } from '../content'

export type ModalKey = 'orders' | 'breed' | 'shop'

export default function App() {
  const activeModal = useGameStore(s => s.activeModal)
  const setActiveModal = useGameStore(s => s.setActiveModal)
  const hasAutoOpened = useGameStore(s => s.hasAutoOpened)
  const markAutoOpened = useGameStore(s => s.markAutoOpened)
  const unlockedLessons = useGameStore(s => s.unlockedLessons)
  const completedLessons = useGameStore(s => s.completedLessons)
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const startLesson = useGameStore(s => s.startLesson)
  const activeLabOrderId = useGameStore(s => s.activeLabOrderId)
  const closeLab = useGameStore(s => s.closeLab)
  const justCompletedLessonId = useGameStore(s => s.justCompletedLessonId)
  const clearJustCompleted = useGameStore(s => s.clearJustCompleted)

  // Auto-open Orders on load when there's an unfinished lesson available.
  // Guarded by `hasAutoOpened` in the store so strict-mode remounts and HMR
  // don't repeatedly yank the player back into a modal.
  useEffect(() => {
    if (hasAutoOpened) return
    const availableLesson = unlockedLessons.find(
      id => !completedLessons.includes(id),
    )
    if (availableLesson) {
      setActiveModal('orders')
      if (!currentLessonId) startLesson(availableLesson)
    }
    markAutoOpened()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showLab = activeLabOrderId !== null
  const activeLab = showLab ? orderTemplateById[activeLabOrderId] : null
  const suppress = !!justCompletedLessonId

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TopBar />
      <Village />
      <NavBar active={activeModal} onOpen={setActiveModal} />

      <Modal
        open={activeModal === 'orders' && !showLab && !suppress}
        onClose={() => setActiveModal(null)}
        title="Orders & Lessons"
        icon="📋"
        wide
      >
        <OrdersPanel />
      </Modal>

      <Modal
        open={showLab && !suppress}
        onClose={closeLab}
        title={activeLab ? `Lab · ${activeLab.flavorText.slice(0, 60)}` : 'Lab'}
        icon="🔬"
        wide
      >
        <LabPanel />
      </Modal>

      <Modal
        open={activeModal === 'breed' && !showLab && !suppress}
        onClose={() => setActiveModal(null)}
        title="Breeding Room"
        icon="❤️"
      >
        <BreedingRoom />
      </Modal>

      <Modal
        open={activeModal === 'shop' && !showLab && !suppress}
        onClose={() => setActiveModal(null)}
        title="Shop"
        icon="🛒"
      >
        <ShopPanel />
      </Modal>

      <Celebration
        lessonId={justCompletedLessonId}
        onDismiss={clearJustCompleted}
      />
    </div>
  )
}
