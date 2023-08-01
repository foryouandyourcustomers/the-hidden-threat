<script lang="ts">
  import CloseIcon from '$lib/components/icons/Close.svelte'
  import Heading from './Heading.svelte'

  export let open = false
  export let title = ''

  let element: HTMLDialogElement

  $: if (element) {
    if (open) {
      element.showModal()
    } else {
      element.close()
    }
  }

  const close = () => {
    element.close()
  }
</script>

<dialog bind:this={element} on:close>
  <Heading separator>
    {#if title}{title}{/if}

    <button class="unstyled close-button" slot="info" on:click={close}><CloseIcon /></button>
  </Heading>
  <slot />
</dialog>

<style lang="postcss">
  dialog {
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
  dialog::backdrop {
    opacity: 0.85;
    background-color: var(--color-bg);
  }
</style>
