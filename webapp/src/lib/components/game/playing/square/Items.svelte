<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import { INITIAL_BOARD_ITEMS, isAttackItemId } from '$lib/game/constants'
  import isEqual from 'lodash/isEqual'

  export let coordinate: [number, number]

  const items = INITIAL_BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate))
</script>

{#each items as item}
  <div class="item">
    {#if isAttackItemId(item.id)}
      <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.3571 26L6.61664 0L4.64282 26H21.3571Z" fill="#51514F" />
        <path d="M21.357 10.7388L6.61658 0L21.357 26V10.7388Z" fill="#292521" />
      </svg>
    {:else}
      <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.9792 26L17.8865 17.8076L5 0L6.9792 26Z" fill="#9C9A9F" />
        <path d="M17.8741 17.814L22 2.25865L5 0L17.8741 17.814Z" fill="#7D797D" />
      </svg>
    {/if}
    <div class="icon">
      <Item itemId={item.id} />
    </div>
  </div>
{/each}

<style lang="postcss">
  .item {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    &:nth-child(1) {
      top: 0.25rem;
      left: 0.25rem;
      .icon {
        top: 0.25rem;
        left: 0.25rem;
      }
    }
    &:nth-child(2) {
      right: 0.25rem;
      bottom: 0.25rem;
      .icon {
        right: 0.25rem;
        bottom: 0.25rem;
      }
    }
    svg {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .icon {
      position: relative;
      :global(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
