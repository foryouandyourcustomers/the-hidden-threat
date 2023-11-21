import { useSelector } from '$lib/@xstate/svelte'
import { getGameContext } from '$lib/client/game-context'
import type { ClientUsedMachine } from '$lib/client/game-machine/configured'
import type { ClientEventOf } from '$lib/client/game-machine/types'
import { GameState } from '$lib/game/game-state'
import { isActionEventOf, type ActionEventOf, type GameEventAction } from '$lib/game/types'
import type { DistributiveOmit } from '$lib/utils'
import type { Action as SvelteAction } from 'svelte/action'
import { derived, get, readable, writable, type Updater, type Writable } from 'svelte/store'

export const isActionInProgress = (machine: ClientUsedMachine, action: GameEventAction) =>
  useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, action)
  })

export const createActionHandler = <Action extends GameEventAction, Option = never>(
  action: Action,
  {
    createEvent,
    enabledCheck,
    extractSelectedOption,
  }: {
    createEvent: (
      gameState: GameState,
      selectedOption: Option | undefined,
    ) => DistributiveOmit<
      ActionEventOf<Action>,
      'userId' | 'action' | 'type' | 'timestamp' | 'finalized' | 'playerId'
    >
    enabledCheck?: ((gameState: GameState) => boolean) | undefined
    extractSelectedOption?: ((actionEvent: ActionEventOf<Action>) => Option | undefined) | undefined
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
        ...createEvent(gameState, get(internalSelectedOption)),
        finalized,
        type: 'action',
        action,
        playerId: gameState.activePlayer.id,
      } as DistributiveOmit<ActionEventOf<Action>, 'userId' | 'timestamp'>,
    }
  }

  const internalSelectedOption = writable<Option | undefined>(undefined, () => {
    // First subscriber, so we initialize the store with the currently selected
    // value, and set up a dependency for the inProgressEvent.
    const updateFromEvent = (event: ActionEventOf<Action> | undefined) => {
      if (extractSelectedOption) {
        internalSelectedOption.set(event ? extractSelectedOption(event) : undefined)
      }
    }

    if (extractSelectedOption) {
      const event = get(inProgressEvent)
      updateFromEvent(event)
    }

    // Every time the inProgressEvent changes, we update the internal selected
    // option with the value stored inside the event.
    return inProgressEvent.subscribe(updateFromEvent)
  })

  const applyEventOnOptionChange = () => {
    if (!extractSelectedOption) return
    const event = get(inProgressEvent)
    const eventOption = event ? extractSelectedOption(event) : undefined
    const selectedOption = get(internalSelectedOption)

    if (eventOption != selectedOption) {
      applyAction(false)
    }
  }

  const canApplyAction = useSelector(machine.service, (state) => state.can(getActionEvent()))

  const applyAction = (finalized = false) => {
    machine.send(getActionEvent(finalized))
  }

  const cancel = () => machine.send({ type: 'cancel game event' })

  const buttonDisabled = derived(
    [canApplyAction, internalSelectedOption],
    ([$canApplyAction, $selectedOption]) =>
      !$canApplyAction || (extractSelectedOption && $selectedOption === undefined),
  )
  const buttonDisabledReason = derived(canApplyAction, ($canApplyAction) =>
    !$canApplyAction ? 'Du bist nicht am Zug' : 'Bitte triff eine Auswahl',
  )

  const formAction: SvelteAction<HTMLFormElement> = (form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      if (get(canApplyAction) && get(isEnabled)) {
        if (!extractSelectedOption || get(internalSelectedOption) != undefined) {
          applyAction(true)
        }
      }
    })
  }

  const selectedOption: Writable<Option | undefined> = {
    subscribe: internalSelectedOption.subscribe,
    update: (updater: Updater<Option | undefined>) => {
      internalSelectedOption.update(updater)
      applyEventOnOptionChange()
    },
    set: (value: Option | undefined) => {
      internalSelectedOption.set(value)
      applyEventOnOptionChange()
    },
  }

  return {
    isEnabled,
    applyAction,
    inProgressEvent,
    cancel,
    canApplyAction,
    selectedOption,
    formAction,
    buttonDisabled,
    buttonDisabledReason,
  }
}
