<button class="unstyled icon open-button" on:click><slot /></button>

<style lang="postcss">
  .open-button {
    display: grid;
    place-content: center;
    border-radius: var(--radius-full);
    background: white;
    padding: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    :global(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
