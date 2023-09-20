<script lang="ts">
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import type { Side } from '$lib/game/types'

  export let selected = false
  export let disabled = false
  export let side: Side
</script>

<button class:selected {disabled} class="unstyled {side}" on:click>
  <Polygon color={side === 'attack' ? 'red' : 'orange'} />

  <span>
    <slot />
  </span>
</button>

<style lang="postcss">
  button {
    text-wrap: nowrap;
    display: flex;
    position: relative;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-radius: var(--radius-xs);
    isolation: isolate;
    padding: 0.5rem 0;
    width: 3.625rem;
    height: 5.25rem;
    color: white;
    font-weight: bold;
    font-size: var(--scale-0000);
    text-align: center;

    :global(svg) {
      position: absolute;
      z-index: -1;
      inset: 0.75rem 0.25rem auto;
    }

    span {
      display: block;
    }

    &.attack {
      background-color: var(--color-red-polygon);
    }
    &.defense {
      background-color: var(--color-orange-dark);
    }
    &.selected {
      box-shadow: 0px 0px 8px 0px rgba(88, 90, 90, 0.4);
      width: 4rem;
      height: 5.875rem;
    }
  }
</style>
