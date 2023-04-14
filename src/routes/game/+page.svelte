<script lang="ts">
  import { configuredMachine } from '$lib/logic/configured'
  import { interpret } from 'xstate'
  import { useSelector } from '@xstate/svelte'

  let state: any = 'initial'

  const machine = interpret(configuredMachine()).start()

  machine.onTransition((event, foo) => {
    state = machine.getSnapshot()
  })

  const foo = useSelector(machine, (state) => {
    return state.context.value
  })

  const userInGame = useSelector(machine, (state) => {
    return state.matches('Ingame')
  })
</script>

{#if !userInGame}
  <button on:click={() => machine.send({ type: 'userStartsGame', value: 'click' })}>
    Start Game
  </button>
{:else}
  IN GAME LETS GOOOO
{/if}

<pre>
game:

Context value: {$foo}

In game: {$userInGame}
</pre>
