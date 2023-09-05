<script lang="ts">
  export let disabled = false
</script>

<button class="unstyled" {disabled} on:click><slot /></button>

<style lang="postcss">
  button {
    width: 1.5rem;
    height: 1.5rem;
    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
