<script lang="ts">
  import Stage from '$lib/components/icons/Stage.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import isEqual from 'lodash/isEqual'

  export let coordinate: [number, number]

  const stage = BOARD_SUPPLY_CHAINS.flat().filter((stage) =>
    isEqual(stage.coordinate, coordinate),
  )[0]
</script>

{#if stage}
  <div class="stage">
    <Stage stageId={stage.id} />
  </div>
{/if}

<style lang="postcss">
  .stage {
    position: absolute;
    inset: 0;
  }
</style>
