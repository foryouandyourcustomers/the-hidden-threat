<script lang="ts">
  import Square from '$lib/components/game/Square.svelte'
  const columnCount = 10
  const rowCount = 8
</script>

<div class="board" style:--column-count={columnCount} style:--row-count={rowCount}>
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
    gap: var(--size-2);
    margin: 0 auto;
    aspect-ratio: var(--column-count) / var(--row-count);
    max-width: 90vw;
    max-height: 90vw;
  }
</style>
