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

export const createActionHandler = <Action extends GameEventAction>(
  action: Action,
  {
    createEvent,
    enabledCheck,
  }: {
    createEvent: (
      gameState: GameState,
    ) => DistributiveOmit<
      ActionEventOf<Action>,
      'userId' | 'action' | 'type' | 'timestamp' | 'finalized' | 'playerId'
    >
    enabledCheck?: ((gameState: GameState) => boolean) | undefined
  },
) => {
  const { machine } = getGameContext()

  const inProgressEvent = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    if (isActionEventOf(gameState.lastEvent, action)) {
      return gameState.lastEvent
    } else return undefined
  })

  const isEnabled = enabledCheck
    ? useSelector(machine.service, ({ context }) => {
        return enabledCheck(GameState.fromContext(context))
      })
    : readable(true)

  const getActionEvent = (finalized = false): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(machine.service.getSnapshot().context)
    return {
      type: 'apply game event',
      gameEvent: {
        ...createEvent(gameState),
        finalized,
        type: 'action',
        action,
        playerId: gameState.activePlayer.id,
      } as DistributiveOmit<ActionEventOf<Action>, 'userId' | 'timestamp'>,
    }
  }

  const canApplyAction = useSelector(machine.service, (state) => state.can(getActionEvent()))

  const applyAction = (finalized = false) => {
    machine.send(getActionEvent(finalized))
  }

  const cancel = () => machine.send({ type: 'cancel game event' })

  return {
    isEnabled,
    applyAction,
    inProgressEvent,
    cancel,
    canApplyAction,
  }
}
