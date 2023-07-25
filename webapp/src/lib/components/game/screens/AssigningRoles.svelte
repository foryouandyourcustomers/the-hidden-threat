<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getUser } from '$lib/client/game-machine/utils'
  import type { DefenderId } from '$lib/game/types'
  import PlayerConfigurator from './PlayerConfigurator.svelte'

  const { machine } = getGameContext()

  const side = useSelector(machine.service, ({ context }) => {
    const { side } = getUser(context)
    return side
  })

  const editingPlayerId = useSelector(
    machine.service,
    ({ context }) => ($side === 'attacker' ? context.attack : context.defense).editingPlayer,
  )

  const players = useSelector(machine.service, ({ context }) =>
    $side === 'attacker' ? [context.attack.attacker] : context.defense.defenders,
  )

  const toDefenderId = (playerId: number) => playerId as DefenderId
</script>

<div class="players">
  {#each $players as player, i}
    <div class="player">
      {#if player.isConfigured}
        {player.userId}
      {:else}
        Nicht konfiguriert
      {/if}
      <button
        on:click={() =>
          machine.send({
            type: 'start editing player',
            playerId: $side === 'attacker' ? 'attacker' : toDefenderId(i),
          })}
      >
        Rolle bestimmen
      </button>
    </div>
  {/each}
</div>

{#if $editingPlayerId !== undefined}
  {#key $editingPlayerId}
    <!-- Using #key here to make sure that the player configurator is not reused
    when switching the player that is being edited. -->
    <PlayerConfigurator playerId={$editingPlayerId} />
  {/key}
{/if}

<style lang="postcss">
  .players {
    grid-gap: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
