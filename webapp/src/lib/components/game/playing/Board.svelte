<script lang="ts">
  import Backdrop from '$lib/components/game/playing/Backdrop.svelte'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants'
  import Square from './Square.svelte'
</script>

<div class="board">
  <Backdrop />
  {#each [...new Array(ROW_COUNT)] as _, y}
    {#each [...new Array(COLUMN_COUNT)] as _, x}
      <Square coordinate={[x, y]} />
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
    width: var(--board-width);
    height: var(--board-height);
  }
</style>
