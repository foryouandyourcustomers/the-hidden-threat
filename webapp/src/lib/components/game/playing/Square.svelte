<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Face from '$lib/components/icons/Face.svelte'
  import Item from '$lib/components/icons/Item.svelte'
  import { getCurrentGameState } from '$lib/game/game-state'
  import type { Coordinate, PlayerId, SharedGameContext } from '$lib/game/types'
  import { getPlayer } from '$lib/game/utils'
  import isEqual from 'lodash/isEqual'

  export let columnIndex: number
  export let rowIndex: number

  const coordinate: [number, number] = [columnIndex, rowIndex]

  const { machine } = getGameContext()

  const items = useSelector(
    machine.service,
    ({ context }) => context.items.filter((item) => isEqual(item.position, coordinate)),
    isEqual,
  )

  const players = useSelector(
    machine.service,
    ({ context }) => {
      const { playerPositions } = getCurrentGameState(context)

      return Object.entries(playerPositions)
        .filter(([_, position]) => isEqual(position, coordinate))
        .map(([playerId]) => getPlayer(playerId as PlayerId, context))
    },
    isEqual,
  )

  const isPossibleMove = useSelector(machine.service, (state) => {
    const readyToMove = state.matches('Playing.Gameloop.Playing.Ready to move')
    if (!readyToMove) return false
    const { context } = state
    // Ok, this player is ready to move. But is this square a valid move?
    const gameState = getCurrentGameState(context)
    const currentPosition = gameState.playerPositions[gameState.activePlayerId]
    const xDiff = Math.abs(currentPosition[0] - columnIndex)
    const yDiff = Math.abs(currentPosition[1] - rowIndex)
    return xDiff + yDiff <= 2 && xDiff + yDiff != 0
  })

  const getMoveEvent = (
    to: Coordinate,
    context: SharedGameContext,
  ): ClientEventOf<'apply game event'> => {
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'move',
        finalized: true,
        playerId: getCurrentGameState(context).activePlayerId,
        to,
      },
    }
  }

  const canMove = useSelector(machine.service, (state) =>
    state.can(getMoveEvent(coordinate, machine.service.getSnapshot().context)),
  )

  const move = () => {
    machine.send(getMoveEvent(coordinate, machine.service.getSnapshot().context))
  }
</script>

<div
  class="square"
  style:--_row={rowIndex + 1}
  style:--_column={columnIndex + 1}
  class:possible-move={$isPossibleMove}
>
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
  {#if $canMove && $isPossibleMove}
    <button on:click={move}>MOVE</button>
  {/if}
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
    &.possible-move {
      border: 2px solid red;
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
