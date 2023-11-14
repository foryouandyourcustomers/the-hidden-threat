<script lang="ts">
  import { scale } from 'svelte/transition'
  import OpenButton from './OpenButton.svelte'
  let expanded = false
</script>

<div class="expandable" class:expanded>
  <OpenButton on:click={() => (expanded = !expanded)}><slot name="icon" /></OpenButton>
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
