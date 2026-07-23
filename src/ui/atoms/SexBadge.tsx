import type { Sex } from '../../engine/types'

interface Props {
  sex: Sex
  size?: 'sm' | 'md'
}

// A small labelled sex glyph. Uses a subtle color hint so it can sit next to a
// blob's name without shouting.
export function SexBadge({ sex, size = 'sm' }: Props) {
  const isFemale = sex === 'F'
  const s = size === 'md' ? 'w-6 h-6 text-sm' : 'w-5 h-5 text-xs'
  return (
    <span
      title={isFemale ? 'Female' : 'Male'}
      className={
        'inline-flex items-center justify-center rounded-full font-bold ' +
        s +
        ' ' +
        (isFemale
          ? 'bg-rose-100 text-rose-700'
          : 'bg-sky-100 text-sky-700')
      }
    >
      {isFemale ? '♀' : '♂'}
    </span>
  )
}
