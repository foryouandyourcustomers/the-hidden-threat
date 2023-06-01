<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '../context'

  const context = getGameContext()

  const players = useSelector(context.machine.service, (state) => state.context.players)
</script>

<div class="players">
  <h3>Players</h3>
  {#each $players as player}
    <p>
      {#if player.isConnected}🟢{:else}🟠{/if}
      {player.name}
    </p>
  {/each}
</div>

<style lang="postcss">
  .players {
    position: fixed;
    top: var(--size-2);
    right: var(--size-2);
    border: 2px solid var(--color-grey-200);
    border-radius: var(--radius-md);
    background: white;
    padding: var(--size-2) var(--size-3);
  }
</style>
