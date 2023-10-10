<script lang="ts">
  import Backdrop from '$lib/components/game/playing/Backdrop.svelte'
  import GridLines from '$lib/components/game/playing/GridLines.svelte'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants/general'
  import Dimming from './Dimming.svelte'
  import HighlightedFields from './HighlightedFields.svelte'
  import StageLines from './StageLines.svelte'
  import Square from './square/Square.svelte'
</script>

<div class="grid">
  <Backdrop />
  <StageLines />

  {#each [...new Array(ROW_COUNT)] as _, y}
    {#each [...new Array(COLUMN_COUNT)] as _, x}
      <Square coordinate={[x, y]} />
    {/each}
  {/each}
  <GridLines />
  <Dimming />
  <HighlightedFields />
</div>

<style lang="postcss">
  .grid {
    display: grid;
    position: relative;
    grid-template-rows: repeat(var(--row-count), 1fr);
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 0;
    width: var(--grid-width);
    height: var(--grid-height);
  }
</style>
