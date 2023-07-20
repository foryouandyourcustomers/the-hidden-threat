import type { SharedGameContext } from '$lib/game/types'
import type { Context } from '$lib/server/game-machine/types'

export const getSharedGameContext = (context: Context): SharedGameContext => ({
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenarios: context.globalAttackScenarios,
  users: context.users,
  actions: context.actions,
  defense: context.defense,
  attack: context.attack,
})