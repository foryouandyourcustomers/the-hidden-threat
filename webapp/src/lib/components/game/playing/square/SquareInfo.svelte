<script>
  import Item from '$lib/components/icons/Item.svelte'
  import { fade } from 'svelte/transition'
</script>

<div class="tooltip" in:fade={{ duration: 200, delay: 600 }} out:fade={{ duration: 100 }}>
  <div>
    <Item itemId="extinguisher" />
    <div>Feuerlöscher</div>
  </div>
</div>

<style lang="postcss">
  .tooltip {
    position: absolute;
    top: 100%;
    z-index: var(--layer-top);
    background: white;
    color: var(--color-black-dark);
  }
</style>
