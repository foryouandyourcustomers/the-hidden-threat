<script lang="ts">
  import { useMachine } from '$lib/@xstate/svelte/useMachine.js'
  import { setGameContext } from '$lib/client/game-context.js'
  import { getClientGameMachine } from '$lib/client/game-machine/configured.js'
  import { getUser } from '$lib/client/game-machine/utils'
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import CursorOverlays from '$lib/components/game/CursorOverlays.svelte'
  import Emojis from '$lib/components/game/Emojis.svelte'
  import Game from '$lib/components/game/Game.svelte'
  import { play } from '$lib/sound/index.js'
  import { useSelector } from '$lib/@xstate/svelte'
  import throttle from 'lodash/throttle'
  import { onMount } from 'svelte'
  import isEqual from 'lodash/isEqual'

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
        showEmoji: ({ userId, emoji }) => emojisComponent?.showEmoji({ userId, emoji }),
      },
    }),
    // TODO: replace input data with actual
    {
      input: machineInput,
    },
  )

  const user = useSelector(machine.service, ({ context }) => getUser(context), isEqual)

  setGameContext({ gameId, userId, user, hostUserId, machine })

  const state = machine.state

  onMount(() => {
    socketConnection.open()
    return () => {
      socketConnection.close()
    }
  })

  let emojisComponent: Emojis | undefined

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
</script>

<Game {reportMousePosition}>
  <Emojis slot="actions" bind:this={emojisComponent} />
  <CursorOverlays slot="cursor-overlays" {mousePositions} />
</Game>

<pre>
{$socketConnection.log.join('\n')}

{JSON.stringify($state, null, 2)}
</pre>
