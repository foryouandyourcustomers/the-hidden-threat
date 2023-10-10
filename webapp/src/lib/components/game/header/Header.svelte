<script>
</script>

<div class="header">
  <div class="title">The hidden threat</div>

  <slot />
</div>

<style lang="postcss">
  .header {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, #2b344800, #2b3448a9);
    padding-inline: 3rem 1rem;
    height: var(--size-header-height);
  }
  .title {
    font: var(--display-h2);
    font-size: var(--scale-4);
    text-transform: uppercase;
  }
</style>
