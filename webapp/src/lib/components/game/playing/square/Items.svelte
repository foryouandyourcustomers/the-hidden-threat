<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import { BOARD_ITEMS } from '$lib/game/constants/board-items'
  import { isAttackItemId } from '$lib/game/constants/items'
  import isEqual from 'lodash/isEqual'
  import ItemPolygon from './ItemPolygon.svelte'
  import { getGameContext } from '$lib/client/game-context'

  export let coordinate: [number, number]

  const { highlightedFields } = getGameContext()

  const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate))
</script>

{#each items as item}
  <div class="item" class:highlight={!!$highlightedFields.items?.includes(item.id)}>
    <ItemPolygon side={isAttackItemId(item.id) ? 'attack' : 'defense'} />
    <div class="icon">
      <Item itemId={item.id} />
    </div>
  </div>
{/each}

<style lang="postcss">
  @keyframes pulsate {
    0%,
    100% {
      scale: 1.2;
    }
    40%,
    60% {
      scale: 1.4;
    }
  }
  .item {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    &.highlight {
      --_color: white;
      scale: 1.4;
      z-index: var(--layer-top);
      animation: pulsate 1s infinite;
      outline: 0.3rem solid #0004;
      border-radius: var(--radius-full);
      background: transparent;
      background: #0004;
    }
    > :global(svg) {
      position: absolute;
    }

    &:nth-child(1) {
      top: 0.5rem;
      left: 0.5rem;
      > :global(svg) {
        top: -0.25rem;
        left: -0.25rem;
      }
    }
    &:nth-child(2) {
      right: 0.5rem;
      bottom: 0.5rem;
      > :global(svg) {
        right: -0.25rem;
        bottom: -0.25rem;
      }
    }
    .icon {
      position: relative;
      :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
