<script lang="ts">
  export let centered = false
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let width: 'default' | 'full' = 'default'
</script>

<p class="size-{size} width-{width}" class:centered><slot /></p>

<style lang="postcss">
  p {
    margin-block: 1.5rem;
    &.width-default {
      max-width: 44rem;
    }
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
