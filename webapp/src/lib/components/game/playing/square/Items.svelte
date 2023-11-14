<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import { BOARD_ITEMS } from '$lib/game/constants/board-items'
  import { isAttackItemId } from '$lib/game/constants/items'
  import isEqual from 'lodash/isEqual'
  import ItemPolygon from './ItemPolygon.svelte'

  export let coordinate: [number, number]

  const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate))
</script>

{#each items as item}
  <div class="item">
    <ItemPolygon side={isAttackItemId(item.id) ? 'attack' : 'defense'} />
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
    > :global(svg) {
      position: absolute;
    }

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
