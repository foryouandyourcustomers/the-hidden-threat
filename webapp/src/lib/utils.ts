/**
 * A type safe version of Object.entries that will maintain the type of the
 * keys.
 */
export const objectEntries = <T extends Record<PropertyKey, unknown>>(
  obj: T,
): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][]
}

/** A utility type that allows us to Omit keys of a union type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

/**
 * This utility is useful if you _know_ that an access will be valid but don't
 * want to suppress the TS warning:
 *
 *     const obj = objects[0] ?? throwIfNotFound()
 *           ^ this object can't be undefined
 *
 * instead of:
 *
 *     const obj = objects[0]!
 */
export const throwIfNotFound = (): never => {
  throw 'Invalid state'
}

/** Returns a number between 0 (incl) and 1 (excl). */
export type RandomNumberGenerator = () => number

/** Based on mulberry32 */
export const seededRandomGenerator =
  (seed: number): RandomNumberGenerator =>
  (): number => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
