<script lang="ts">
  import { page } from '$app/stores'
  import { configuredMachine } from '$lib/logic/machines/configured'
  import { interpret } from 'xstate'
  import { useSelector } from '@xstate/svelte'
  import Board from '$lib/components/game/Board.svelte'
  import { play } from '$lib/sound'

  let state: unknown = 'initial'

  const machine = interpret(configuredMachine({ gameId: $page.params.gameId })).start()

  machine.subscribe((s) => {
    state = s
  })

  const gameId = useSelector(machine, (state) => {
    return state.context.gameId
  })

  const userInGame = useSelector(machine, (state) => {
    return state.matches('Ingame')
  })
</script>

<small>Game ID: {$gameId}</small><br />
{#if !$userInGame}
  <button on:click={() => machine.send({ type: 'userStartsGame', value: 'click' })}>
    Start Game
  </button>

  <button on:click={() => play('select')}>Test sound</button>
{:else}
  <Board />
{/if}

<pre>
game:

In game: {$userInGame}

{state}
</pre>
