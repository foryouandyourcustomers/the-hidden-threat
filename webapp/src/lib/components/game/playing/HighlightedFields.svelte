<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'

  const { highlightedFields } = getGameContext()
</script>

{#if $highlightedFields.info}
  <div class="highlighted-fields info">
    {#each $highlightedFields.info as coordinates}
      <div class="field" style:--column={coordinates[0] + 1} style:--row={coordinates[1] + 1} />
    {/each}
  </div>
{/if}
{#if $highlightedFields.attacker}
  <div class="highlighted-fields attacker">
    {#each $highlightedFields.attacker as coordinates}
      <div class="field" style:--column={coordinates[0] + 1} style:--row={coordinates[1] + 1} />
    {/each}
  </div>
{/if}
{#if $highlightedFields.reveal}
  <div class="highlighted-fields reveal">
    {#each $highlightedFields.reveal as coordinates}
      <div class="field" style:--column={coordinates[0] + 1} style:--row={coordinates[1] + 1} />
    {/each}
  </div>
{/if}

<style lang="postcss">
  @keyframes pulsate {
    0%,
    100% {
      opacity: 0.2;
    }
    40%,
    60% {
      opacity: 0.7;
    }
  }
  .highlighted-fields {
    display: grid;
    position: absolute;
    grid-template-rows: repeat(var(--row-count), 1fr);
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: 0;
    z-index: var(--layer-grid-highlight);
    inset: 0;
    pointer-events: none;

    &.info {
      --_color: #fcb337;
    }
    &.attacker {
      --_color: var(--color-red-polygon);
    }
    &.reveal {
      --_color: var(--color-red-polygon);
    }

    .field {
      grid-row: var(--row);
      grid-column: var(--column);
      transform-origin: center;
      animation: pulsate 1.8s infinite;
      /* background: var(--_color); */
      /* border: var(--px) solid var(--_color); */
      /* border-radius: var(--radius-xl); */
      background: radial-gradient(transparent 50%, var(--_color) 100%);
      background: radial-gradient(
        color-mix(in oklab, var(--_color), transparent 40%) 50%,
        var(--_color) 100%
      );
    }
  }
</style>
