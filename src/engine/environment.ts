// Ambient environmental state read by phenotype resolution.
//
// A tiny module-level singleton so we don't have to thread environment
// through every computePhenotype callsite. The gameStore is the source of
// truth; the store's setter mirrors into this module. Deterministic tests
// call the setter directly.
let temperature = 50 // 0 = cold, 100 = hot; 50 = temperate (default)

export function getEnvironmentTemperature(): number {
  return temperature
}

export function setEnvironmentTemperature(t: number): void {
  temperature = Math.max(0, Math.min(100, t))
}
