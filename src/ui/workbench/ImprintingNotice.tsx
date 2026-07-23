import { blobSpecies } from '../../content'

interface Props {
  geneId: string
}

// Small banner shown above the Punnett for genes with imprintOrigin set.
// Explains that offspring silence the imprinted parental copy — so the
// player understands why a Jj heterozygote can still express the paternal
// (or maternal) allele's phenotype, and why reciprocal crosses give
// opposite results.
export function ImprintingNotice({ geneId }: Props) {
  const gene = blobSpecies.genes.find(g => g.id === geneId)
  if (!gene?.imprintOrigin) return null
  const silenced = gene.imprintOrigin === 'maternal' ? 'mother' : 'father'
  const expressing = gene.imprintOrigin === 'maternal' ? 'father' : 'mother'
  return (
    <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-200 p-3 text-xs text-fuchsia-900">
      <div className="uppercase tracking-widest text-fuchsia-700 mb-1 text-[10px]">
        Imprinted · {gene.imprintOrigin === 'maternal' ? 'maternal silencing' : 'paternal silencing'}
      </div>
      <div className="leading-snug">
        In every offspring the {silenced}'s copy of{' '}
        <span className="font-semibold">{gene.name}</span> is silenced —
        only the {expressing}'s allele expresses. That's why a reciprocal
        cross (mother × father genotypes swapped) can give the OPPOSITE
        phenotype in offspring from the same allele pair.
      </div>
    </div>
  )
}
