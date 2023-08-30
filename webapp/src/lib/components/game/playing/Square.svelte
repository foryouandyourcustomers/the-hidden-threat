<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Face from '$lib/components/icons/Face.svelte'
  import Item from '$lib/components/icons/Item.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate, SharedGameContext } from '$lib/game/types'
  import { getPlayer } from '$lib/game/utils'
  import { objectEntries } from '$lib/utils'
  import isEqual from 'lodash/isEqual'

  export let coordinate: [number, number]

  const { machine } = getGameContext()

  const items = useSelector(
    machine.service,
    ({ context }) => context.items.filter((item) => isEqual(item.position, coordinate)),
    isEqual,
  )

  const players = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)
      const { playerPositions } = gameState

      return objectEntries(playerPositions)
        .filter(([_, position]) => isEqual(position, coordinate))
        .map(([playerId]) => getPlayer(playerId, context))
    },
    isEqual,
  )

  const isMoving = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Ready to move'),
  )
  const isCurrentPosition = useSelector(machine.service, (state) => {
    const readyToMove = state.matches('Playing.Gameloop.Playing.Ready to move')
    if (!readyToMove) return false
    // Ok, this player is ready to move. But is this square a valid move?
    return isEqual(GameState.fromContext(state.context).activePlayerPosition, coordinate)
  })

  const isPossibleMove = useSelector(machine.service, (state) => {
    const readyToMove = state.matches('Playing.Gameloop.Playing.Ready to move')
    if (!readyToMove) return false
    // Ok, this player is ready to move. But is this square a valid move?
    const gameState = GameState.fromContext(state.context)
    return gameState.isValidMove(coordinate)
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
        playerId: GameState.fromContext(context).activePlayer.id,
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
  style:--_row={coordinate[0] + 1}
  style:--_column={coordinate[1] + 1}
  class:possible-move={$isMoving && $isPossibleMove}
  class:impossible-move={$isMoving && !$isPossibleMove}
  class:current-position={$isMoving && $isCurrentPosition}
>
  {#each $items as item}
    <div class="item">
      <Item itemId={item.id} />
    </div>
  {/each}
  {#each $players as player}
    <div class="player">
      <Face faceId={player.faceId} />
    </div>
  {/each}
  {#if $canMove && $isPossibleMove}
    <button class="move-button unstyled" on:click={move}><span>Move</span></button>
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
    margin: calc(var(--px) / 2);
    outline: 1px #fff dashed;
    min-width: 0;
    min-height: 0;
    > * {
      min-width: 0;
      min-height: 0;
    }
    &.impossible-move:not(.current-position) {
      &::after {
        position: absolute;
        opacity: 0.8;
        z-index: var(--layer-5);
        mix-blend-mode: hard-light;
        inset: 0;
        background: var(--color-bg);
        content: '';
      }
    }
    &::after {
      position: absolute;
      inset: calc((0px - var(--px)) / 2);
      /* border: 1px solid #fff2; */
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

  .move-button {
    display: block;
    position: absolute;
    transition: background 0.3s ease-out;
    cursor: pointer;
    inset: 0;
    background: transparent;
    & span {
      display: none;
    }
    &:hover {
      transition-duration: 0ms;
      background: #fff2;
    }
  }
</style>
