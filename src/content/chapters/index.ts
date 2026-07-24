import type { Chapter } from '../types'
import { ch01 } from './ch01-simple-dominance'
import { ch02 } from './ch02-test-cross'
import { ch03 } from './ch03-independent-assortment'
import { ch04 } from './ch04-incomplete-dominance'
import { ch05 } from './ch05-codominance'
import { ch06 } from './ch06-multiple-alleles'
import { ch07 } from './ch07-sex-linked'
import { ch08 } from './ch08-linkage'
import { ch09 } from './ch09-epistasis'
import { ch10 } from './ch10-polygenic'
import { ch11 } from './ch11-environmental'
import { ch12 } from './ch12-population-genetics'
import { ch13 } from './ch13-mutations'
import { ch14 } from './ch14-lethal'
import { ch15 } from './ch15-pleiotropy'
import { ch16 } from './ch16-sex-influenced'
import { ch17 } from './ch17-sex-limited'
import { ch18 } from './ch18-mitochondrial'
import { ch19 } from './ch19-imprinting'
import { ch20 } from './ch20-x-inactivation'
import { ch21 } from './ch21-modifier'
import { ch22 } from './ch22-anticipation'
import { ch23 } from './ch23-alt-sex'

// Ch 24-54 removed: chromosome-disorder karyotype puzzles, evolutionary
// population-drift sims, and researcher-tier widgets shipped as placeholder
// content — the interaction modes were half-built (karyotype had no puzzle,
// population sandbox showed percent readouts without the underlying blob
// evolution rendering, and researcher widgets were mostly one-paragraph
// stubs). Cutting them lets the game end at the coherent Mendel→through→
// modifier→anticipation→alt-sex arc.
export const chapters: Chapter[] = [
  ch01,
  ch02,
  ch03,
  ch04,
  ch05,
  ch06,
  ch07,
  ch08,
  ch09,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
  ch16,
  ch17,
  ch18,
  ch19,
  ch20,
  ch21,
  ch22,
  ch23,
]

export const chapterById: Record<string, Chapter> = Object.fromEntries(
  chapters.map(c => [c.id, c]),
)
