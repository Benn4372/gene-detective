import { useGameStore } from '../state/gameStore'
import { Station } from '../ui/station/Station'
import { ChapterRunner } from '../ui/chapter/ChapterRunner'
import { MissionsBoard } from '../ui/mission/MissionsBoard'
import { MissionRunner } from '../ui/mission/MissionRunner'
import { TrophyShelf } from '../ui/trophy/TrophyShelf'
import { TraitCodexDrawer } from '../ui/codex/TraitCodexDrawer'

// Top-level screen router. `activeScreen` in the store drives which screen
// renders. The Trait Codex drawer is always mounted so its 📖 button is
// available everywhere.

export default function App() {
  const activeScreen = useGameStore(s => s.activeScreen)
  const currentChapterId = useGameStore(s => s.currentChapterId)

  return (
    <>
      {activeScreen.kind === 'station' && <Station />}
      {activeScreen.kind === 'chapter' && currentChapterId && <ChapterRunner />}
      {activeScreen.kind === 'missions-board' && <MissionsBoard />}
      {activeScreen.kind === 'mission' && <MissionRunner />}
      {activeScreen.kind === 'trophy-shelf' && <TrophyShelf />}
      <TraitCodexDrawer />
    </>
  )
}
