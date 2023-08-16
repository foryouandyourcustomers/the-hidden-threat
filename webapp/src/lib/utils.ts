/**
 * A type safe version of Object.entries that will maintain the type of the
 * keys.
 */
export const objectEntries = <T extends Record<PropertyKey, unknown>>(
  obj: T,
): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][]
}
