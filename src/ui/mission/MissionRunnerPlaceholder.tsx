import { useGameStore } from '../../state/gameStore'

// Phase 3 placeholder — the actual Mission Runner (Workbench + Notecards +
// Deliver Picker) arrives in Phase 4.
export function MissionRunnerPlaceholder() {
  const closeMission = useGameStore(s => s.closeMission)
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={closeMission}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Back to Missions Board
        </button>
        <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-8 text-center">
          <div className="text-5xl mb-3">🔬</div>
          <h2 className="text-xl font-bold text-stone-800 font-serif mb-2">
            Mission Runner arriving in Phase 4
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            The lab bench, sample notecards, and deliver-picker are being built
            next. For now, the Mission Board just previews what's coming.
          </p>
        </div>
      </div>
    </div>
  )
}
