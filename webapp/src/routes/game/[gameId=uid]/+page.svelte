<script lang="ts">
  import { useMachine } from '$lib/@xstate/svelte/useMachine.js'
  import { setGameContext } from '$lib/client/game-context.js'
  import { getClientGameMachine } from '$lib/client/game-machine/configured.js'
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import Emojis from '$lib/components/game/Emojis.svelte'
  import Users from '$lib/components/game/Users.svelte'
  import { play } from '$lib/sound/index.js'
  import { onMount } from 'svelte'

  export let data

  const gameId = data.gameId
  const userId = data.userId
  const hostUserId = data.hostUserId

  const socketConnection = createWebSocketConnection({
    gameId,
    userId,
    onMessage: (message) => {
      console.log('message', message)
      machine.send(message)
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
</script>

<h1>{$socketConnection.status}</h1>
<pre>
{$socketConnection.log.join('\n')}

{JSON.stringify($state, null, 2)}
</pre>

<Users />
<Emojis bind:this={emojisComponent} />
