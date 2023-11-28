<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import CloseIcon from '~icons/lucide/x'

  export let title = ''

  const dispatch = createEventDispatcher<{ close: void }>()

  const close = () => {
    dispatch('close')
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      close()
    }
  }
</script>

<div class="dialog-wrapper">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="backdrop" on:click={close} />
  <div class="dialog">
    {#if title}<h2>{title}</h2>{/if}
    <button class="unstyled close-button" on:click={close}><CloseIcon /></button>
    {#if $$slots.default}
      <div class="content">
        <slot />
      </div>
    {/if}
  </div>
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<style lang="postcss">
  h2 {
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.25rem;
    font-family: var(--font-display);
    text-transform: uppercase;
  }

  .dialog-wrapper {
    display: grid;
    position: fixed;
    place-content: center;
    z-index: var(--layer-top);
    inset: 0;
    padding-right: 7.5rem;
    padding-left: var(--player-status-width);
  }

  .backdrop {
    position: absolute;
    opacity: 0.5;
    inset: 0;
    background-color: var(--color-bg);
  }

  .dialog {
    position: relative;
    box-shadow: 0px 0px 30px 0px var(--color-shadow-secondary);
    border: none;
    border-radius: var(--radius-sm);
    background-color: white;
    padding: 0.75rem 1.5rem;
    width: 28.125rem;
    color: black;
  }
  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    :global(svg) {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
</style>
