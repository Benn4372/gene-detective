// Shared scaffolding used by later chapters. Only genes whose recessive form
// hides visually (or whose absence would trigger a downstream side effect)
// are included. Pattern (codominant — BB shows blotches, TT shows stripes),
// horns (multipleAllele — every state including 'n' short still draws),
// and other "always-something" traits are left OUT so a spread of this
// scaffold produces a clean-looking blob when the chapter isn't teaching
// those traits.
export const NEUTRAL_FEMALE: Record<string, string[]> = {
  antennae: ['a', 'a'],
  spots: ['s', 's'],
  color: ['w', 'w'],
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
