import type { ReactNode } from 'react'
import { useGameStore } from '../../state/gameStore'

export type ScreenKey = 'lessons' | 'stable' | 'breeding' | 'orders' | 'codex'

interface Props {
  current: ScreenKey
  onNavigate(next: ScreenKey): void
  children: ReactNode
}

const TABS: { key: ScreenKey; label: string; icon: string }[] = [
  { key: 'lessons', label: 'Lessons', icon: '🎓' },
  { key: 'stable', label: 'Stable', icon: '🏡' },
  { key: 'breeding', label: 'Breeding', icon: '❤️' },
  { key: 'orders', label: 'Orders', icon: '📋' },
  { key: 'codex', label: 'Codex', icon: '📖' },
]

export function Layout({ current, onNavigate, children }: Props) {
  const coins = useGameStore(s => s.coins)
  const stableSize = useGameStore(s => Object.keys(s.creatures).length)
  const stableCap = useGameStore(s => s.stableCap)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧬</span>
          <h1 className="text-xl font-bold text-slate-800">Gene Detective</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>🏡 {stableSize}/{stableCap}</span>
          <span>🪙 {coins}</span>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="w-48 bg-white border-r border-slate-200 py-4">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={
                'w-full text-left px-6 py-3 text-sm font-medium transition-colors ' +
                (current === t.key
                  ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                  : 'text-slate-600 hover:bg-slate-50')
              }
            >
              <span className="mr-2">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
