import { envBool } from '$lib/utils'
import { describe, expect, it } from 'vitest'

describe('utils', () => {
  describe('envBool', () => {
    it('properly returns true with truthy string', () => {
      expect(envBool('true')).toBe(true)
      expect(envBool('True')).toBe(true)
      expect(envBool('TRUE')).toBe(true)
      expect(envBool('1')).toBe(true)
    })
    it('properly returns false with falsy string', () => {
      expect(envBool('false')).toBe(false)
      expect(envBool('0')).toBe(false)
      expect(envBool('')).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(envBool(null as any)).toBe(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(envBool(undefined as any)).toBe(false)
    })
  })
})
