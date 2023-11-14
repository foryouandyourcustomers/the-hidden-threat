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
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import { getStage } from '$lib/game/utils'

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

  const stage = getStage(
    BOARD_SUPPLY_CHAINS.flat().filter((stage) => isEqual(stage.coordinate, coordinate))[0]?.id,
  )

  const positionClass = `${coordinate[1] < 4 ? 'bottom' : 'top'} ${
    coordinate[0] < 1 ? 'right' : coordinate[0] < 8 ? 'center' : 'left'
  }`

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

<ul class="tooltip {positionClass}" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
  {#if stage}
    <li>
      <div class="stage">{stage.name}</div>
      <div class="stage-items">
        {#each stage.defenseItems as itemId}
          <div class="icon">
            <Item {itemId} />
          </div>
        {/each}
      </div>
    </li>
  {/if}
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
  <svg class="arrow" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0H0l5.3 8.3a2 2 0 0 0 3.4 0L14 0Z" fill="#fff" />
  </svg>
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
    flex-direction: column;
    z-index: var(--layer-top);
    border-radius: var(--radius-sm);
    background: white;
    padding: 0.25rem 0.75rem;
    /* width: max-content; */
    color: var(--color-black-dark);

    &.top {
      bottom: 105%;
      .arrow {
        bottom: -0.6rem;
      }
    }

    &.bottom {
      top: 105%;
      .arrow {
        top: -0.6rem;
        rotate: 0.5turn;
      }
    }

    &.left {
      right: 10%;
      .arrow {
        right: 2rem;
      }
    }
    &.center {
      left: 50%;
      translate: -50% 0;
      .arrow {
        left: 50%;
        translate: -50% 0;
      }
    }

    &.right {
      left: 10%;
      .arrow {
        left: 2rem;
      }
    }

    li {
      padding-block: 0.5rem;
      &:not(:last-of-type) {
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

  .stage {
    font-weight: 700;
  }

  .stage-items {
    display: flex;
    gap: 0.75rem;
    padding-bottom: 1rem;

    .icon {
      display: block;
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .arrow {
    display: block;
    position: absolute;
    width: 0.875rem;
    height: 0.625rem;
    /* Positioning is done in individual position (left, right) */
  }
</style>
