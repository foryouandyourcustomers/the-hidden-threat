<script lang="ts">
  import Header from './header/Header.svelte'

  export let reportMousePosition: ((position: [number, number]) => void) | undefined = undefined

  export let showBackdrop = false
  export let paddedContent = false

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
</script>

<svelte:window on:resize={onResize} bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="board-wrapper" style:--board-scale={scale}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="board"
    class:backdrop={showBackdrop}
    on:mousemove={onMouseMove}
    bind:this={gameContainer}
    bind:clientWidth={boardWidth}
    bind:clientHeight={boardHeight}
  >
    <Header><slot name="header" /></Header>
    <div class="content" class:padded={paddedContent}><slot /></div>
    <slot name="overlays" />
  </div>
</div>

<style lang="postcss">
  .board-wrapper {
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
    gap: 1rem;
    transform-origin: center;
    scale: var(--board-scale);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    width: var(--size-game-width);
    height: var(--size-game-height);
    overflow: hidden;

    &.backdrop {
      background-image: url('/images/board-backdrop.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .content {
    isolation: isolate;
    &.padded {
      padding: 4rem 7rem;
    }
  }
</style>
