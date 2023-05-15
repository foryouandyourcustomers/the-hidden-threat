<div class="centered">
  <slot />
</div>

<style lang="postcss">
  .centered {
    display: grid;
    place-content: center;
    min-height: 100%;
  }
</style>
