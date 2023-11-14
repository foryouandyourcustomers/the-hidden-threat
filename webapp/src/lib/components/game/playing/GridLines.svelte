<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 8">
  {#each new Array(10) as _, x}
    <path d="M {x} 0 L {x} 8" stroke="white" stroke-width="0.01" stroke-dasharray="0.02 0.02" />
  {/each}

  {#each new Array(9) as _, y}
    <path d="M 0 {y} L 9 {y}" stroke="white" stroke-width="0.01" stroke-dasharray="0.02 0.02" />
  {/each}
</svg>

<style lang="postcss">
  svg {
    display: block;
    position: absolute;
    z-index: var(--layer-grid-lines);
    inset: 0;
    max-width: none;
    pointer-events: none;
  }
</style>
