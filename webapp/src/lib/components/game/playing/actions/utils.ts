import { useSelector } from '$lib/@xstate/svelte'
import { getGameContext } from '$lib/client/game-context'
import type { ClientUsedMachine } from '$lib/client/game-machine/configured'
import type { ClientEventOf } from '$lib/client/game-machine/types'
import { GameState } from '$lib/game/game-state'
import { isActionEventOf, type ActionEventOf, type GameEventAction } from '$lib/game/types'
import type { DistributiveOmit } from '$lib/utils'
import { readable } from 'svelte/store'

export const isActionInProgress = (machine: ClientUsedMachine, action: GameEventAction) =>
  useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, action)
  })

export const createActionHandler = <Action extends GameEventAction, GetEventOptions extends object>(
  action: Action,
  {
    createEvent,
    enabledCheck,
  }: {
    createEvent: (
      gameState: GameState,
      options: GetEventOptions,
    ) => DistributiveOmit<
      ActionEventOf<Action>,
      'userId' | 'action' | 'type' | 'timestamp' | 'finalized' | 'playerId'
    >
    enabledCheck?: ((gameState: GameState) => boolean) | undefined
  },
) => {
  const { machine } = getGameContext()

  const inProgress = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, action)
  })

  const isEnabled = enabledCheck
    ? useSelector(machine.service, ({ context }) => {
        return enabledCheck(GameState.fromContext(context))
      })
    : readable(true)

  const getActionEvent = (
    options: { finalized: boolean } & GetEventOptions,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(machine.service.getSnapshot().context)
    return {
      type: 'apply game event',
      gameEvent: {
        ...createEvent(gameState, options),
        finalized: options.finalized,
        type: 'action',
        action,
        playerId: gameState.activePlayer.id,
      } as DistributiveOmit<ActionEventOf<Action>, 'userId' | 'timestamp'>,
    }
  }

  const applyAction = (options: { finalized: boolean } & GetEventOptions) => {
    machine.send(getActionEvent(options))
  }

  const cancel = () => machine.send({ type: 'cancel game event' })

  return {
    isEnabled,
    applyAction,
    inProgress,
    cancel,
  }
}
