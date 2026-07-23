// Shared scaffolding used by later chapters. Only genes whose recessive form
// hides visually (or whose absence would trigger a downstream side effect)
// are included. LEFT OUT of the scaffold on purpose:
//   • pattern (codominant — BB shows blotches, TT shows stripes)
//   • horns (multipleAllele — every state including 'n' short still draws a nub)
//   • sizeA / sizeB / sizeC (polygenic — including any allele triggers the
//     polygenic aggregator, forcing size = 0 → 0.7× blob scale for every
//     chapter that isn't teaching size)
// A chapter that DOES teach any of those overrides the scaffold explicitly.
export const NEUTRAL_FEMALE: Record<string, string[]> = {
  antennae: ['a', 'a'],
  spots: ['s', 's'],
  tail: ['t', 't'],
  fins: ['f', 'f'],
  eyeGlow: ['g', 'g'],
  tailGrowth: ['P', 'P'],
  heatSpot: ['h', 'h'],
  sparkle: ['k', 'k'],
  lethalCoat: ['c', 'c'],
  mitoHalo: ['q'],
  braincrest: ['w', 'w'],
  broodPouch: ['u', 'u'],
  imprintMark: ['j', 'j'],
}

export const NEUTRAL_MALE: Record<string, string[]> = {
  ...NEUTRAL_FEMALE,
  eyeGlow: ['g'],
}
