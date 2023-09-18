<script lang="ts">
  import { scale } from 'svelte/transition'
  let expanded = false
</script>

<div class="expandable" class:expanded>
  <button class="unstyled icon open-button" on:click={() => (expanded = !expanded)}
    ><slot name="icon" /></button
  >
  {#if expanded}
    <div
      class="content"
      in:scale={{ duration: 150, start: 0.7 }}
      out:scale={{ duration: 150, start: 0.7 }}
    >
      <slot />
    </div>
  {/if}
</div>

<style lang="postcss">
  .expandable {
    position: relative;
    z-index: var(--layer-top);
    isolation: isolate;
    color: black;

    .open-button {
      border-radius: var(--radius-full);
      background: white;
      padding: 0.25rem;
    }

    .icon {
      display: grid;
      place-content: center;
      width: 1.5rem;
      height: 1.5rem;
      :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .content {
      display: flex;
      position: absolute;
      top: 2rem;
      right: 0;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-radius: var(--radius-sm);
      background: white;
      padding-block: 0.5rem;
      min-width: 16rem;
    }
  }
</style>
