import { dev } from '$app/environment'
import type { Attacker, Defender, DefenderId } from '$lib/game/types'

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns A defender with default parameters.
 */
export const createDefaultDefender = (hostUserId: string, id: DefenderId): Defender => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: 'order-manager',
  isConfigured: dev ? true : false,
})

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns An attacker with default parameters.
 */
export const createDefaultAttacker = (hostUserId: string): Attacker => ({
  id: 'attacker',
  userId: hostUserId,
  faceId: 0,
  character: 'frustrated',
  isConfigured: dev ? true : false,
})
