<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Face from '$lib/components/icons/Face.svelte'
  import Item from '$lib/components/icons/Item.svelte'
  import isEqual from 'lodash/isEqual'

  export let columnIndex: number
  export let rowIndex: number

  const coordinate = [columnIndex, rowIndex]

  const { machine } = getGameContext()

  const items = useSelector(
    machine.service,
    ({ context }) => context.items.filter((item) => isEqual(item.position, coordinate)),
    isEqual,
  )

  const players = useSelector(
    machine.service,
    ({ context }) =>
      [...context.defense.defenders, context.attack.attacker].filter((player) =>
        isEqual(player.position, coordinate),
      ),

    isEqual,
  )

  // const canMove = useSelector(machine.service, ({context}) => )
</script>

<div class="square" style:--_row={rowIndex + 1} style:--_column={columnIndex + 1}>
  {#each $items as item}
    <div class="item">
      <Item itemId={item.item} />
    </div>
  {/each}
  {#each $players as player}
    <div class="player">
      <Face faceId={player.faceId} />
    </div>
  {/each}
</div>

<style lang="postcss">
  .square {
    display: grid;
    position: relative;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    grid-row: var(--_row);
    grid-column: var(--_column);
    min-width: 0;
    min-height: 0;
    > * {
      min-width: 0;
      min-height: 0;
    }
    &::after {
      position: absolute;
      inset: calc((0px - var(--px)) / 2);
      border: 1px solid #fff2;
      pointer-events: none;
      content: '';
    }
  }
  .player {
    grid-row: 2;
    grid-column: 2;
  }
  .item {
    &:nth-child(1) {
      grid-row: 1;
      grid-column: 1;
    }
    &:nth-child(2) {
      grid-row: 3;
      grid-column: 3;
    }
  }
  .item,
  .player {
    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
