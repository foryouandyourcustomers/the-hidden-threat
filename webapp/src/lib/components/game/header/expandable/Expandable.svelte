<script lang="ts">
  import { scale } from 'svelte/transition'
  import OpenButton from './OpenButton.svelte'
  import CloseIcon from '~icons/lucide/x'
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
      <button class="unstyled close-button" on:click={() => (expanded = !expanded)}
        ><CloseIcon /></button
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
      border-radius: var(--radius-sm);
      background: white;
      padding-block: 0.5rem;
      min-width: 11.5rem;
    }

    .close-button {
      position: absolute;
      top: 0.37rem;
      right: 0.37rem;
      :global(svg) {
        display: block;
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
</style>
