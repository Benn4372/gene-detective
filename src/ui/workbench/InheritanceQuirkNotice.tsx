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

  return null
}

function NoticeShell({
  tone,
  label,
  children,
}: {
  tone: 'teal' | 'orange'
  label: string
  children: React.ReactNode
}) {
  const cls =
    tone === 'teal'
      ? 'bg-teal-50 border-teal-200 text-teal-900'
      : 'bg-orange-50 border-orange-200 text-orange-900'
  const stripCls = tone === 'teal' ? 'text-teal-700' : 'text-orange-700'
  return (
    <div className={'rounded-lg border p-3 text-xs mb-3 ' + cls}>
      <div className={'uppercase tracking-widest mb-1 text-[10px] ' + stripCls}>
        {label}
      </div>
      <div className="leading-snug">{children}</div>
    </div>
  )
}
