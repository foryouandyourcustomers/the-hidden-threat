<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { useMachine } from '$lib/@xstate/svelte/useMachine.js'
  import { setGameContext } from '$lib/client/game-context.js'
  import { getClientGameMachine } from '$lib/client/game-machine/configured.js'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import CursorOverlays from '$lib/components/game/CursorOverlays.svelte'
  import EmojiOverlays from '$lib/components/game/EmojiOverlays.svelte'
  import Game from '$lib/components/game/Game.svelte'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants/general.js'
  import { play } from '$lib/sound/index.js'
  import isEqual from 'lodash/isEqual'
  import throttle from 'lodash/throttle'
  import { onMount } from 'svelte'

  export let data

  const machineInput = data.machineInput
  const gameId = machineInput.gameId
  const userId = machineInput.userId
  const hostUserId = machineInput.hostUserId

  const mousePositions: { [key: string]: [number, number] } = {}

  const socketConnection = createWebSocketConnection({
    gameId,
    userId,
    onMessage: (message) => {
      if (message.type === 'mouse position') {
        mousePositions[message.userId] = message.position
      } else {
        machine.send(message)
      }
    },
  })

  const machine = useMachine(
    getClientGameMachine({
      send: socketConnection.send,
      actions: {
        playSound: play,
        showEmoji: ({ userId, emoji }) => showEmoji?.({ userId, emoji }),
      },
    }),
    { input: machineInput },
  )

  const user = useSelector(machine.service, ({ context }) => getCurrentUser(context), isEqual)

  setGameContext({ gameId, userId, user, hostUserId, machine })

  const state = machine.state

  onMount(() => {
    socketConnection.open()
    return () => {
      socketConnection.close()
    }
  })

  const reportMousePosition = throttle(
    (position: [number, number]) => {
      socketConnection.send({
        type: 'mouse position',
        position,
      })
    },
    50,
    { leading: true, trailing: true },
  )

  let showEmoji: (props: { userId: string; emoji: string }) => void
</script>

<Game {reportMousePosition} --row-count={ROW_COUNT} --column-count={COLUMN_COUNT}>
  <svelte:fragment slot="overlays">
    <CursorOverlays {mousePositions} />
    <EmojiOverlays bind:showEmoji />
  </svelte:fragment>
</Game>

<pre>
{$socketConnection.log.join('\n')}

{JSON.stringify($state, null, 2)}
</pre>
