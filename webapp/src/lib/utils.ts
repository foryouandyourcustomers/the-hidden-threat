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
