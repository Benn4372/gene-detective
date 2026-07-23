import { blobSpecies } from '../../content'

interface Props {
  geneId: string
}

// Small banner shown above the Punnett for any gene with a non-obvious
// inheritance quirk beyond the base Mendelian rules — sex-influenced
// dominance, sex-limited expression, or environmental gating. Explains the
// mechanism BEFORE the player tries to reason through offspring counts.
// Imprinting has its own ImprintingNotice.
export function InheritanceQuirkNotice({ geneId }: Props) {
  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene) return null

  if (gene.sexInfluenced) {
    return (
      <NoticeShell tone="teal" label="Sex-influenced dominance">
        Dominance <span className="font-semibold">flips by sex</span> for{' '}
        <span className="font-semibold">{gene.name}</span>. In males the
        capital-letter allele wins in the heterozygote; in females the
        lowercase allele wins. Same Aa genotype, opposite phenotypes.
      </NoticeShell>
    )
  }

  if (gene.sexLimitedTo) {
    const sex = gene.sexLimitedTo === 'F' ? 'females' : 'males'
    const other = gene.sexLimitedTo === 'F' ? 'Males' : 'Females'
    return (
      <NoticeShell tone="teal" label="Sex-limited expression">
        <span className="font-semibold">{gene.name}</span> only expresses in{' '}
        {sex}. {other} inherit the alleles normally and can pass them to
        daughters/sons, but never show the phenotype themselves — so a picker
        column full of silent carriers is expected.
      </NoticeShell>
    )
  }

  if (gene.environmentalThreshold !== undefined) {
    return (
      <NoticeShell tone="orange" label="Environment-gated">
        <span className="font-semibold">{gene.name}</span> only expresses when
        ambient temperature is at least{' '}
        <span className="font-mono">{gene.environmentalThreshold}°</span>. Below
        that, even carriers of the dominant allele look plain — so cross the
        pair, then drag the temperature slider up to reveal the phenotype.
      </NoticeShell>
    )
  }

  if (gene.lethalGenotypes && gene.lethalGenotypes.length > 0) {
    return (
      <NoticeShell tone="rose" label="Lethal allele">
        The{' '}
        <span className="font-mono font-semibold">
          {gene.lethalGenotypes.join(', ')}
        </span>{' '}
        genotype{gene.lethalGenotypes.length > 1 ? 's die' : ' dies'} before
        observation, so the offspring class you'd normally count is simply
        missing. Ratios get distorted — a 3:1 Punnett prediction turns into
        an observed 2:1 among the survivors.
      </NoticeShell>
    )
  }

  if (gene.mutationRate && gene.mutationRate > 0) {
    const pct = (gene.mutationRate * 100).toFixed(1)
    return (
      <NoticeShell tone="teal" label="Unstable allele">
        <span className="font-semibold">{gene.name}</span> alleles flip at a
        rate of about <span className="font-mono">{pct}%</span> per gamete —
        the Punnett prediction is right on AVERAGE, but you'll see occasional
        offspring that don't match either parent's alleles. Those "rogue"
        offspring are spontaneous mutations, not hidden carriers.
      </NoticeShell>
    )
  }

  return null
}

function NoticeShell({
  tone,
  label,
  children,
}: {
  tone: 'teal' | 'orange' | 'rose'
  label: string
  children: React.ReactNode
}) {
  const cls =
    tone === 'teal'
      ? 'bg-teal-50 border-teal-200 text-teal-900'
      : tone === 'rose'
        ? 'bg-rose-50 border-rose-200 text-rose-900'
        : 'bg-orange-50 border-orange-200 text-orange-900'
  const stripCls =
    tone === 'teal'
      ? 'text-teal-700'
      : tone === 'rose'
        ? 'text-rose-700'
        : 'text-orange-700'
  return (
    <div className={'rounded-lg border p-3 text-xs mb-3 ' + cls}>
      <div className={'uppercase tracking-widest mb-1 text-[10px] ' + stripCls}>
        {label}
      </div>
      <div className="leading-snug">{children}</div>
    </div>
  )
}
