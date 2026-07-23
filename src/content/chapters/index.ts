import type { Chapter } from '../types'
import { ch01 } from './ch01-simple-dominance'
import { ch02 } from './ch02-test-cross'
import { ch03 } from './ch03-independent-assortment'

export const chapters: Chapter[] = [ch01, ch02, ch03]

export const chapterById: Record<string, Chapter> = Object.fromEntries(
  chapters.map(c => [c.id, c]),
)
