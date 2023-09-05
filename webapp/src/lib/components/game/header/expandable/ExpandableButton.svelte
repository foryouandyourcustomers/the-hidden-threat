<script lang="ts">
  import { scale } from 'svelte/transition'
  import CloseIcon from '~icons/lucide/x-circle'
  let expanded = false
</script>

<div class="expandable" class:expanded>
  <button class="unstyled icon" on:click={() => (expanded = true)}><slot name="icon" /></button>
  {#if expanded}
    <div
      class="content"
      in:scale={{ duration: 150, start: 0.7 }}
      out:scale={{ duration: 150, start: 0.7 }}
    >
      <slot />
      <button class="unstyled icon close" on:click={() => (expanded = false)}><CloseIcon /></button>
    </div>
  {/if}
</div>

<style lang="postcss">
  .expandable {
    position: relative;
    z-index: var(--layer-5);
    isolation: isolate;
    color: black;

    .icon {
      display: grid;
      place-content: center;
      border-radius: var(--radius-full);
      background: white;
      padding: 0.25rem;
      width: 1.5rem;
      height: 1.5rem;
      :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .close {
      padding: 0;
    }

    .content {
      --_padding: 0.25rem;
      display: flex;
      position: absolute;
      top: calc(0px - var(--_padding));
      right: calc(0px - var(--_padding));
      align-items: center;
      gap: 1rem;
      border-radius: var(--radius-full);
      background: white;
      padding: var(--_padding);
      height: calc(1.5rem + var(--_padding) * 2);
    }
  }
</style>
