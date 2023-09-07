<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate, SharedGameContext } from '$lib/game/types'
  import Items from './Items.svelte'
  import Players from './Players.svelte'
  import Stage from './Stage.svelte'

  export let coordinate: [number, number]

  const { machine } = getGameContext()

  const isPossibleMove = useSelector(machine.service, (state) => {
    const moving = state.matches('Playing.Gameloop.Playing.Moving')
    if (!moving) return false
    // Ok, this player is moving. But is this square a valid move?
    const gameState = GameState.fromContext(state.context)
    return gameState.isValidMove(coordinate)
  })

  const isPossiblePlacement = useSelector(machine.service, (state) => {
    const placing = state.matches('Playing.Gameloop.Playing.Placing')
    if (!placing) return false
    const gameState = GameState.fromContext(state.context)
    return gameState.isValidPlacement(coordinate)
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

<div class="square" style:--_row={coordinate[1] + 1} style:--_column={coordinate[0] + 1}>
  <Stage {coordinate} />
  <Items {coordinate} />
  <Players {coordinate} />
  {#if $canMove && $isPossibleMove}
    <button class="move-button unstyled" on:click={move}><span>Move</span></button>
  {/if}
  {#if $canPlace && $isPossiblePlacement}
    <button class="move-button unstyled" on:click={place}><span>Place</span></button>
  {/if}
</div>

<style lang="postcss">
  .square {
    --_inactive-opacity: 0;
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
