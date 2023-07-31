<script lang="ts">
  export let columnIndex: number
  export let rowIndex: number
</script>

<div style:--_row={rowIndex + 1} style:--_column={columnIndex + 1}>
  {columnIndex + 1}/{rowIndex + 1}
</div>

<style lang="postcss">
  div {
    grid-row: var(--_row);
    grid-column: var(--_column);
    background: #2223;
  }
</style>
