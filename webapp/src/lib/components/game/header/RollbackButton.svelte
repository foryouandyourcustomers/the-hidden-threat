<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const lastGameEvent = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.lastEvent
  })
</script>

{#if $lastGameEvent}
  <button
    on:click={() =>
      $lastGameEvent
        ? machine.send({ type: 'rollback game event', gameEventType: $lastGameEvent.type })
        : null}
  >
    Spielzug zurücknehmen
  </button>
{/if}
