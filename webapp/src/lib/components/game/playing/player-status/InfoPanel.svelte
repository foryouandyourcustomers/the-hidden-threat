<script lang="ts">
  import Inventory from '$lib/components/game/playing/player-status/Inventory.svelte'
  import InventoryIcon from '$lib/components/game/playing/player-status/InventoryIcon.svelte'
  import ScenariosIcon from '$lib/components/game/playing/player-status/ScenariosIcon.svelte'
  import Scenarios from './Scenarios.svelte'

  let selected: 'scenarios' | 'inventory' = 'scenarios'
</script>

<div class="info-panel">
  <nav>
    <button
      class="unstyled"
      class:active={selected === 'scenarios'}
      on:click={() => (selected = 'scenarios')}
    >
      <ScenariosIcon />
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
    {#if selected === 'scenarios'}
      <Scenarios />
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
    padding: 1.25rem;
    max-width: 100%;
    overflow: hidden;
    color: var(--color-blue-spielbrett);
  }
</style>
