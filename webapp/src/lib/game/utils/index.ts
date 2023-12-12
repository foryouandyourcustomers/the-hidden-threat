import type { Context as ClientContext } from '$lib/client/game-machine/types'
import type { Context as ServerContext } from '$lib/server/game-machine/types'
import { format } from 'date-fns'
import { BOARD_ITEMS } from '../constants/board-items'
import { BOARD_SUPPLY_CHAINS } from '../constants/board-stages'
import { GLOBAL_ATTACK_SCENARIOS, type GlobalAttack } from '../constants/global-attacks'
import { STAGES, type StageId } from '../constants/stages'
import { TARGETED_ATTACKS, type TargetedAttack } from '../constants/targeted-attacks'
import type { SharedGameContext } from '../types'
import { produce } from 'immer'

export * from './player'
export * from './user'

export const isTargetedAttack = (attack: TargetedAttack | GlobalAttack): attack is TargetedAttack =>
  Object.hasOwn(attack, 'target')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const getStage = (stageId: StageId) => STAGES.find((stage) => stage.id === stageId)!

/**
 * Takes in a client or server context and extracts the SharedGameContext.
 *
 * Because `SharedGameContext` is a subset of `ClientContext` and
 * `ServerContext`, they both can be used as SharedGameContext, which is a
 * problem when exporting the data. That's why this function also accepts
 * the SharedGameContext and makes sure it doesn't contain additional data.
 */
export const getSharedGameContext = (
  context: ClientContext | ServerContext | SharedGameContext,
): SharedGameContext => ({
  timestamp: context.timestamp,
  gameId: context.gameId,
  hostUserId: context.hostUserId,
  finishedAssigningSides: context.finishedAssigningSides,
  globalAttackScenario: context.globalAttackScenario,
  targetedAttacks: context.targetedAttacks,
  users: context.users,
  events: context.events,
  defense: context.defense,
  attack: context.attack,
})

/**
 * Returns a data object that can be transformed to JSON and be sent via email
 * or downloaded for game analysis.
 */
export const getGameSummary = (context: SharedGameContext) => {
  return {
    // Make sure all additional data is stripped from the game context.
    context: produce(getSharedGameContext(context), (draft) => {
      // Remove names from export.
      draft.users.forEach((user, i) => {
        user.name = `Player ${i + 1}`
      })
    }),
    TARGETED_ATTACKS,
    GLOBAL_ATTACK_SCENARIOS,
    BOARD_ITEMS,
    BOARD_SUPPLY_CHAINS,
  }
}

export const getGameSummaryFilename = (context: SharedGameContext) => {
  const date = new Date(context.timestamp)
  return `game-data-${format(date, 'yyyy-LL-dd')}.json`
}
