<div class="radio-buttons">
  <slot />
</div>

<style lang="postcss">
  .radio-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.75rem;
    row-gap: 0.25rem;
  }
</style>
