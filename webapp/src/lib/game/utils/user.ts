import type { Player, PlayerId, SharedGameContext, User } from '$lib/game/types'
import { getPlayer } from './player'

export const findUserIndex = (userId: string, context: SharedGameContext): number | undefined => {
  const index = context.users.findIndex((user) => user.id === userId)
  return index === -1 ? undefined : index
}

export const getUserIndex = (userId: string, context: SharedGameContext): number => {
  const index = findUserIndex(userId, context)
  if (index === undefined) throw new Error(`The user with id ${userId} was not found.`)
  return index
}

export const getUser = (userId: string, context: SharedGameContext): User => {
  const user = context.users.find((user) => user.id === userId)
  if (!user) throw new Error(`The user with id ${userId} was not found.`)
  return user
}

/** Whether this user controls the player or is an admin */
export const userControlsPlayerId = (
  userId: string,
  playerId: PlayerId,
  context: SharedGameContext,
): boolean => userControlsPlayer(userId, getPlayer(playerId, context), context)

/** Whether this user controls the player or is an admin */
export const userControlsPlayer = (
  userId: string,
  player: Player,
  context: SharedGameContext,
): boolean => {
  if (player.userId === userId) return true
  const user = getUser(userId, context)
  return user.isAdmin
}
