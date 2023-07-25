<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'

  const { machine } = getGameContext()

  const attacker = useSelector(machine.service, ({ context }) => context.attack.attacker)
</script>

{#if $attacker}
  {$attacker.userId}
{:else}
  Nicht konfiguriert
{/if}
<button on:click={() => machine.send({ type: 'start editing player', playerId: 'attacker' })}>
  Rolle bestimmen
</button>
