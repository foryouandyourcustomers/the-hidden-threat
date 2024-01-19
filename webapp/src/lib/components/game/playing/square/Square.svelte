<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { clickOutside } from '$lib/actions/click-outside'
  import { getGameContext } from '$lib/client/game-context'
  import SquareInfo from '$lib/components/game/playing/square/SquareInfo.svelte'
  import StageStatus from '$lib/components/icons/StageStatus.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate } from '$lib/game/types'
  import Items from './Items.svelte'
  import Players from './Players.svelte'
  import Stage from './Stage.svelte'

  export let coordinate: Coordinate

  const { machine } = getGameContext()

  const isDefended = useSelector(machine.service, (state) =>
    GameState.fromContext(state.context).isDefended(coordinate),
  )

  const isAttacked = useSelector(machine.service, (state) =>
    GameState.fromContext(state.context).isAttacked(coordinate),
  )

  let showInfo = false

  const toggleInfo = () => (showInfo = !showInfo)

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      showInfo = false
    }
  }
</script>

<svelte:body on:keydown={onKeydown} />

<div
  class="square"
  class:with-info={showInfo}
  style:--_row={coordinate[1] + 1}
  style:--_column={coordinate[0] + 1}
  use:clickOutside
  on:outclick={() => (showInfo = false)}
>
  <div class="content">
    <Stage {coordinate} />
    <Items {coordinate} />
    <Players {coordinate} />

    <button class="info-button unstyled" on:click={toggleInfo}><span>Show info</span></button>

    {#if $isDefended || $isAttacked}
      <div class="status">
        {#if $isDefended}
          <StageStatus status="defended" />
        {:else if $isAttacked}
          <StageStatus status="attacked" />
        {/if}
      </div>
    {/if}
  </div>

  {#if showInfo}
    <SquareInfo
      {coordinate}
      isDefended={$isDefended}
      isAttacked={$isAttacked}
      on:close={() => (showInfo = false)}
    />
  {/if}
</div>

<style lang="postcss">
  .square {
    --_inactive-opacity: 0;
    display: block;
    position: relative;
    grid-row: var(--_row);
    grid-column: var(--_column);
    min-width: 0;
    min-height: 0;

    .content {
      position: absolute;
      z-index: var(--layer-grid-square);
      inset: 0;
    }

    &.with-info .content {
      z-index: var(--layer-grid-square-with-info);
    }

    > * {
      min-width: 0;
      min-height: 0;
    }
  }

  .info-button {
    display: block;
    position: absolute;
    z-index: var(--layer-top);
    transition: background 0.3s ease-out;
    cursor: default;
    inset: 0;
    background: transparent;
    width: 100%;
    height: 100%;
    & span {
      display: none;
    }
    &:hover {
      transition-duration: 0ms;
      background: #fff2;
    }
  }

  .status {
    position: absolute;
    inset: 0;
    background-color: color-mix(in oklab, var(--color-blue-spielbrett), transparent 30%);
    pointer-events: none;
    :global(svg) {
      position: absolute;
      top: 0.125rem;
      right: 0.125rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>
