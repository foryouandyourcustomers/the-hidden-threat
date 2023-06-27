<script lang="ts">
  export let reportMousePosition: (position: [number, number]) => void

  let gameContainer: HTMLDivElement
  let gameWidth = 1
  let gameHeight = 1

  const onMouseMove = (e: MouseEvent) => {
    reportMousePosition([
      (e.clientX - gameContainer.offsetLeft) / gameWidth,
      (e.clientY - gameContainer.offsetTop) / gameHeight,
    ])
  }
</script>

<div class="game-wrapper">
  <div
    class="game"
    on:mousemove={onMouseMove}
    bind:this={gameContainer}
    bind:clientWidth={gameWidth}
    bind:clientHeight={gameHeight}
  >
    <div class="name">The Hidden Threat</div>
    <div class="players"><slot name="players" /></div>
    <div class="items"><slot name="items" /></div>
    <div class="actions"><slot name="actions" /></div>
    <div class="board"><slot name="board" /></div>
    <slot name="cursor-overlays" />
  </div>
</div>

<style lang="postcss">
  .game-wrapper {
    display: grid;
    align-content: center;
    background: #666;
    /* padding: var(--size-2); */
    width: 100%;
    height: 100%;
    @media (min-aspect-ratio: 4/3) {
      align-content: normal;
      justify-items: center;
    }
  }
  .game {
    display: grid;
    position: relative;
    grid-template-rows: 10% 1fr;
    grid-template-columns: 10% 1fr 1fr;
    grid-template-areas:
      'name players items'
      'actions board board';
    /* container: game / size; */
    background: white;
    aspect-ratio: 4 / 3;
    width: 100%;
    overflow: hidden;
    @media (min-aspect-ratio: 4/3) {
      width: auto;
      height: 100%;
    }
  }
  :global(html) {
    font-size: 1vw;
    @media (min-aspect-ratio: 4/3) {
      font-size: calc(1vh * 4 / 3);
    }
  }
  .name {
    grid-area: 'name';
  }
  .players {
    grid-area: 'players';
  }
  .items {
    grid-area: 'items';
  }
  .actions {
    grid-area: 'actions';
  }
  .board {
    grid-area: 'board';
  }
</style>
