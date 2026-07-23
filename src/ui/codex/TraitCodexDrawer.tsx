import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../state/gameStore'
import { blobSpecies, chapters, glossaryTerms } from '../../content'
import { computeGenotypeTable, makePreviewCreature } from '../../engine/codex'
import { BlobRenderer } from '../../renderer/BlobRenderer'
import { phenotypeLabel } from '../../renderer/phenotypeLabels'
import { GeneticMap } from './GeneticMap'

type CodexTab = 'map' | 'traits' | 'concepts' | 'tools'

// A persistent right-side drawer plus its floating trigger button. Rendered
// once at the App level; always accessible via a small 📖 button top-right.
// Sections: Traits (genotype→phenotype tables), Concepts (glossary), Tools.
export function TraitCodexDrawer() {
  const open = useGameStore(s => s.codexOpen)
  const toggle = useGameStore(s => s.toggleCodex)
  return (
    <>
      {/* Trigger button */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-40 w-11 h-11 rounded-full bg-amber-500 text-white text-lg shadow-lg hover:bg-amber-600 flex items-center justify-center"
        title="Trait Codex"
        aria-label="Trait Codex"
      >
        📖
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/40 z-40"
              onClick={toggle}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-[color:var(--paper)] shadow-2xl border-l border-stone-300 flex flex-col"
            >
              <DrawerContent onClose={toggle} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function DrawerContent({ onClose }: { onClose(): void }) {
  const unlockedTraits = useGameStore(s => s.unlockedTraits)
  const completedChapters = useGameStore(s => s.completedChapters)
  const currentChapterId = useGameStore(s => s.currentChapterId)
  const unlockedTools = useGameStore(s => s.unlockedTools)
  const [tab, setTab] = useState<CodexTab>('map')
  const [focusGeneId, setFocusGeneId] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState('')

  return (
    <>
      <header className="flex items-center justify-between px-5 py-4 border-b border-stone-300 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <h2 className="text-lg font-bold text-stone-800 font-serif">Trait Codex</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 flex items-center justify-center"
          aria-label="Close Codex"
        >
          ✕
        </button>
      </header>

      <div className="px-5 pt-3 flex-shrink-0">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Codex…"
          className="w-full px-3 py-2 border border-stone-300 rounded text-sm bg-white"
        />
      </div>

      <nav className="px-5 pt-3 flex gap-2 border-b border-stone-200 flex-shrink-0">
        <TabButton current={tab} value="map" onClick={setTab}>
          Map
        </TabButton>
        <TabButton current={tab} value="traits" onClick={setTab}>
          Traits
        </TabButton>
        <TabButton current={tab} value="concepts" onClick={setTab}>
          Concepts
        </TabButton>
        <TabButton current={tab} value="tools" onClick={setTab}>
          Tools
        </TabButton>
      </nav>

      <div className="p-5 overflow-y-auto flex-1">
        {tab === 'map' && (
          <GeneticMap
            unlockedTraits={unlockedTraits}
            focusGeneId={focusGeneId}
            onGeneClick={id => {
              setFocusGeneId(id)
              setTab('traits')
            }}
          />
        )}
        {tab === 'traits' && (
          <TraitsTab
            unlockedTraits={unlockedTraits}
            query={query}
            focusGeneId={focusGeneId}
          />
        )}
        {tab === 'concepts' && (
          <ConceptsTab
            completedChapters={completedChapters}
            currentChapterId={currentChapterId}
            query={query}
          />
        )}
        {tab === 'tools' && (
          <ToolsTab unlockedTools={unlockedTools} query={query} />
        )}
      </div>
    </>
  )
}

function TabButton({
  current,
  value,
  onClick,
  children,
}: {
  current: CodexTab
  value: CodexTab
  onClick(v: CodexTab): void
  children: React.ReactNode
}) {
  const active = current === value
  return (
    <button
      onClick={() => onClick(value)}
      className={
        'px-3 py-2 text-sm font-medium border-b-2 -mb-px ' +
        (active
          ? 'border-amber-500 text-amber-700'
          : 'border-transparent text-stone-500 hover:text-stone-800')
      }
    >
      {children}
    </button>
  )
}

// -- Traits tab ------------------------------------------------------------

function TraitsTab({
  unlockedTraits,
  query,
  focusGeneId,
}: {
  unlockedTraits: string[]
  query: string
  focusGeneId?: string
}) {
  const genes = useMemo(
    () =>
      blobSpecies.genes.filter(g =>
        g.expressesTraits.some(t => unlockedTraits.includes(t)),
      ),
    [unlockedTraits],
  )
  const filtered = query
    ? genes.filter(g =>
        g.name.toLowerCase().includes(query.toLowerCase()),
      )
    : focusGeneId
      ? genes.filter(g => g.id === focusGeneId)
      : genes

  if (unlockedTraits.length === 0) {
    return <EmptyState>Complete a chapter to unlock your first trait.</EmptyState>
  }
  if (filtered.length === 0) {
    return <EmptyState>No traits match "{query}".</EmptyState>
  }
  return (
    <div className="space-y-6">
      {filtered.map(gene => {
        const rows = computeGenotypeTable(gene, blobSpecies)
        const chromosome = blobSpecies.chromosomes.find(c => c.id === gene.chromosome)
        const primaryTrait = gene.expressesTraits[0]
          ? blobSpecies.traits.find(t => t.id === gene.expressesTraits[0])
          : null
        return (
          <section key={gene.id}>
            <h3 className="text-base font-semibold text-stone-800 mb-1 font-serif">
              {gene.name}
            </h3>
            {primaryTrait?.description && (
              <div className="text-xs text-stone-700 italic mb-2 leading-snug">
                {primaryTrait.description}
              </div>
            )}
            <div className="text-xs text-stone-500 mb-3 space-y-0.5">
              <div>
                <span className="text-stone-600 uppercase tracking-wide text-[10px]">Model</span>{' '}
                <span className="font-mono">{gene.inheritanceModel.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              </div>
              <div>
                <span className="text-stone-600 uppercase tracking-wide text-[10px]">Locus</span>{' '}
                <span className="font-mono">{gene.chromosome} @ {gene.locusCM} cM</span>
                {chromosome && (
                  <span className="italic text-stone-500 ml-1">({chromosome.type})</span>
                )}
              </div>
              <div>
                <span className="text-stone-600 uppercase tracking-wide text-[10px]">Alleles</span>{' '}
                <span className="font-mono">
                  {[...gene.alleles].sort((a, b) => b.dominanceRank - a.dominanceRank).map(a => a.symbol).join(' > ')}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {rows.map(row => {
                const preview = makePreviewCreature(gene, row.alleles, blobSpecies)
                const traitId = gene.expressesTraits[0]
                return (
                  <div
                    key={row.genotype}
                    className="rounded-lg border border-stone-300 bg-white p-2 flex flex-col items-center"
                  >
                    <BlobRenderer
                      creature={preview}
                      species={blobSpecies}
                      size={54}
                    />
                    <div className="font-mono text-sm text-stone-800 mt-1">
                      {row.genotype}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      → {traitId ? phenotypeLabel(traitId, row.phenotype) : row.phenotype}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

// -- Concepts tab ----------------------------------------------------------

function ConceptsTab({
  completedChapters,
  currentChapterId,
  query,
}: {
  completedChapters: string[]
  currentChapterId: string | null
  query: string
}) {
  const unlockedTermIds = useMemo(() => {
    const s = new Set<string>()
    for (const ch of chapters) {
      if (currentChapterId === ch.id || completedChapters.includes(ch.id)) {
        for (const term of ch.pinnedGlossaryTerms) s.add(term)
      }
    }
    return s
  }, [completedChapters, currentChapterId])

  // First-teach-map: term id → { order, title } of the earliest chapter
  // whose pinnedGlossaryTerms mentions it.
  const firstTaught = useMemo(() => {
    const map: Record<string, { order: number; title: string }> = {}
    const ordered = [...chapters].sort((a, b) => a.order - b.order)
    for (const ch of ordered) {
      for (const term of ch.pinnedGlossaryTerms) {
        if (!map[term]) map[term] = { order: ch.order, title: ch.title }
      }
    }
    return map
  }, [])

  const visible = glossaryTerms.filter(t => unlockedTermIds.has(t.id))
  const filtered = query
    ? visible.filter(t =>
        (t.name + ' ' + t.overview)
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : visible

  if (visible.length === 0) {
    return <EmptyState>Complete a chapter to unlock concept references.</EmptyState>
  }
  if (filtered.length === 0) {
    return <EmptyState>No concepts match "{query}".</EmptyState>
  }
  return (
    <div className="space-y-4">
      {filtered.map(t => {
        const origin = firstTaught[t.id]
        return (
          <details
            key={t.id}
            className="border border-stone-300 rounded-lg bg-white p-3"
          >
            <summary className="cursor-pointer font-semibold text-stone-800 font-serif flex items-center justify-between">
              <span>{t.name}</span>
              {origin && (
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans font-normal">
                  Ch {origin.order}
                </span>
              )}
            </summary>
            <div className="mt-2 text-sm text-stone-700 whitespace-pre-line">
              {t.overview}
            </div>
            {origin && (
              <div className="text-[10px] italic text-stone-500 mt-2">
                First introduced in Ch {origin.order} · {origin.title}
              </div>
            )}
          </details>
        )
      })}
    </div>
  )
}

// -- Tools tab -------------------------------------------------------------

const TOOL_DEFS: Record<string, { name: string; body: string }> = {
  'punnett-2x2': {
    name: 'Punnett square (2×2)',
    body: 'A 2×2 grid used to work out every possible offspring from a monohybrid cross. Each parent contributes one allele per gamete; the 4 cells cover every combination.',
  },
  'punnett-4x4': {
    name: 'Punnett square (4×4)',
    body: 'A 4×4 grid used for dihybrid crosses (two genes tracked at once). 16 cells cover every gamete combination; grouped by phenotype they show the classic 9:3:3:1 ratio.',
  },
  'test-cross': {
    name: 'Test cross',
    body: 'Deliberately breeding a mystery blob against a known homozygous recessive (aa). If any offspring show the recessive phenotype, the mystery blob must be heterozygous.',
  },
  'chi-square': {
    name: 'Chi-square test',
    body: 'A statistical test that decides whether observed offspring ratios differ significantly from expected. Used at higher tiers to formally accept or reject a genotype hypothesis.',
  },
}

function ToolsTab({
  unlockedTools,
  query,
}: {
  unlockedTools: string[]
  query: string
}) {
  const tools = unlockedTools
    .map(id => ({ id, def: TOOL_DEFS[id] }))
    .filter((t): t is { id: string; def: (typeof TOOL_DEFS)[string] } => !!t.def)
  const filtered = query
    ? tools.filter(t =>
        (t.def.name + ' ' + t.def.body)
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : tools
  if (tools.length === 0) {
    return <EmptyState>Complete a chapter to unlock breeding tools.</EmptyState>
  }
  if (filtered.length === 0) {
    return <EmptyState>No tools match "{query}".</EmptyState>
  }
  return (
    <div className="space-y-3">
      {filtered.map(({ id, def }) => (
        <div
          key={id}
          className="border border-stone-300 rounded-lg bg-white p-3"
        >
          <div className="font-semibold text-stone-800 font-serif">
            {def.name}
          </div>
          <div className="text-sm text-stone-700 mt-1">{def.body}</div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-stone-500 italic text-center py-8">{children}</div>
  )
}
