import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore, useTrophyBlobs } from '../../state/gameStore'
import { chapters, mentors } from '../../content'

// The Blob Research Station — the game's home screen. A stylized office
// interior (not photo-realistic; warm lamp light, chalkboard, cabinets) with
// clickable interactive regions for each of the game's major activities.

export function Station() {
  const setActiveScreen = useGameStore(s => s.setActiveScreen)
  const unlockedChapters = useGameStore(s => s.unlockedChapters)
  const completedChapters = useGameStore(s => s.completedChapters)
  const unlockedMentors = useGameStore(s => s.unlockedMentors)
  const startChapter = useGameStore(s => s.startChapter)
  const trophyBlobs = useTrophyBlobs()

  const nextChapter = useMemo(() => {
    for (const ch of chapters) {
      if (unlockedChapters.includes(ch.id) && !completedChapters.includes(ch.id)) {
        return ch
      }
    }
    return null
  }, [unlockedChapters, completedChapters])

  const availableMentors = mentors.filter(m => unlockedMentors.includes(m.id))

  const resetProgress = () => {
    // Purge everything and reload so the game re-hydrates from a fresh state.
    // Two-step confirmation because it deletes every unlocked chapter, trophy,
    // and in-flight breeding scratch — no undo.
    if (!window.confirm('Reset ALL progress? This deletes every completed chapter, trophy, and current breeding state. Cannot be undone.')) return
    if (!window.confirm('Really reset? Last chance.')) return
    try {
      localStorage.removeItem('gene-detective-save-v4')
    } catch {
      // localStorage may be blocked in some browser modes; nothing to do.
    }
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500">
              The
            </div>
            <h1 className="text-4xl font-bold text-stone-800 font-serif">
              Blob Research Station
            </h1>
            <div className="text-sm text-stone-600 italic mt-1">
              {completedChapters.length} of {chapters.length} chapters completed
            </div>
          </div>
          {/* Reset progress — always visible so a player who hits a stuck save
              can wipe it without touching devtools. Two-step confirm inside. */}
          <button
            onClick={resetProgress}
            className="text-[11px] uppercase tracking-wide text-stone-400 hover:text-rose-600 border border-stone-300 hover:border-rose-300 rounded px-2 py-1 flex-shrink-0"
            title="Erase all local progress and start over"
          >
            Reset progress
          </button>
        </div>

        {/* Chalkboard (decorative) */}
        <div className="mb-6 rounded-lg bg-[color:var(--chalkboard)] shadow-inner border-4 border-stone-700 p-6 text-emerald-100 font-serif italic">
          <div className="text-xs uppercase tracking-widest opacity-70 mb-2">
            On the chalkboard
          </div>
          {nextChapter ? (
            <p className="text-lg leading-snug">
              Chapter {nextChapter.order}: {nextChapter.title}
              <br />
              <span className="text-sm opacity-80">— {nextChapter.concept}</span>
            </p>
          ) : (
            <p className="text-lg leading-snug">
              All chapters complete. Something's still off about the wild blobs…
            </p>
          )}
        </div>

        {/* Mentor desks strip — decorative, always shown, so the Station reads
            as a shared space rather than a menu screen. */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
            At their desks
          </div>
          <div className="flex flex-wrap gap-3">
            {availableMentors.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-lg border border-stone-300 bg-[color:var(--paper)] px-3 py-2 shadow-sm"
                title={m.bio}
              >
                <div className="text-2xl leading-none">{m.emoji}</div>
                <div>
                  <div className="text-sm font-semibold text-stone-800 leading-tight">
                    {m.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-stone-500 leading-tight">
                    {m.specialty[0]?.replace(/-/g, ' ')}
                  </div>
                </div>
                <div
                  className="w-2 h-2 rounded-full ml-1"
                  style={{ backgroundColor: m.desk.color }}
                />
              </div>
            ))}
            {/* Empty desks for mentors not yet joined — hints at future arrivals. */}
            {mentors
              .filter(m => !unlockedMentors.includes(m.id))
              .slice(0, 3)
              .map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 opacity-50"
                  title="An empty desk. A future mentor will occupy it."
                >
                  <div className="text-2xl leading-none grayscale">🪑</div>
                  <div>
                    <div className="text-sm font-semibold text-stone-500 leading-tight italic">
                      (vacant)
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-stone-400 leading-tight">
                      awaiting a new arrival
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StationCard
            icon="📖"
            title={nextChapter ? `Chapter ${nextChapter.order}` : 'Chapters'}
            subtitle={nextChapter ? nextChapter.title : 'All complete'}
            body={
              nextChapter
                ? 'Open the chapter book and continue your training.'
                : 'Every chapter is closed. The mystery deepens.'
            }
            accent="amber"
            onClick={() => {
              if (nextChapter) startChapter(nextChapter.id)
              else setActiveScreen({ kind: 'station' })
            }}
            enabled={!!nextChapter}
          />

          <StationCard
            icon="📋"
            title="Missions"
            subtitle="From the field"
            body="Clients bring you focused breeding puzzles. Practice what you've learned."
            accent="sky"
            onClick={() => setActiveScreen({ kind: 'missions-board' })}
          />

          <StationCard
            icon="🏆"
            title="Trophy Shelf"
            subtitle={`${trophyBlobs.length} of ${chapters.length}`}
            body="One representative blob from every chapter you've completed."
            accent="emerald"
            onClick={() => setActiveScreen({ kind: 'trophy-shelf' })}
          />

          <StationCard
            icon="⚙"
            title="Settings"
            subtitle="Preferences & save"
            body="Difficulty, save export/import, and starting over."
            accent="rose"
            onClick={() => setActiveScreen({ kind: 'settings' })}
          />

          {/* Field Assignments unlock only once the player has finished the
              main learning arc. Before that, showing an endless-puzzle mode
              alongside the chapter progression is more distracting than
              inviting. */}
          {completedChapters.includes('ch23') && (
            <StationCard
              icon="🎲"
              title="Field Assignments"
              subtitle="Endless puzzles"
              body="Rolls a random target phenotype and four starter blobs. Breed until it matches. No time limit, no scoring — just breeding."
              accent="violet"
              onClick={() => setActiveScreen({ kind: 'field-assignments' })}
            />
          )}
        </div>

        {/* Attribution — subtle, softly pulsing to imply flickering lamp */}
        <motion.div
          animate={{ opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8 text-xs text-stone-500 italic"
        >
          A quiet lamp burns on the desk. Somewhere, a specimen jar clinks.
        </motion.div>
      </div>
    </div>
  )
}

// A rounded interactive card that visually reads as a piece of office
// furniture. Accent controls the subtle color hint on the emoji tile.
function StationCard({
  icon,
  title,
  subtitle,
  body,
  accent,
  onClick,
  enabled = true,
}: {
  icon: string
  title: string
  subtitle: string
  body: string
  accent: 'amber' | 'sky' | 'emerald' | 'rose' | 'violet'
  onClick(): void
  enabled?: boolean
}) {
  const accentBg: Record<string, string> = {
    amber: 'bg-amber-100 border-amber-300',
    sky: 'bg-sky-100 border-sky-300',
    emerald: 'bg-emerald-100 border-emerald-300',
    rose: 'bg-rose-100 border-rose-300',
    violet: 'bg-violet-100 border-violet-300',
  }
  return (
    <motion.button
      whileHover={enabled ? { scale: 1.01, y: -2 } : undefined}
      whileTap={enabled ? { scale: 0.99 } : undefined}
      onClick={onClick}
      disabled={!enabled}
      className={
        'text-left rounded-xl border-2 border-stone-300 bg-[color:var(--paper)] p-5 shadow-md transition-all ' +
        (enabled
          ? 'hover:border-stone-400 hover:shadow-lg cursor-pointer'
          : 'opacity-60 cursor-not-allowed')
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={
            'w-14 h-14 rounded-lg border-2 flex items-center justify-center text-3xl flex-shrink-0 ' +
            accentBg[accent]
          }
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-stone-800 font-serif">{title}</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">
            {subtitle}
          </div>
          <div className="text-sm text-stone-700 leading-snug">{body}</div>
        </div>
      </div>
    </motion.button>
  )
}
