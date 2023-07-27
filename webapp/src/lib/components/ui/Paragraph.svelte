<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md'
</script>

<p class="size-{size}"><slot /></p>

<style lang="postcss">
  p {
    margin-block: 1.5rem;
  }
  .size-md {
    font-size: var(--scale-1);
  }
  .size-lg {
    font-size: var(--scale-2);
  }
  .size-sm {
    font-size: var(--scale-0);
  }
</style>
