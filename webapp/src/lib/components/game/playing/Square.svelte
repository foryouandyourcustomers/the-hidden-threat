<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Item from '$lib/components/icons/Item.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate, SharedGameContext } from '$lib/game/types'
  import { getPlayer, getPlayerSide, getUser } from '$lib/game/utils'
  import { objectEntries } from '$lib/utils'
  import isEqual from 'lodash/isEqual'
  import Player from './Player.svelte'
  import { receive, send } from './transition'

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
      const currentUser = getCurrentUser(context)
      const { playerPositions } = gameState

      return objectEntries(playerPositions)
        .filter(([_, position]) => isEqual(position, coordinate))
        .map(([playerId]) => getPlayer(playerId, context))
        .filter((player) => getPlayerSide(player.id) === currentUser.side)
        .map((player) => {
          const user = getUser(player.userId, context)
          return {
            ...player,
            user,
            side: getPlayerSide(player.id),
            isPlaying: gameState.activePlayer.id === player.id,
          }
        })
    },
    isEqual,
  )

  const isMoving = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Moving'),
  )
  const isPlacing = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Placing'),
  )
  const isCurrentPosition = useSelector(machine.service, (state) => {
    const readyToMove = state.matches('Playing.Gameloop.Playing.Moving')
    if (!readyToMove) return false
    // Ok, this player is ready to move. But is this square a valid move?
    return isEqual(GameState.fromContext(state.context).activePlayerPosition, coordinate)
  })

  const isPossibleMove = useSelector(machine.service, (state) => {
    const readyToMove = state.matches('Playing.Gameloop.Playing.Moving')
    if (!readyToMove) return false
    // Ok, this player is ready to move. But is this square a valid move?
    const gameState = GameState.fromContext(state.context)
    return gameState.isValidMove(coordinate)
  })

  const isPossiblePlacement = useSelector(machine.service, (state) => {
    const placing = state.matches('Playing.Gameloop.Playing.Placing')
    if (!placing) return false
    // FIXME
    return (coordinate[0] + (coordinate[1] % 2)) % 2 == 0
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

  const getPlacementEvent = (
    to: Coordinate,
    context: SharedGameContext,
  ): ClientEventOf<'apply game event'> => {
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'placement',
        finalized: true,
        playerId: GameState.fromContext(context).activePlayer.id,
        coordinate: to,
      },
    }
  }

  const canMove = useSelector(machine.service, (state) =>
    state.can(getMoveEvent(coordinate, machine.service.getSnapshot().context)),
  )
  const canPlace = useSelector(machine.service, (state) =>
    state.can(getPlacementEvent(coordinate, machine.service.getSnapshot().context)),
  )

  const move = () => {
    machine.send(getMoveEvent(coordinate, machine.service.getSnapshot().context))
  }
  const place = () => {
    machine.send(getPlacementEvent(coordinate, machine.service.getSnapshot().context))
  }
</script>

<div
  class="square"
  style:--_row={coordinate[1] + 1}
  style:--_column={coordinate[0] + 1}
  class:possible-move={($isMoving && $isPossibleMove) || ($isPlacing && $isPossiblePlacement)}
  class:impossible-move={($isMoving && !$isPossibleMove) || ($isPlacing && !$isPossiblePlacement)}
  class:current-position={$isMoving && $isCurrentPosition}
>
  {#each $items as item}
    <div class="item">
      <Item itemId={item.id} />
    </div>
  {/each}
  {#each $players as player (`board-player-${player.id}`)}
    <div
      class="player"
      in:receive={{ key: `board-player-${player.id}` }}
      out:send={{ key: `board-player-${player.id}` }}
    >
      <Player
        name={player.user.name}
        side={player.side}
        faceId={player.faceId}
        isPlaying={player.isPlaying}
      />
    </div>
  {/each}
  {#if $canMove && $isPossibleMove}
    <button class="move-button unstyled" on:click={move}><span>Move</span></button>
  {/if}
  {$canPlace}
  {$isPossiblePlacement}
  {#if $canPlace && $isPossiblePlacement}
    <button class="move-button unstyled" on:click={place}><span>Place</span></button>
  {/if}
</div>

<style lang="postcss">
  .square {
    display: block;
    position: relative;
    grid-row: var(--_row);
    grid-column: var(--_column);
    margin: calc(var(--px) / 2);
    outline: 1px #fff dashed;
    isolation: isolate;
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
  }
  .player {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }
  .item {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    &:nth-child(1) {
      top: 0.25rem;
      left: 0.25rem;
    }
    &:nth-child(2) {
      right: 0.25rem;
      bottom: 0.25rem;
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
