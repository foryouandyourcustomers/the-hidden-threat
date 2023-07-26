import type { Attacker, Defender } from '$lib/game/types'

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns A defender with default parameters.
 */
export const createDefaultDefender = (hostUserId: string): Defender => ({
  userId: hostUserId,
  position: [0, 0],
  face: 'other',
  role: 'dispatch-manager',
  isConfigured: false,
})

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns An attacker with default parameters.
 */
export const createDefaultAttacker = (hostUserId: string): Attacker => ({
  userId: hostUserId,
  face: 'other',
  position: [0, 0],
  role: 'disappointment',
  isConfigured: false,
})
