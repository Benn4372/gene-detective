import { useMemo, useState } from 'react'

// A collection of small researcher-tier mini-widgets. Each is a focused,
// self-contained illustration of one chapter's concept: no shared state, no
// deep engine hooks. They're teaching aides — interactive text/graph.

// -- Ch 36 — Heritability calculator --------------------------------------

export function HeritabilityWidget() {
  const [parentMean, setParentMean] = useState(70)
  const [offspringMean, setOffspringMean] = useState(65)
  const [popMean, setPopMean] = useState(60)
  const selectionDiff = parentMean - popMean
  const response = offspringMean - popMean
  const h2 =
    selectionDiff === 0 ? 0 : Math.max(0, Math.min(1, response / selectionDiff))
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-stone-500">
        Breeder's equation
      </div>
      <NumberField label="Population mean (before selection)" value={popMean} onChange={setPopMean} />
      <NumberField label="Selected-parents mean" value={parentMean} onChange={setParentMean} />
      <NumberField label="Offspring mean (after selection)" value={offspringMean} onChange={setOffspringMean} />
      <div className="pt-2 border-t border-stone-200 text-sm">
        <div className="font-mono">S = P − P̄ = <strong>{selectionDiff}</strong></div>
        <div className="font-mono">R = O − P̄ = <strong>{response}</strong></div>
        <div className="font-mono">
          h² = R / S = <strong>{h2.toFixed(3)}</strong>
        </div>
        <div className="text-xs text-stone-500 italic mt-1">
          h² ranges 0-1. Higher = more genetic. Selection response scales
          linearly with h².
        </div>
      </div>
    </div>
  )
}

// -- Ch 37 — QTL scan ------------------------------------------------------

export function QTLScanWidget() {
  // Static LOD scores for demo across three chromosomes.
  const bars = useMemo(() => {
    const rng = pseudoRand(42)
    const out: { chrom: string; pos: number; lod: number }[] = []
    for (const chrom of ['auto-1', 'auto-2', 'auto-3']) {
      for (let pos = 5; pos < 100; pos += 5) {
        // Peaks around auto-2 pos 60 and auto-3 pos 20.
        const peak =
          (chrom === 'auto-2' && Math.abs(pos - 60) < 15
            ? 5 - Math.abs(pos - 60) / 3
            : 0) +
          (chrom === 'auto-3' && Math.abs(pos - 20) < 12
            ? 4 - Math.abs(pos - 20) / 4
            : 0)
        out.push({ chrom, pos, lod: Math.max(0, peak + rng() * 0.6) })
      }
    }
    return out
  }, [])
  const maxLod = Math.max(...bars.map(b => b.lod))
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        QTL scan — LOD scores across the genome
      </div>
      <svg viewBox="0 0 600 220" className="w-full">
        <line x1="10" y1="180" x2="590" y2="180" stroke="#94a3b8" />
        {['auto-1', 'auto-2', 'auto-3'].map((chrom, ci) => {
          const chromBars = bars.filter(b => b.chrom === chrom)
          const chromStart = 10 + ci * 200
          return (
            <g key={chrom}>
              {chromBars.map((b, i) => {
                const x = chromStart + i * (180 / chromBars.length)
                const h = (b.lod / maxLod) * 150
                return (
                  <rect
                    key={i}
                    x={x}
                    y={180 - h}
                    width={4}
                    height={h}
                    fill={b.lod > 3 ? '#dc2626' : '#0284c7'}
                  />
                )
              })}
              <text
                x={chromStart + 90}
                y={200}
                textAnchor="middle"
                fontSize="10"
                fill="#475569"
              >
                {chrom}
              </text>
            </g>
          )
        })}
        <line x1="10" y1={180 - (3 / maxLod) * 150} x2="590" y2={180 - (3 / maxLod) * 150} stroke="#dc2626" strokeDasharray="4 2" />
        <text x="580" y={175 - (3 / maxLod) * 150} textAnchor="end" fontSize="9" fill="#dc2626">
          LOD = 3 threshold
        </text>
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Two clear QTL peaks — one on auto-2 near locus 60, one on auto-3 near
        locus 20. Bars above the red line clear the significance threshold.
      </div>
    </div>
  )
}

// -- Ch 38 — Norm of reaction -----------------------------------------------

export function ReactionNormWidget() {
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Norm of reaction — same genotypes, different environments
      </div>
      <svg viewBox="0 0 500 260" className="w-full">
        <line x1="40" y1="220" x2="480" y2="220" stroke="#94a3b8" />
        <line x1="40" y1="220" x2="40" y2="20" stroke="#94a3b8" />
        <text x="260" y="250" textAnchor="middle" fontSize="12" fill="#475569">
          Temperature →
        </text>
        <text x="30" y="120" textAnchor="middle" fontSize="12" fill="#475569" transform="rotate(-90 30 120)">
          Phenotype
        </text>
        {/* Genotype A — high in cold, low in hot */}
        <polyline
          points="40,60 160,90 280,130 400,180 480,205"
          stroke="#0284c7"
          strokeWidth="2"
          fill="none"
        />
        {/* Genotype B — low in cold, high in hot */}
        <polyline
          points="40,200 160,180 280,140 400,90 480,55"
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
        />
        <text x="470" y="205" textAnchor="end" fontSize="10" fill="#0284c7">
          Genotype A
        </text>
        <text x="470" y="55" textAnchor="end" fontSize="10" fill="#dc2626">
          Genotype B
        </text>
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Curves cross — neither genotype is universally best. Classic G × E
        interaction: environment dictates which allele wins.
      </div>
    </div>
  )
}

// -- Ch 39 — Three-point cross ---------------------------------------------

export function ThreePointCrossWidget() {
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Three-point cross — deducing gene order
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold mb-1">Observed offspring:</div>
          <ul className="space-y-1 font-mono text-xs">
            <li>ABC: 415 (parental)</li>
            <li>abc: 411 (parental)</li>
            <li>AbC:   38 (single, B/C)</li>
            <li>aBc:   34 (single, B/C)</li>
            <li>Abc:   16 (single, A/B)</li>
            <li>aBC:   14 (single, A/B)</li>
            <li>ABc:    2 (double)</li>
            <li>abC:    2 (double)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Deduction:</div>
          <div className="text-xs text-stone-700 leading-relaxed">
            Double-crossover class carries the MIDDLE marker in a different
            configuration from the parentals. Doubles are ABc / abC —
            <strong> C is in the middle</strong>.
            <br />
            <br />
            Distance A-C: (16 + 14 + 2 + 2) / 932 = <strong>3.6 cM</strong>
            <br />
            Distance B-C: (38 + 34 + 2 + 2) / 932 = <strong>8.2 cM</strong>
            <br />
            Order: A -- 3.6 -- C -- 8.2 -- B
          </div>
        </div>
      </div>
    </div>
  )
}

// -- Ch 40 — Threshold trait -----------------------------------------------

export function ThresholdTraitWidget() {
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Threshold trait — hidden polygenic load, visible discrete outcome
      </div>
      <svg viewBox="0 0 500 220" className="w-full">
        <BellCurve x0={50} y0={200} width={400} height={160} peakAt={0.5} />
        <line
          x1={50 + 400 * 0.75}
          y1={40}
          x2={50 + 400 * 0.75}
          y2={200}
          stroke="#dc2626"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <text x={50 + 400 * 0.75 + 4} y={50} fontSize="10" fill="#dc2626">
          Threshold
        </text>
        <text x={50 + 400 * 0.9} y={140} fontSize="9" fill="#dc2626" textAnchor="middle">
          affected
        </text>
        <text x={50 + 400 * 0.55} y={140} fontSize="9" fill="#0284c7" textAnchor="middle">
          unaffected
        </text>
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Underlying trait is continuous. Threshold divides the population into a
        discrete affected / unaffected phenotype — the tail above the line.
      </div>
    </div>
  )
}

function BellCurve({
  x0, y0, width, height, peakAt,
}: {
  x0: number
  y0: number
  width: number
  height: number
  peakAt: number
}) {
  const steps = 40
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x0 + t * width
    const dev = (t - peakAt) * 4
    const y = y0 - Math.exp(-dev * dev) * height
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return <polyline points={pts.join(' ')} stroke="#0284c7" strokeWidth="2" fill="none" />
}

// -- Ch 48 — CRISPR editor -------------------------------------------------

export function CRISPREditorWidget() {
  const [target, setTarget] = useState('A')
  const [replacement, setReplacement] = useState('a')
  const [outcome, setOutcome] = useState<null | 'success' | 'offtarget' | 'nhej'>(null)
  const run = () => {
    const r = Math.random()
    if (r < 0.7) setOutcome('success')
    else if (r < 0.9) setOutcome('nhej')
    else setOutcome('offtarget')
  }
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-stone-500">
        CRISPR-Cas9 edit
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>Guide RNA targets allele</span>
        <input value={target} onChange={e => setTarget(e.target.value.slice(0, 2))} className="w-14 text-center border-2 border-stone-300 rounded font-mono px-2 py-1" />
        <span>→ replace with</span>
        <input value={replacement} onChange={e => setReplacement(e.target.value.slice(0, 2))} className="w-14 text-center border-2 border-stone-300 rounded font-mono px-2 py-1" />
        <button onClick={run} className="ml-2 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs">
          Fire CRISPR
        </button>
      </div>
      {outcome === 'success' && (
        <div className="text-sm text-emerald-700">
          ✓ Homology-directed repair. Clean {target} → {replacement} edit at the target locus.
        </div>
      )}
      {outcome === 'nhej' && (
        <div className="text-sm text-amber-700">
          ⚠ Non-homologous end joining. Random insertion/deletion. Target
          allele broken, but not to your specification.
        </div>
      )}
      {outcome === 'offtarget' && (
        <div className="text-sm text-rose-700">
          ✗ Off-target cut on chromosome auto-3. Collateral damage.
        </div>
      )}
      <div className="text-[10px] text-stone-500 italic">
        Every real CRISPR run has these three probabilities. Higher fidelity
        Cas9 variants shrink the off-target risk but never eliminate it.
      </div>
    </div>
  )
}

// -- Ch 49 — Cancer somatic ------------------------------------------------

export function CancerSomaticWidget() {
  const [year, setYear] = useState(0)
  const mutations = Math.floor(year * 3.5 + Math.log(year + 1) * 8)
  const tumor = mutations > 15
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-stone-500">
        Somatic mutation clock
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-stone-700">Age (years):</label>
        <input type="range" min={0} max={80} value={year} onChange={e => setYear(Number(e.target.value))} className="flex-1 accent-rose-500" />
        <span className="font-mono text-sm w-10 text-right">{year}</span>
      </div>
      <div className="text-sm font-mono">
        Accumulated somatic mutations: <strong>{mutations}</strong>
      </div>
      <div
        className={
          'p-2 rounded text-sm ' +
          (tumor
            ? 'bg-rose-50 border border-rose-300 text-rose-800'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-800')
        }
      >
        {tumor
          ? '⚠ Enough oncogene + tumour-suppressor hits accumulated. Cancer risk rises steeply.'
          : '✓ Below the multi-hit threshold. Cellular controls still intact.'}
      </div>
      <div className="text-[10px] text-stone-500 italic">
        Cancer is a stepwise accumulation of somatic mutations in cellular
        control pathways. Age is the single strongest risk factor.
      </div>
    </div>
  )
}

// -- Ch 50 — Conservation rescue ------------------------------------------

export function ConservationWidget() {
  const [inbreeding, setInbreeding] = useState(0.4)
  const [outcrossers, setOutcrossers] = useState(0)
  const effective = Math.max(0, inbreeding - outcrossers * 0.05)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-stone-500">
        Rescue plan
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-stone-700 w-40">Base inbreeding coeff (F):</label>
        <input type="range" min={0} max={0.6} step={0.02} value={inbreeding} onChange={e => setInbreeding(Number(e.target.value))} className="flex-1 accent-amber-500" />
        <span className="font-mono text-sm w-14 text-right">{inbreeding.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-stone-700 w-40">Outcrossed founders added:</label>
        <input type="range" min={0} max={8} value={outcrossers} onChange={e => setOutcrossers(Number(e.target.value))} className="flex-1 accent-emerald-500" />
        <span className="font-mono text-sm w-14 text-right">{outcrossers}</span>
      </div>
      <div className={
        'p-2 rounded text-sm ' + (effective < 0.15 ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800')
      }>
        Effective F: <strong>{effective.toFixed(2)}</strong> —{' '}
        {effective < 0.15 ? 'population viable' : 'population still at risk'}
      </div>
    </div>
  )
}

// -- Ch 51 — GWAS Manhattan plot ------------------------------------------

export function GWASManhattanWidget() {
  const rng = useMemo(() => pseudoRand(7), [])
  const points = useMemo(() => {
    const out: { chrom: number; x: number; p: number }[] = []
    for (let c = 1; c <= 4; c++) {
      for (let i = 0; i < 60; i++) {
        // Peak at chrom 2 index 30 and chrom 4 index 45.
        const peak =
          (c === 2 && Math.abs(i - 30) < 5 ? 10 - Math.abs(i - 30) * 1.5 : 0) +
          (c === 4 && Math.abs(i - 45) < 5 ? 8 - Math.abs(i - 45) * 1.4 : 0)
        const noise = rng() * 3
        out.push({ chrom: c, x: i, p: Math.max(0.5, noise + peak) })
      }
    }
    return out
  }, [rng])
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        GWAS Manhattan plot — −log₁₀(p-value) per SNP
      </div>
      <svg viewBox="0 0 600 220" className="w-full">
        <line x1="10" y1="200" x2="590" y2="200" stroke="#94a3b8" />
        <line x1="10" y1={200 - (7.3 * 15)} x2="590" y2={200 - (7.3 * 15)} stroke="#dc2626" strokeWidth="1" strokeDasharray="4 2" />
        <text x={590} y={200 - (7.3 * 15) - 4} textAnchor="end" fontSize="9" fill="#dc2626">
          genome-wide significance
        </text>
        {points.map((p, i) => {
          const x = 20 + (p.chrom - 1) * 145 + (p.x / 60) * 130
          const y = 200 - p.p * 15
          const color = p.chrom % 2 === 0 ? '#334155' : '#64748b'
          return <circle key={i} cx={x} cy={y} r={2.4} fill={p.p > 7.3 ? '#dc2626' : color} />
        })}
        {[1, 2, 3, 4].map(c => (
          <text key={c} x={20 + (c - 1) * 145 + 65} y={215} textAnchor="middle" fontSize="10" fill="#475569">
            chr {c}
          </text>
        ))}
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Two clear hits above the significance line — chromosomes 2 and 4. Real
        GWAS studies find dozens of loci, most with tiny effect sizes.
      </div>
    </div>
  )
}

// -- Ch 52 — Phylogenetics tree -------------------------------------------

export function PhylogeneticsTreeWidget() {
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Reconstructed phylogeny (branch lengths ∝ substitutions)
      </div>
      <svg viewBox="0 0 500 260" className="w-full">
        {/* Root at top-center */}
        <line x1="250" y1="20" x2="250" y2="60" stroke="#334155" strokeWidth="2" />
        <line x1="120" y1="60" x2="380" y2="60" stroke="#334155" strokeWidth="2" />
        {/* Left branch */}
        <line x1="120" y1="60" x2="120" y2="140" stroke="#334155" strokeWidth="2" />
        <line x1="70" y1="140" x2="170" y2="140" stroke="#334155" strokeWidth="2" />
        <line x1="70" y1="140" x2="70" y2="220" stroke="#334155" strokeWidth="2" />
        <line x1="170" y1="140" x2="170" y2="200" stroke="#334155" strokeWidth="2" />
        {/* Right branch */}
        <line x1="380" y1="60" x2="380" y2="120" stroke="#334155" strokeWidth="2" />
        <line x1="320" y1="120" x2="440" y2="120" stroke="#334155" strokeWidth="2" />
        <line x1="320" y1="120" x2="320" y2="220" stroke="#334155" strokeWidth="2" />
        <line x1="440" y1="120" x2="440" y2="180" stroke="#334155" strokeWidth="2" />
        {/* Leaves */}
        <text x="70" y="235" textAnchor="middle" fontSize="10" fill="#475569">Pop α</text>
        <text x="170" y="215" textAnchor="middle" fontSize="10" fill="#475569">Pop β</text>
        <text x="320" y="235" textAnchor="middle" fontSize="10" fill="#475569">Pop γ</text>
        <text x="440" y="195" textAnchor="middle" fontSize="10" fill="#475569">Pop δ</text>
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Longer branches = more accumulated substitutions since divergence. Pop
        α and β share a more recent ancestor with each other than with γ or δ.
      </div>
    </div>
  )
}

// -- Ch 53 — HGT plasmid ---------------------------------------------------

export function HGTPlasmidWidget() {
  const [transferred, setTransferred] = useState(false)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Horizontal gene transfer — plasmid conjugation
      </div>
      <svg viewBox="0 0 500 200" className="w-full">
        <circle cx="120" cy="100" r="50" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
        <circle cx="380" cy="100" r="50" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
        <text x="120" y="105" textAnchor="middle" fontSize="12" fill="#334155">
          Donor
        </text>
        <text x="380" y="105" textAnchor="middle" fontSize="12" fill="#334155">
          Recipient
        </text>
        <circle cx={transferred ? 380 : 120} cy={60} r={10} fill="#f97316" />
        <text x={transferred ? 380 : 120} y={65} textAnchor="middle" fontSize="10" fill="white">
          amp
        </text>
        {!transferred && (
          <path d="M 170 90 Q 250 60 330 90" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" fill="none" />
        )}
      </svg>
      <button
        onClick={() => setTransferred(!transferred)}
        className="mt-2 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs"
      >
        {transferred ? 'Reset plasmid' : 'Trigger conjugation'}
      </button>
      <div className="text-[10px] text-stone-500 italic mt-2">
        The plasmid (bearing an antibiotic-resistance gene, "amp") transfers
        directly between unrelated bacteria. Both descendants are now
        resistant.
      </div>
    </div>
  )
}

// -- Ch 54 — Prion conformation --------------------------------------------

export function PrionConformationWidget() {
  const [misfolded, setMisfolded] = useState(false)
  const cells = 20
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Prion propagation — protein-only inheritance
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: cells }).map((_, i) => (
          <div
            key={i}
            className="h-6 rounded"
            style={{
              backgroundColor: misfolded && i >= 2 ? '#f97316' : '#7dd3fc',
            }}
            title={misfolded && i >= 2 ? 'PrPSc (misfolded)' : 'PrPC (normal)'}
          />
        ))}
      </div>
      <button
        onClick={() => setMisfolded(!misfolded)}
        className="mt-3 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs"
      >
        {misfolded ? 'Reset' : 'Introduce one PrPSc'}
      </button>
      <div className="text-[10px] text-stone-500 italic mt-2">
        A single seed of misfolded protein templates every subsequent copy
        into the same shape. No DNA change — the information is in the fold.
      </div>
    </div>
  )
}

// -- Ch 43 — Transgenerational epigenetic inheritance ---------------------

export function TransgenerationalWidget() {
  const [stress, setStress] = useState(false)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-3">
        Three generations · stressed grandparent → methylated grandchild
      </div>
      <div className="flex items-center justify-center gap-6">
        <Node label="F0 (grandpa)" affected={stress} note={stress ? 'stressed' : 'unstressed'} />
        <div className="text-xl">→</div>
        <Node label="F1 (dad)" affected={stress} note="carrier" />
        <div className="text-xl">→</div>
        <Node label="F2 (child)" affected={stress} note={stress ? 'methylated' : 'normal'} />
      </div>
      <button
        onClick={() => setStress(!stress)}
        className="mt-3 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs"
      >
        {stress ? 'Reset' : 'Stress F0 in adolescence'}
      </button>
      <div className="text-[10px] text-stone-500 italic mt-2">
        F0's environmental stress lays down methylation marks that survive TWO
        rounds of germline reprogramming. F2 inherits altered gene expression.
      </div>
    </div>
  )
}

function Node({ label, affected, note }: { label: string; affected: boolean; note: string }) {
  return (
    <div
      className={
        'rounded-lg border-2 p-2 text-center min-w-[80px] ' +
        (affected ? 'bg-orange-100 border-orange-400' : 'bg-stone-50 border-stone-300')
      }
    >
      <div className="text-2xl">{affected ? '🟠' : '🟢'}</div>
      <div className="text-xs font-mono">{label}</div>
      <div className="text-[9px] italic text-stone-500">{note}</div>
    </div>
  )
}

// -- Ch 44 — Operon regulation --------------------------------------------

export function OperonWidget() {
  const [inducerPresent, setInducerPresent] = useState(false)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        lac-style operon · sugar switches the genes on
      </div>
      <svg viewBox="0 0 500 140" className="w-full">
        <rect x="20" y="60" width="60" height="20" fill="#94a3b8" />
        <text x="50" y="75" textAnchor="middle" fontSize="10" fill="white">promoter</text>
        <rect x="90" y="60" width="60" height="20" fill="#334155" />
        <text x="120" y="75" textAnchor="middle" fontSize="10" fill="white">operator</text>
        <rect x="160" y="60" width="60" height="20" fill={inducerPresent ? '#22c55e' : '#94a3b8'} />
        <text x="190" y="75" textAnchor="middle" fontSize="10" fill="white">gene 1</text>
        <rect x="230" y="60" width="60" height="20" fill={inducerPresent ? '#22c55e' : '#94a3b8'} />
        <text x="260" y="75" textAnchor="middle" fontSize="10" fill="white">gene 2</text>
        <rect x="300" y="60" width="60" height="20" fill={inducerPresent ? '#22c55e' : '#94a3b8'} />
        <text x="330" y="75" textAnchor="middle" fontSize="10" fill="white">gene 3</text>
        {/* Repressor */}
        {!inducerPresent && (
          <>
            <circle cx="120" cy="40" r="15" fill="#dc2626" />
            <text x="120" y="44" textAnchor="middle" fontSize="10" fill="white">R</text>
            <line x1="120" y1="55" x2="120" y2="60" stroke="#dc2626" strokeWidth="3" />
          </>
        )}
      </svg>
      <button
        onClick={() => setInducerPresent(!inducerPresent)}
        className="mt-2 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs"
      >
        {inducerPresent ? 'Remove inducer' : 'Add inducer (sugar)'}
      </button>
      <div className="text-[10px] text-stone-500 italic mt-2">
        Inducer pulls the repressor off the operator. Genes downstream
        transcribe together — the operon is on.
      </div>
    </div>
  )
}

// -- Ch 45 — Transposable elements ----------------------------------------

export function TransposableElementWidget() {
  const [position, setPosition] = useState(1)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Jumping gene — moves between generations
      </div>
      <svg viewBox="0 0 500 100" className="w-full">
        <line x1="20" y1="50" x2="480" y2="50" stroke="#94a3b8" strokeWidth="2" />
        {[80, 170, 260, 350, 430].map((x, i) => (
          <g key={i}>
            <rect x={x - 20} y="40" width="40" height="20" fill={i === position ? '#f97316' : '#7dd3fc'} />
            <text x={x} y="53" textAnchor="middle" fontSize="10" fill="white">
              gene {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <button
        onClick={() => setPosition(p => (p + 1) % 5)}
        className="mt-2 px-3 py-1.5 rounded bg-emerald-600 text-white text-xs"
      >
        Trigger transposition
      </button>
      <div className="text-[10px] text-stone-500 italic mt-2">
        The transposable element (orange) cuts itself out and inserts
        elsewhere. It can disrupt or reactivate the gene at its landing site.
      </div>
    </div>
  )
}

// -- Ch 46 — Copy number variation ----------------------------------------

export function CopyNumberWidget() {
  const [copies, setCopies] = useState(2)
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Copy number variation — dosage effects
      </div>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-stone-700">Number of gene copies:</label>
        <input type="range" min={1} max={5} value={copies} onChange={e => setCopies(Number(e.target.value))} className="flex-1 accent-amber-500" />
        <span className="font-mono text-sm w-6">{copies}</span>
      </div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: copies }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center text-white font-mono text-xs">
            G
          </div>
        ))}
      </div>
      <div className="text-sm mt-3 font-mono">
        Expected protein dosage: <strong>{copies}×</strong>
      </div>
      <div className="text-[10px] text-stone-500 italic mt-2">
        {copies < 2
          ? 'Haploinsufficiency risk — one copy may not be enough.'
          : copies > 2
            ? 'Duplication — overexpression may cause disease.'
            : 'Normal diploid dosage.'}
      </div>
    </div>
  )
}

// -- Ch 47 — Chimera / mosaic ---------------------------------------------

export function ChimeraWidget() {
  return (
    <div className="rounded-lg bg-white border border-stone-300 p-4">
      <div className="text-xs uppercase tracking-wide text-stone-500 mb-2">
        Chimera — two genotypes, one body
      </div>
      <svg viewBox="0 0 300 200" className="w-full max-w-md mx-auto">
        {/* Left half */}
        <clipPath id="chim-left">
          <rect x="0" y="0" width="150" height="200" />
        </clipPath>
        <clipPath id="chim-right">
          <rect x="150" y="0" width="150" height="200" />
        </clipPath>
        <g clipPath="url(#chim-left)">
          <ellipse cx="150" cy="110" rx="80" ry="70" fill="#f87171" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="120" cy="95" r="6" fill="#1e293b" />
        </g>
        <g clipPath="url(#chim-right)">
          <ellipse cx="150" cy="110" rx="80" ry="70" fill="#7dd3fc" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="180" cy="95" r="6" fill="#1e293b" />
        </g>
        <line x1="150" y1="30" x2="150" y2="190" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <div className="text-[10px] text-stone-500 italic">
        Each half of this creature descends from a different zygote. Chimeras
        can arise from embryonic fusion; mosaics arise from post-fertilisation
        mutation in a single zygote — same appearance, different origin story.
      </div>
    </div>
  )
}

// -- Utilities ------------------------------------------------------------

function pseudoRand(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange(n: number): void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-700">
      <span className="flex-1">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-24 text-center border-2 border-stone-300 rounded font-mono px-2 py-1"
      />
    </label>
  )
}
