// Shared scaffolding used by later chapters. Every gene set to a neutral
// homozygous-recessive baseline, so chapter starters can spread this and
// only override the focus gene.
export const NEUTRAL_FEMALE: Record<string, string[]> = {
  antennae: ['a', 'a'],
  spots: ['s', 's'],
  color: ['w', 'w'],
  pattern: ['B', 'B'],
  horns: ['n', 'n'],
  fins: ['f', 'f'],
  eyeGlow: ['g', 'g'],
  coatPigment: ['C', 'C'],
  sizeA: ['x', 'x'],
  sizeB: ['y', 'y'],
  sizeC: ['z', 'z'],
  heatSpot: ['h', 'h'],
  sparkle: ['k', 'k'],
  lethalCoat: ['y', 'y'],
  mitoHalo: ['q'],
  braincrest: ['w', 'w'],
  broodPouch: ['u', 'u'],
  imprintMark: ['j', 'j'],
}

export const NEUTRAL_MALE: Record<string, string[]> = {
  ...NEUTRAL_FEMALE,
  eyeGlow: ['g'],
}
