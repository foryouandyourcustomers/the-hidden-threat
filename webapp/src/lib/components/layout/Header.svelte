<header>
  <nav>
    <a href="/">Home</a>
    <a href="/help">Hilfe</a>
  </nav>
</header>

<style lang="postcss">
  header {
    padding: var(--size-4) var(--size-content-px);
  }
  nav {
    display: flex;
    gap: var(--size-2);
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    &:not(:first-child)::before {
      display: inline-block;
      margin-right: var(--size-2);
      content: '/';
      color: var(--color-grey-400);
      font-size: var(--scale-000);
    }
  }
</style>
