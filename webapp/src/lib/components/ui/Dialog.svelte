<script lang="ts">
  import CloseIcon from '$lib/components/icons/Close.svelte'
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
    <Heading separator>
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
    inset: 0;
  }

  .backdrop {
    position: absolute;
    opacity: 0.85;
    inset: 0;
    background-color: var(--color-bg);
  }

  .dialog {
    position: relative;
    margin: auto;
    box-shadow: 0px 0px 30px 0px var(--color-shadow-secondary);
    border: none;
    border-radius: var(--radius-md);
    background-color: var(--color-bg-secondary);
    padding: 1.5rem;
  }
  .close-button {
    :global(svg) {
      display: block;
    }
  }
</style>
