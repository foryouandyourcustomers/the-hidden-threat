<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'

  const { machine } = getGameContext()

  const defenderIds = [0, 1, 2, 3] as const

  const defenders = useSelector(machine.service, ({ context }) => context.defense.defenders)
</script>

{#each defenderIds as defenderId}
  {@const defender = $defenders[defenderId]}
  {#if defender}
    {defender.userId}
  {:else}
    Nicht konfiguriert
  {/if}
  <button on:click={() => machine.send({ type: 'start editing player', playerId: defenderId })}>
    Rolle bestimmen
  </button>
{/each}
