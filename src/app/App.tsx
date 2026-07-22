import { useEffect, useState } from 'react'
import { TopBar } from '../ui/shared/TopBar'
import { NavBar } from '../ui/shared/NavBar'
import { Modal } from '../ui/shared/Modal'
import { Village } from '../ui/village/Village'
import { OrdersPanel } from '../ui/orders/OrdersPanel'
import { BreedingRoom } from '../ui/breeding/BreedingRoom'
import { ShopPanel } from '../ui/shop/ShopPanel'
import { useGameStore } from '../state/gameStore'

export type ModalKey = 'orders' | 'breed' | 'shop'

export default function App() {
  const [active, setActive] = useState<ModalKey | null>(null)
  const unlockedLessons = useGameStore(s => s.unlockedLessons)
  const completedLessons = useGameStore(s => s.completedLessons)
  const currentLessonId = useGameStore(s => s.currentLessonId)
  const startLesson = useGameStore(s => s.startLesson)

  // Auto-open Orders on load when there's an unfinished lesson available.
  useEffect(() => {
    const availableLesson = unlockedLessons.find(
      id => !completedLessons.includes(id),
    )
    if (availableLesson) {
      setActive('orders')
      // If nothing is currently in progress, kick off the earliest available lesson
      // so the runner is showing immediately.
      if (!currentLessonId) startLesson(availableLesson)
    }
    // Only run once on mount; subsequent lesson unlocks show up when the user
    // reopens Orders themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TopBar />
      <Village />
      <NavBar active={active} onOpen={setActive} />

      <Modal
        open={active === 'orders'}
        onClose={() => setActive(null)}
        title="Orders & Lessons"
        icon="📋"
        wide
      >
        <OrdersPanel />
      </Modal>

      <Modal
        open={active === 'breed'}
        onClose={() => setActive(null)}
        title="Breeding Room"
        icon="❤️"
      >
        <BreedingRoom />
      </Modal>

      <Modal
        open={active === 'shop'}
        onClose={() => setActive(null)}
        title="Shop"
        icon="🛒"
      >
        <ShopPanel />
      </Modal>
    </div>
  )
}
