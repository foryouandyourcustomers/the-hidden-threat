<script lang="ts">
  import Backdrop from '$lib/components/game/playing/Backdrop.svelte'
  import Square from './Square.svelte'
  const columnCount = 9
  const rowCount = 8
</script>

<div class="board" style:--column-count={columnCount} style:--row-count={rowCount}>
  <Backdrop />
  {#each [...new Array(rowCount)] as _, rowIndex}
    {#each [...new Array(columnCount)] as _, columnIndex}
      <Square {columnIndex} {rowIndex} />
    {/each}
  {/each}
</div>

<style lang="postcss">
  .board {
    display: grid;
    grid-template-rows: repeat(var(--row-count), 1fr);
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 0;
    margin: 0 auto;
    aspect-ratio: var(--column-count) / var(--row-count);
    max-width: 80%;
    max-height: 100%;
  }
</style>
