<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  type NotificationId = string

  type NotificationSpec = {
    id: NotificationId
    message: string
  }

  type ToastId = number | string

  let toastIds: { [key: NotificationId]: ToastId | undefined } = {}

  const { machine } = getGameContext()

  const notifications = useSelector(machine.service, ({ context }): NotificationSpec[] => {
    const gameState = GameState.fromContext(context)
    const user = getCurrentUser(context)

    const notifications: NotificationSpec[] = []

    if (gameState.activePlayer.userId === user.id) {
      if (gameState.nextEventType === 'move') {
        notifications.push({
          id: `move-${gameState.activePlayer.id}`,
          message: `${user.name}, du bist dran! Bewege dich auf eines der markierten Felder, indem du auf das gewünschte Feld klickst.`,
        })
      } else if (gameState.nextEventType === 'placement') {
        notifications.push({
          id: `placement-${gameState.activePlayer.id}`,
          message: `${user.name}, du bist dran! ${
            gameState.activeSide === 'attack'
              ? 'Platziere dich auf einem Feld deiner Wahl.'
              : 'Platziere dich auf einem der markierten Felder.'
          }`,
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
    for (const { id, message } of $notifications) {
      if (!Object.keys(toastIds).includes(id)) {
        toastIds[id] = toast(message)
      }
    }
  }
</script>
