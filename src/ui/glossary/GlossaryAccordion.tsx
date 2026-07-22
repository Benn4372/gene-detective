import { useState } from 'react'
import { glossaryById } from '../../content'

interface Props {
  termIds: string[]
  title?: string
}

// Sidebar accordion listing the glossary terms pinned by the current lesson.
// Each term shows the overview by default; "Read full article" expands the deeper text.
export function GlossaryAccordion({ termIds, title = 'Concept glossary' }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [showFull, setShowFull] = useState<Record<string, boolean>>({})

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {termIds.map(id => {
          const term = glossaryById[id]
          if (!term) return null
          const isOpen = openId === id
          const full = showFull[id]
          return (
            <div key={id} className="border-b border-slate-100 last:border-0">
              <button
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-purple-700 flex items-center justify-between"
              >
                <span>{term.name}</span>
                <span className="text-slate-400 text-xs">{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className="pb-3 text-sm text-slate-600 leading-relaxed">
                  <ParagraphedText text={term.overview} />
                  {full ? (
                    <>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                          Full article
                        </div>
                        <ParagraphedText text={term.fullArticle} />
                      </div>
                      <button
                        onClick={() => setShowFull(s => ({ ...s, [id]: false }))}
                        className="mt-2 text-xs text-purple-600 hover:underline"
                      >
                        Show less
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowFull(s => ({ ...s, [id]: true }))}
                      className="mt-2 text-xs text-purple-600 hover:underline"
                    >
                      Read full article
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Extracted so we can render markdown-lite text with paragraph breaks.
// A real MDX pipeline can replace this later.
export function ParagraphedText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n\n').map((paragraph, i) => (
        <p key={i} className={i === 0 ? '' : 'mt-2'} dangerouslySetInnerHTML={{ __html: renderInline(paragraph) }} />
      ))}
    </>
  )
}

// Very small inline renderer: *italic* and **bold**. Enough for our overviews.
function renderInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Restore any <sup> we intentionally used in glossary content.
    .replace(/&lt;sup&gt;/g, '<sup>')
    .replace(/&lt;\/sup&gt;/g, '</sup>')
}
