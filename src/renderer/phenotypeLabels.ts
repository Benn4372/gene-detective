// Human-readable descriptors for phenotype values that would otherwise reveal
// the genotype. Only overrides the small handful of values where the raw
// phenotype (from computePhenotype) is a genotype-shaped string; every other
// value passes through unchanged, so mission targetPhenotype comparisons and
// engine logic keep using the raw form.

const LABELS: Record<string, Record<string, string>> = {
  tail: {
    T: 'long',
    'T/t': 'medium',
    t: 'short',
    none: 'no tail',
  },
  pattern: {
    R: 'stripes',
    B: 'blotches',
    RB: 'stripes + blotches',
  },
  horns: {
    L: 'long',
    M: 'medium',
    n: 'short',
  },
}

export function phenotypeLabel(
  traitId: string,
  phenotypeValue: string | undefined,
): string {
  if (phenotypeValue === undefined) return '—'
  const perTrait = LABELS[traitId]
  return perTrait?.[phenotypeValue] ?? phenotypeValue
}
