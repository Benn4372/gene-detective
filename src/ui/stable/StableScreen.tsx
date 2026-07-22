import { useState } from 'react'
import { useGameStore } from '../../state/gameStore'
import { CreatureCard } from '../shared/CreatureCard'

export function StableScreen() {
  const creatures = useGameStore(s => s.creatures)
  const releaseCreature = useGameStore(s => s.releaseCreature)
  const renameCreature = useGameStore(s => s.renameCreature)
  const [selected, setSelected] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const list = Object.values(creatures)
  const selectedCreature = selected ? creatures[selected] : null

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Your stable</h2>
      <p className="text-sm text-slate-500 mb-6">
        Every blob you own. Click one to rename or release it.
      </p>

      {list.length === 0 ? (
        <div className="text-slate-500 italic">
          Empty. Start a lesson to get your first pair of blobs.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map(c => (
            <CreatureCard
              key={c.id}
              creature={c}
              onClick={() => {
                setSelected(c.id)
                setRenameValue(c.ownerName ?? '')
              }}
              selected={selected === c.id}
            />
          ))}
        </div>
      )}

      {selectedCreature && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-semibold mb-3">
            {selectedCreature.ownerName ?? `Blob #${selectedCreature.id.slice(-4)}`}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Give this blob a name"
              className="px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              onClick={() => renameCreature(selectedCreature.id, renameValue.trim())}
              className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              Rename
            </button>
          </div>
          <button
            onClick={() => {
              releaseCreature(selectedCreature.id)
              setSelected(null)
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Release into the wild
          </button>
        </div>
      )}
    </div>
  )
}
