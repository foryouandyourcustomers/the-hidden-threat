<script lang="ts">
  export let centered = false
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md'
  export let width: 'default' | 'full' = 'default'
  export let spacing: 'default' | 'none' = 'default'
</script>

<p class="size-{size} width-{width} spacing-{spacing}" class:centered><slot /></p>

<style lang="postcss">
  p {
    margin: 0;
    &.width-default {
      max-width: 44rem;
    }

    &.spacing-default {
      margin-block: 1.5rem;
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
  .size-xs {
    font: var(--text-small);
    font-size: var(--scale-000);
  }
</style>
