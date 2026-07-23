import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import type { DifficultyTier } from '../../state/types'

// Settings — small utility screen. Reachable from a Station card. Provides:
// - difficulty tier toggle (curious / student / researcher — hint gating)
// - save export/import (JSON round-trip via localStorage)
// - "restart the game" reset
export function SettingsScreen() {
  const setActiveScreen = useGameStore(s => s.setActiveScreen)
  const difficultyTier = useGameStore(s => s.difficultyTier)
  const setDifficultyTier = useGameStore(s => s.setDifficultyTier)
  const reset = useGameStore(s => s.reset)

  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const exportSave = () => {
    // Persisted zustand state lives at localStorage['gene-detective-save-v4'].
    const raw = localStorage.getItem('gene-detective-save-v4')
    if (!raw) return
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gene-detective-save-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importSave = () => {
    setImportError(null)
    setImportSuccess(false)
    try {
      const parsed = JSON.parse(importText)
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Save file must be an object.')
      }
      // Minimal shape check: zustand persist wraps state under { state, version }.
      if (!('state' in parsed) || !('version' in parsed)) {
        throw new Error(
          'This does not look like a Gene Detective save file — missing state/version.',
        )
      }
      localStorage.setItem('gene-detective-save-v4', importText)
      setImportSuccess(true)
      // Force a full reload so zustand re-hydrates from the imported blob.
      setTimeout(() => window.location.reload(), 400)
    } catch (e) {
      setImportError((e as Error).message)
    }
  }

  const restart = () => {
    reset()
    setActiveScreen({ kind: 'station' })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setActiveScreen({ kind: 'station' })}
          className="text-sm text-stone-500 hover:text-stone-800 mb-3"
        >
          ← Return to Station
        </button>
        <h1 className="text-3xl font-bold text-stone-800 font-serif mb-6">
          Settings
        </h1>

        {/* Difficulty tier */}
        <Section
          title="Difficulty"
          subtitle="Controls how much scaffolding the game surfaces."
        >
          <div className="flex flex-wrap gap-2">
            {(['curious', 'student', 'researcher'] as DifficultyTier[]).map(
              tier => (
                <button
                  key={tier}
                  onClick={() => setDifficultyTier(tier)}
                  className={
                    'px-4 py-2 rounded-lg border-2 text-sm capitalize transition-colors ' +
                    (difficultyTier === tier
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400')
                  }
                >
                  {tier}
                </button>
              ),
            )}
          </div>
          <p className="text-xs text-stone-500 mt-2 italic">
            {difficultyTier === 'curious' &&
              'Casual pace. Lots of hints; forgiving validation.'}
            {difficultyTier === 'student' &&
              'Balanced. Some hints; medium-tier validation.'}
            {difficultyTier === 'researcher' &&
              'No hand-holding. Strict validation (chi-square, larger samples).'}
          </p>
        </Section>

        {/* Export / import save */}
        <Section
          title="Save data"
          subtitle="Your save lives in this browser only. Export it as a backup or move it to another browser."
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={exportSave}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 shadow-sm"
            >
              ⬇ Export save (JSON)
            </motion.button>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-stone-500 mb-1 block">
              Import save
            </label>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste an exported save file here…"
              className="w-full h-24 p-2 border-2 border-stone-300 rounded font-mono text-xs bg-white"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={importSave}
                disabled={!importText.trim()}
                className={
                  'px-3 py-1.5 rounded text-sm font-medium ' +
                  (importText.trim()
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed')
                }
              >
                Load save
              </button>
              {importError && (
                <div className="text-xs text-rose-700">✗ {importError}</div>
              )}
              {importSuccess && (
                <div className="text-xs text-emerald-700">
                  ✓ Save loaded. Reloading…
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Restart */}
        <Section
          title="Restart the game"
          subtitle="Wipes your progress and starts a fresh save. This cannot be undone."
        >
          {confirmingReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={restart}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 shadow-sm"
              >
                Yes — wipe everything and restart
              </button>
              <button
                onClick={() => setConfirmingReset(false)}
                className="px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-800"
              >
                cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingReset(true)}
              className="px-4 py-2 rounded-lg border-2 border-rose-300 text-rose-700 text-sm font-medium hover:bg-rose-50"
            >
              ⚠ Restart the game…
            </button>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-[color:var(--paper)] border border-stone-300 p-5 mb-4 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800 font-serif">
        {title}
      </h2>
      <p className="text-xs text-stone-600 italic mt-0.5 mb-3">{subtitle}</p>
      {children}
    </div>
  )
}
