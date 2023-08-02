<script lang="ts">
  export let centered = false
  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<p class="size-{size}" class:centered><slot /></p>

<style lang="postcss">
  p {
    margin-block: 1.5rem;
    max-width: 44rem;
  }
  .centered {
    margin-inline: auto;
    text-align: center;
  }
  .size-md {
    font: var(--text-regular);
  }
  .size-lg {
    font: var(--text-big);
  }
  .size-sm {
    font: var(--text-small);
  }
</style>
