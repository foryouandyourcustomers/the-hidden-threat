<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import type { Coordinate, SharedGameContext } from '$lib/game/types'
  import { fade } from 'svelte/transition'
  import ItemPolygon from './ItemPolygon.svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { useSelector } from '$lib/@xstate/svelte'
  import { GameState } from '$lib/game/game-state'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import { createEventDispatcher } from 'svelte'
  import { BOARD_ITEMS } from '$lib/game/constants/board-items'
  import isEqual from 'lodash/isEqual'
  import { getItem, isAttackItemId } from '$lib/game/constants/items'

  export let coordinate: Coordinate
  export let isDefended: boolean
  export let isAttacked: boolean

  const dispatch = createEventDispatcher<{ close: void }>()

  const { machine } = getGameContext()

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

  const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate))

  const isPossibleMove = useSelector(machine.service, (state) => {
    const moving = state.matches('Playing.Gameloop.Playing.Moving')
    if (!moving) return false
    // Ok, this player is moving. But is this square a valid move?
    const gameState = GameState.fromContext(state.context)
    if (!gameState.isValidMove(coordinate)) return false
    return state.can(getMoveEvent(coordinate, machine.service.getSnapshot().context))
  })

  const isPossiblePlacement = useSelector(machine.service, (state) => {
    const placing = state.matches('Playing.Gameloop.Playing.Placing')
    if (!placing) return false
    const gameState = GameState.fromContext(state.context)
    if (!gameState.isValidPlacement(coordinate)) return false
    return state.can(getPlacementEvent(coordinate, machine.service.getSnapshot().context))
  })

  const move = () => {
    machine.send(getMoveEvent(coordinate, machine.service.getSnapshot().context))
    dispatch('close')
  }
  const place = () => {
    machine.send(getPlacementEvent(coordinate, machine.service.getSnapshot().context))
    dispatch('close')
  }
</script>

<ul class="tooltip" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
  {#if isAttacked}
    <li>Stufe ist angegriffen</li>
  {/if}
  {#if isDefended}
    <li>Stufe ist verteidigt</li>
  {/if}
  {#each items as item}
    <li class="item">
      <div class="polygon">
        <ItemPolygon side={isAttackItemId(item.id) ? 'attack' : 'defense'} />
      </div>
      <div class="icon">
        <Item itemId={item.id} />
      </div>
      <span>{getItem(item.id).name}</span>
    </li>
  {/each}

  {#if $isPossibleMove}
    <li>
      <button class="unstyled" on:click={move}>Figur hierher bewegen</button>
    </li>
  {/if}
  {#if $isPossiblePlacement}
    <li>
      <button class="unstyled" on:click={place}>Figur hier platzieren</button>
    </li>
  {/if}
</ul>

<style lang="postcss">
  :where(ul, li) {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tooltip {
    display: flex;
    position: absolute;
    top: 110%;
    left: 50%;
    flex-direction: column;
    translate: -50% 0;
    z-index: var(--layer-top);
    border-radius: var(--radius-sm);
    background: white;
    padding: 0.25rem 0.75rem;
    /* width: max-content; */
    color: var(--color-black-dark);

    li {
      padding-block: 0.5rem;
      &:not(:last-child) {
        border-bottom: 1px solid var(--color-white-80);
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }

    .polygon {
      display: block;
      width: 1rem;
      height: 1rem;
    }
    .icon {
      display: block;
      width: 1.75rem;
      height: 1.75rem;
    }
    span {
      display: block;
      /* flex-shrink: 0; */
      /* flex-basis: max-content; */
      font-size: var(--scale-00);
      white-space: nowrap;
    }
  }
  button {
    text-decoration: underline;
    white-space: nowrap;
  }
</style>
