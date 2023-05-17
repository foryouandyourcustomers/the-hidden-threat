<script lang="ts">
  import { page } from '$app/stores'
  import Board from '$lib/components/game/Board.svelte'
  import { clientMachine } from '$lib/logic/machines/client/configured'
  import { play } from '$lib/sound'
  import { useMachine, useSelector } from '@xstate/svelte'
  import WebSocket from './WebSocket.svelte'

  export let data

  const gameId = data.gameId

  // const { state, send, service } = useMachine(clientMachine, {
  //   input: { gameId: $page.params.gameId },
  // })

  // const gameId = useSelector(service, (state) => {
  //   return state.context.gameId
  // })
  // $: userInGame = $state.matches('Ingame')
</script>

<WebSocket {gameId} playerId={data.playerId} />

<!-- <pre>
game:

In game: {userInGame}

{state}
</pre> -->
