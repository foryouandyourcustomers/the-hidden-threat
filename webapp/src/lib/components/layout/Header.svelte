<header>
  <nav>
    <a href="/">Home</a>
    <a href="/help">Hilfe</a>
  </nav>
</header>

<style lang="postcss">
  header {
    padding: 1rem var(--size-content-px);
  }
  nav {
    display: flex;
    gap: 0.5rem;
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    &:not(:first-child)::before {
      display: inline-block;
      margin-right: 0.5rem;
      content: '/';
      color: var(--color-grey-400);
      font-size: var(--scale-000);
    }
  }
</style>
