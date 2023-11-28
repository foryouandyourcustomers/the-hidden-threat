<script lang="ts">
  export let align: 'left' | 'right' = 'right'
  export let spacing: 'default' | 'dialog' | 'none' = 'default'
</script>

<div class="actions align-{align} spacing-{spacing}">
  <slot />
</div>

<style lang="postcss">
  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    &.spacing-default {
      margin-top: 2.5rem;
    }
    &.spacing-dialog {
      margin-top: 1.5rem;
    }
    &.align-left {
      justify-content: flex-start;
    }
    &.align-right {
      justify-content: flex-end;
    }
  }
</style>
