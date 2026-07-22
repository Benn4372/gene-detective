import { useState } from 'react'
import { Layout, type ScreenKey } from '../ui/shared/Layout'
import { LessonsList } from '../ui/lessons/LessonsList'
import { LessonRunner } from '../ui/lessons/LessonRunner'
import { StableScreen } from '../ui/stable/StableScreen'
import { BreedingRoom } from '../ui/breeding/BreedingRoom'
import { OrdersBoard } from '../ui/orders/OrdersBoard'
import { ConceptCodex } from '../ui/glossary/ConceptCodex'
import { useGameStore } from '../state/gameStore'

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('lessons')
  const currentLessonId = useGameStore(s => s.currentLessonId)

  return (
    <Layout current={screen} onNavigate={setScreen}>
      {screen === 'lessons' &&
        (currentLessonId ? <LessonRunner /> : <LessonsList />)}
      {screen === 'stable' && <StableScreen />}
      {screen === 'breeding' && <BreedingRoom />}
      {screen === 'orders' && <OrdersBoard />}
      {screen === 'codex' && <ConceptCodex />}
    </Layout>
  )
}
