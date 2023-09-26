<script lang="ts">
  import Backdrop from '$lib/components/game/playing/Backdrop.svelte'
  import Grid from '$lib/components/game/playing/Grid.svelte'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants/general'
  import Dimming from './Dimming.svelte'
  import HighlightedFields from './HighlightedFields.svelte'
  import StageLines from './StageLines.svelte'
  import Square from './square/Square.svelte'
</script>

<div class="board">
  <Backdrop />
  <StageLines />

  {#each [...new Array(ROW_COUNT)] as _, y}
    {#each [...new Array(COLUMN_COUNT)] as _, x}
      <Square coordinate={[x, y]} />
    {/each}
  {/each}
  <Grid />
  <Dimming />
  <HighlightedFields />
</div>

<style lang="postcss">
  .board {
    display: grid;
    position: relative;
    grid-template-rows: repeat(var(--row-count), 1fr);
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 0;
    width: var(--board-width);
    height: var(--board-height);
  }
</style>
