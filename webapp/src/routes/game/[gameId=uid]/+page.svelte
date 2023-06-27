<script lang="ts">
  import { useMachine } from '$lib/@xstate/svelte/useMachine.js'
  import { setGameContext } from '$lib/client/game-context.js'
  import { getClientGameMachine } from '$lib/client/game-machine/configured.js'
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import Emojis from '$lib/components/game/Emojis.svelte'
  import Game from '$lib/components/game/Game.svelte'
  import Users from '$lib/components/game/Users.svelte'
  import { play } from '$lib/sound/index.js'
  import { onMount } from 'svelte'
  import throttle from 'lodash/throttle'
  import CursorOverlays from '$lib/components/game/CursorOverlays.svelte'

  export let data

  const gameId = data.gameId
  const userId = data.userId
  const hostUserId = data.hostUserId

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
    {
      input: { gameId, userId, hostUserId },
    },
  )

  setGameContext({ gameId, userId, hostUserId, machine })

  const state = machine.state

  // const { state, send, service } = useMachine(clientMachine, {
  //   input: { gameId: $page.params.gameId },
  // })

  // const gameId = useSelector(service, (state) => {
  //   return state.context.gameId
  // })
  // $: userInGame = $state.matches('Ingame')

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
  <svelte:fragment slot="players">
    <h1>{$socketConnection.status}</h1>

    <Users />
  </svelte:fragment>
  <Emojis slot="actions" bind:this={emojisComponent} />
  <CursorOverlays slot="cursor-overlays" {mousePositions} />
</Game>

<pre>
{$socketConnection.log.join('\n')}

{JSON.stringify($state, null, 2)}
</pre>
