<script lang="ts">
  export let align: 'left' | 'right' = 'right'
</script>

<div class="actions align-{align}">
  <slot />
</div>

<style lang="postcss">
  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 2.5rem;
    &.align-left {
      justify-content: flex-start;
    }
    &.align-right {
      justify-content: flex-end;
    }
  }
</style>
