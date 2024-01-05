<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { getStageAt } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import { guardForGameEventAction } from '$lib/game/types'
  import { getStage } from '$lib/game/utils'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  type NotificationId = string

  type NotificationSpec = {
    id: NotificationId
    message: string
    description?: string | undefined
  }

  type ToastId = number | string

  let toastIds: { [key: NotificationId]: ToastId | undefined } = {}

  const { machine } = getGameContext()

  const notifications = useSelector(machine.service, ({ context }): NotificationSpec[] => {
    const gameState = GameState.fromContext(context)
    const user = getCurrentUser(context)

    const notifications: NotificationSpec[] = []

    // Add notifications for the action of the current player
    if (gameState.activePlayer.userId === user.id) {
      if (gameState.nextEventType === 'move') {
        notifications.push({
          id: `move-${gameState.activePlayer.id}`,
          message: `${user.name}, du bist dran!`,
          description: `Bewege dich auf eines der markierten Felder, indem du auf das gewünschte Feld klickst.`,
        })
      } else if (gameState.nextEventType === 'placement') {
        notifications.push({
          id: `placement-${gameState.activePlayer.id}`,
          message: `${user.name}, du bist dran!`,
          description:
            gameState.activeSide === 'attack'
              ? 'Platziere dich auf einem Feld deiner Wahl.'
              : 'Platziere dich auf einem der markierten Felder.',
        })
      }
    }
    const lastFinalizedActionEvent = gameState.finalizedActionEvents.at(-1)
    if (lastFinalizedActionEvent) {
      // Add notifications for attacked / defended stages
      if (lastFinalizedActionEvent.action === 'attack') {
        // Must be set, since this is finalized
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const position = lastFinalizedActionEvent.position!
        const boardStage = getStageAt(position)
        const stage = getStage(boardStage.id)

        const totalAttacksOnThisSupplyChain = gameState.finalizedActionEvents
          .filter(guardForGameEventAction('attack'))
          .filter(
            (event) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              getStageAt(event.position!).supplyChainId === boardStage.supplyChainId,
          ).length
        const totalDefensesOnThisSupplyChain = gameState.finalizedActionEvents
          .filter(guardForGameEventAction('defend'))
          .filter(
            (event) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              getStageAt(event.position!).supplyChainId === boardStage.supplyChainId,
          ).length

        notifications.push({
          id: `attack-${lastFinalizedActionEvent.position}`,
          message: `Stufe "${stage.name}" von "Supply Chain ${
            boardStage.supplyChainId + 1
          }" wurde zerstört!`,
          description:
            totalAttacksOnThisSupplyChain >= 3 && totalDefensesOnThisSupplyChain !== 2
              ? `Das war die dritte Stufe, somit wurde die Supply Chain komplett lahm gelegt.`
              : undefined,
        })
      }
    }

    return notifications
  })
  let mounted = false
  onMount(() => (mounted = true))

  $: if (mounted) {
    Object.keys(toastIds).forEach((key) => {
      if (!$notifications.find(({ id }) => id === key)) {
        toast.dismiss(toastIds[key])
        delete toastIds[key]
      }
    })
    for (const { id, message, description } of $notifications) {
      if (!Object.keys(toastIds).includes(id)) {
        toastIds[id] = toast(message, { description })
      }
    }
  }
</script>
