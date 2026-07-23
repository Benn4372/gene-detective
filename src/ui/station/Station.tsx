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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
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
            icon="🧑‍🔬"
            title="Mentors"
            subtitle={
              availableMentors.length +
              ' at the Station'
            }
            body={
              availableMentors[0]
                ? `${availableMentors[0].name}: "${availableMentors[0].voice.orderIntro.slice(0, 60)}…"`
                : 'The Station is empty for now.'
            }
            accent="rose"
            onClick={() => setActiveScreen({ kind: 'station' })}
            enabled={false}
          />
        </div>

        {/* Attribution — subtle */}
        <div className="mt-8 text-xs text-stone-500 italic">
          A quiet lamp burns on the desk. Somewhere, a specimen jar clinks.
        </div>
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
  accent: 'amber' | 'sky' | 'emerald' | 'rose'
  onClick(): void
  enabled?: boolean
}) {
  const accentBg: Record<string, string> = {
    amber: 'bg-amber-100 border-amber-300',
    sky: 'bg-sky-100 border-sky-300',
    emerald: 'bg-emerald-100 border-emerald-300',
    rose: 'bg-rose-100 border-rose-300',
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
