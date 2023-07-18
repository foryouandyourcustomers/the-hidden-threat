import type { Context } from '$lib/server/game-machine/types'
import type { SharedGameContext } from '$lib/game/types'

export const getSharedGameContext = (context: Context): SharedGameContext => ({
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  users: context.users,
  actions: context.actions,
  defense: context.defense,
  attack: context.attack,
})
