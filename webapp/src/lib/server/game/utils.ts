import { dev } from '$app/environment'
import type { Attacker, Defender, DefenderId, SharedGameContext } from '$lib/game/types'
import type { Context } from '$lib/server/game-machine/types'

export const getSharedGameContext = (context: Context): SharedGameContext => ({
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttacks: context.globalAttacks,
  targetedAttacks: context.targetedAttacks,
  users: context.users,
  events: context.events,
  defense: context.defense,
  attack: context.attack,
})

/**
 * @param hostUserId Will only be used as default until configured.
 * @returns A defender with default parameters.
 */
export const createDefaultDefender = (hostUserId: string, id: DefenderId): Defender => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: 'dispatch-manager',
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
  character: 'disappointed',
  isConfigured: dev ? true : false,
})
