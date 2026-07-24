import { useGameStore } from '../../state/gameStore'
import { missions, characterById, blobSpecies } from '../../content'
import { motion } from 'framer-motion'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'

// Phase 3 stub: Missions list without the actual runner. Clicking a mission
// currently just shows an "arriving in Phase 4" note. Full mission flow
// (Mission Runner + Notecards + Deliver Picker) lands next phase.
export function MissionsBoard() {
  const setActiveScreen = useGameStore(s => s.setActiveScreen)
  const openMission = useGameStore(s => s.openMission)
  const completedChapters = useGameStore(s => s.completedChapters)
  const completedMissions = useGameStore(s => s.completedMissions)

  const available = missions.filter(
    m =>
      m.minCompletedChapters <= completedChapters.length &&
      !completedMissions.includes(m.id),
  )
  const done = missions.filter(m => completedMissions.includes(m.id))

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setActiveScreen({ kind: 'station' })}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Return to Station
        </button>
        <h1 className="text-3xl font-bold text-stone-800 font-serif mb-1">
          📋 Missions Board
        </h1>
        <p className="text-sm text-stone-600 italic mb-6">
          Cases from the field. Each mission is a self-contained breeding puzzle.
        </p>

        {available.length === 0 ? (
          <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-8 text-center">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-stone-600 italic">
              No missions available. Complete more chapters to unlock work.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {available.map(m => {
              const client = characterById[m.clientCharacterId]
              const wanted = Object.entries(m.targetPhenotype)
                .map(([t, v]) => {
                  const trait = blobSpecies.traits.find(x => x.id === t)
                  return `${trait?.name ?? t}: ${phenotypeLabel(t, v)}`
                })
                .join(' · ')
              return (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openMission(m.id)}
                  className="w-full text-left rounded-xl border border-stone-300 bg-[color:var(--paper)] p-4 hover:border-stone-400 hover:shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{client?.emoji ?? '🧑'}</span>
                    <div>
                      <div className="font-semibold text-stone-800">
                        {client?.name}
                      </div>
                      <div className="text-xs text-stone-500 font-mono">
                        wanted: {wanted}
                        {m.breedBudget ? ` · budget: ${m.breedBudget} crosses` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-stone-700 italic">
                    "{m.clientBrief}"
                  </div>
                  <div className="text-xs text-purple-700 mt-2 font-medium">
                    Enter the lab →
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}

        {done.length > 0 && (
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
              ✓ Completed
            </div>
            <ul className="text-sm text-stone-600 space-y-1">
              {done.map(m => (
                <li key={m.id}>
                  {characterById[m.clientCharacterId]?.name} —{' '}
                  {m.clientBrief.slice(0, 60)}…
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
