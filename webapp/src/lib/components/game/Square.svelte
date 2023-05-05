<script lang="ts">
  export let columnIndex: number
  export let rowIndex: number
</script>

<div>{columnIndex} {rowIndex}</div>

<style lang="postcss">
  div {
    background: var(--color-blue-500);
  }
</style>
