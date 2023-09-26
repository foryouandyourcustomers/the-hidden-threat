<script lang="ts">
  import CloseIcon from '~icons/lucide/x'
  import { createEventDispatcher } from 'svelte'
  import Heading from './Heading.svelte'

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
    <Heading size="sm">
      {#if title}{title}{/if}

      <button class="unstyled close-button" slot="info" on:click={close}><CloseIcon /></button>
    </Heading>
    <slot />
  </div>
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<style lang="postcss">
  .dialog-wrapper {
    display: grid;
    position: fixed;
    place-content: center;
    z-index: var(--layer-top);
    inset: 0;
    padding-left: 18rem;
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
    border-radius: var(--radius-md);
    background-color: white;
    padding: 0.75rem 1.5rem 1.5rem;
    min-width: 30rem;
  }
  .close-button {
    :global(svg) {
      display: block;
      width: 1rem;
      height: 1rem;
    }
  }
</style>
