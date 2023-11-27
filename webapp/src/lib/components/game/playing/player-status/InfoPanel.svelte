<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import AttacksIcon from '$lib/components/game/playing/player-status/AttacksIcon.svelte'
  import Inventory from '$lib/components/game/playing/player-status/Inventory.svelte'
  import InventoryIcon from '$lib/components/game/playing/player-status/InventoryIcon.svelte'
  import GlobalAttacks from './GlobalAttacks.svelte'
  import TargetedAttacks from './TargetedAttacks.svelte'

  let selected: 'attacks' | 'inventory' = 'attacks'

  const { machine } = getGameContext()

  const side = useSelector(machine.service, (state) => getCurrentUser(state.context).side)
</script>

<div class="info-panel">
  <nav>
    <button
      class="unstyled"
      class:active={selected === 'attacks'}
      on:click={() => (selected = 'attacks')}
    >
      <AttacksIcon />
    </button>
    <button
      class="unstyled"
      class:active={selected === 'inventory'}
      on:click={() => (selected = 'inventory')}
    >
      <InventoryIcon />
    </button>
  </nav>

  <div class="content">
    {#if selected === 'attacks'}
      {#if $side === 'attack'}
        <TargetedAttacks />
      {:else}
        <GlobalAttacks />
      {/if}
    {:else if selected === 'inventory'}
      <Inventory />
    {/if}
  </div>
</div>

<style lang="postcss">
  .info-panel {
    display: flex;
    margin-left: 0.375rem;
    height: 22.5rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    button {
      border-radius: var(--radius-md);
      border-top-right-radius: 0rem;
      border-bottom-right-radius: 0rem;
      background-color: var(--color-blue-transp-12);
      padding: 0.3125rem;
      width: 2.5rem;
      height: 2.5rem;

      &.active {
        background-color: white;
        padding: 0.625rem;
        width: 3.125rem;
        height: 3.125rem;
        color: var(--color-blue-spielbrett);
      }

      :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .content {
    flex: 1;
    border-radius: var(--radius-md);
    border-top-left-radius: 0rem;
    background-color: white;
    padding: 0.75rem 1.25rem;
    max-width: 100%;
    overflow: hidden;
    color: var(--color-blue-spielbrett);
  }
</style>
