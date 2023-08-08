import type { SharedGameContext } from '$lib/game/types'
import type { Context } from '$lib/server/game-machine/types'

export const getSharedGameContext = (context: Context): SharedGameContext => ({
  gameId: context.gameId,
  items: context.items,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenarios: context.globalAttackScenarios,
  users: context.users,
  events: context.events,
  defense: context.defense,
  attack: context.attack,
})
