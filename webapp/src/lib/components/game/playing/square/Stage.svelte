<script lang="ts">
  import Stage from '$lib/components/icons/Stage.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import { getStage } from '$lib/game/utils'
  import isEqual from 'lodash/isEqual'

  export let coordinate: [number, number]

  const stage = BOARD_SUPPLY_CHAINS.flat().filter((stage) =>
    isEqual(stage.coordinate, coordinate),
  )[0]

  $: stageName = stage?.id ? getStage(stage.id).name : ''
</script>

{#if stage}
  <div class="stage">
    <div class="icon"><Stage stageId={stage.id} /></div>
    <div class="name">{stageName}</div>
  </div>
{/if}

<style lang="postcss">
  .stage {
    background: url('data:image/svg+xml;utf8,<svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M70.2 79.6a791.4 791.4 0 0 0-54-.1c-1.7.2-3 .2-4 0s-1.5-.5-1.7-.7a.9.9 0 0 1-.2-.8v-.2l1.2-63.6c0-.5.1-1 .4-1.5.4-.5.9-.9 1.8-1a1316.6 1316.6 0 0 1 59.5-1.4h2.1l2.1.2c.6 0 1 .2 1.3.3.4.3.9.8 1 2.6.5 17.6-1 62.7-1 64.5v.1s0 .3-.3.6c-.3.2-.8.6-1.7.8a37.7 37.7 0 0 1-6.5.3Z" fill="%23D8E0E3"  stroke="black" stroke-width="2.5" /></svg>');
    background-size: cover;
  }
  .stage {
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    inset: 0;
    padding: 1rem;
    color: var(--color-black-dark);
  }
  .icon {
    aspect-ratio: 1;
    height: 2.75rem;
  }
  .name {
    flex-shrink: 0;
    max-width: 100%;
    overflow-x: hidden;
    font-size: var(--scale-0000);
    line-height: 1.2;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
