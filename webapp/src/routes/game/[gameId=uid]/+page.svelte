<script lang="ts">
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import { onMount } from 'svelte'

  export let data

  const gameId = data.gameId
  const playerId = data.playerId

  const socketConnection = createWebSocketConnection({
    gameId,
    playerId,
    onMessage: (message) => {
      console.log('message', message)
    },
  })

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
</script>

<h1>{$socketConnection.status}</h1>
<pre>
{$socketConnection.log.join('\n')}
</pre>
