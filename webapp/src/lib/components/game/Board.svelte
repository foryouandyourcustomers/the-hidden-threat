<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { onMount } from 'svelte'
  import { readable } from 'svelte/store'
  import FooterNav from '../layout/FooterNav.svelte'
  import Header from './header/Header.svelte'

  export let reportMousePosition: ((position: [number, number]) => void) | undefined = undefined

  export let showBackdrop = false
  export let showFooter = false
  export let paddedContent = false

  // Because this component is used in the onboarding process, we need to make
  // sure that the game context is available.
  const gameContext = getGameContext()

  const adminSide = gameContext
    ? useSelector(gameContext.machine.service, ({ context }) => {
        const user = getCurrentUser(context)
        if (!user.isAdmin) return undefined
        else return user.side
      })
    : readable(undefined)

  let gameContainer: HTMLDivElement
  let boardWidth = 1
  let boardHeight = 1

  let windowWidth = 1
  let windowHeight = 1

  let scale = 1

  const onMouseMove = (e: MouseEvent) => {
    if (!reportMousePosition) return
    const x = (e.clientX - gameContainer.offsetLeft) / boardWidth
    const y = (e.clientY - gameContainer.offsetTop) / boardHeight
    reportMousePosition([(x - (1 - scale) / 2) / scale, (y - (1 - scale) / 2) / scale])
  }

  const onResize = () => {
    scale = Math.min(windowWidth / (boardWidth + 20), windowHeight / (boardHeight + 20))

    if (scale >= 1.3) scale = 1.3
    else scale = Math.min(scale, 1)
  }

  onMount(onResize)
</script>

<svelte:window on:resize={onResize} bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="board-wrapper" style:--board-scale={scale}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="board {$adminSide ? `side-${$adminSide}` : ''}"
    class:backdrop={showBackdrop}
    class:with-footer={showFooter}
    on:mousemove={onMouseMove}
    bind:this={gameContainer}
    bind:clientWidth={boardWidth}
    bind:clientHeight={boardHeight}
  >
    <Header><slot name="header" /></Header>
    <div class="content" class:padded={paddedContent}><slot /></div>
    <slot name="overlays" />
    {#if showFooter}
      <div class="footer">
        <FooterNav />
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .board-wrapper {
    --player-status-width: 30rem;
    display: grid;
    place-content: center;
    background: black;
    /* padding: 0.5rem; */
    width: 100%;
    height: 100%;
  }
  .board {
    display: grid;
    position: relative;
    grid-template-rows: auto 1fr;
    gap: 0.75rem;
    transform-origin: center;
    scale: var(--board-scale);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    width: var(--size-game-width);
    height: var(--size-game-height);
    overflow: hidden;

    &.with-footer {
      grid-template-rows: auto 1fr auto;
    }

    &.side-defense {
      outline: 10px solid var(--color-blue-medium);
    }
    &.side-attack {
      outline: 10px solid var(--color-red-medium);
    }

    &.backdrop {
      background-image: url('/images/board-backdrop.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .content {
    isolation: isolate;
    overflow: hidden;
    &.padded {
      padding: 1rem 7rem 0;
    }
  }

  .footer {
    display: flex;
    justify-content: stretch;
    align-items: center;
    z-index: var(--layer-top);
    background-color: var(--color-blue-spielbrett);
    background: linear-gradient(to top, rgba(43, 52, 72, 0) 40.63%, rgba(43, 52, 72, 0.66) 100%);
    padding: 0 7rem;
    height: 3.75rem;
    > :global(*) {
      flex: 1;
    }
  }
</style>
