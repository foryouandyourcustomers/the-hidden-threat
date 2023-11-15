<script lang="ts">
  export let vertical = false
</script>

<div class="radio-buttons" class:vertical>
  <slot />
</div>

<style lang="postcss">
  .radio-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.75rem;
    row-gap: 0.25rem;
    max-width: 36rem;
    &.vertical {
      grid-template-columns: 1fr;
    }
  }
</style>
