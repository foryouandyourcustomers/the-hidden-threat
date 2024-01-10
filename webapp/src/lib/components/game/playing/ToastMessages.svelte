<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { getStageAt } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import { isPlayerIdOfSide } from '$lib/game/types'
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
      // Add notifications for attacked stages
      if (lastFinalizedActionEvent.action === 'attack') {
        // Must be set, since this is finalized
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const position = lastFinalizedActionEvent.position!
        const boardStage = getStageAt(position)
        const stage = getStage(boardStage.id)

        const totalAttacksOnThisSupplyChain = gameState.attackedStages.filter(
          (stage) => stage.supplyChainId === boardStage.supplyChainId,
        ).length
        const totalDefensesOnThisSupplyChain = gameState.defendedStages.filter(
          (stage) => stage.supplyChainId === boardStage.supplyChainId,
        ).length

        notifications.push({
          id: `attacked-${lastFinalizedActionEvent.position}`,
          message: `Stufe "${stage.name}" von Supply Chain ${
            boardStage.supplyChainId + 1
          } wurde zerstört!`,
          description:
            totalAttacksOnThisSupplyChain >= 3 && totalDefensesOnThisSupplyChain !== 2
              ? `Das war die dritte Stufe, somit wurde die Supply Chain komplett lahm gelegt.`
              : undefined,
        })
      }
      // Add notifications for defended stages
      if (lastFinalizedActionEvent.action === 'defend') {
        // Must be set, since this is finalized
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const position = lastFinalizedActionEvent.position!
        const boardStage = getStageAt(position)
        const stage = getStage(boardStage.id)

        notifications.push({
          id: `defended-${lastFinalizedActionEvent.position}`,
          message: `Stufe "${stage.name}" von Supply Chain ${
            boardStage.supplyChainId + 1
          } wurde verteidigt!`,
        })
      }
    }

    if (gameState.currentRound % 3 === 0 && gameState.currentRound !== 0) {
      // Ok, so we're in the right round to actually display the note that there
      // are new attacks, but we only want to display it at the _start_ of the
      // round.
      // To determine that, we check if the current player has already moved.
      const side = getCurrentUser(context).side
      // Get the amount of moves from "our" side.
      const movesFromThisSideCount = gameState.finalizedMoveEvents.filter((event) =>
        isPlayerIdOfSide(event.playerId, side),
      ).length
      // If the amount of moves is identical to the amount of moves done in a
      // round we know that we haven't moved yet.
      const moved = movesFromThisSideCount !== gameState.currentRound * (side === 'attack' ? 2 : 4)
      if (!moved) {
        notifications.push({
          id: `new-attacks`,
          message: `Runde ${gameState.currentRound + 1} is erreicht!`,
          description:
            side === 'attack'
              ? `Drei neue gezielte Angriffe wurden aufgedeckt.`
              : `Ein neuer allgemeiner Angriff hat nun gestartet.`,
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
