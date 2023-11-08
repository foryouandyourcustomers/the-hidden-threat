import { DEV_AUTO_CONFIGURE_PLAYERS } from '$env/static/private'
import type { Attacker, Defender, DefenderId } from '$lib/game/types'
import { envBool } from '$lib/utils'

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns A defender with default parameters.
 */
export const createDefaultDefender = (hostUserId: string, id: DefenderId): Defender => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: 'order-manager',
  isConfigured: envBool(DEV_AUTO_CONFIGURE_PLAYERS),
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
  isConfigured: envBool(DEV_AUTO_CONFIGURE_PLAYERS),
})
