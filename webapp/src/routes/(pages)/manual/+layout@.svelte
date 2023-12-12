<div class="manual">
  <slot />
</div>

<style lang="postcss">
  .manual {
    --_nav-width: 21rem;
    --_nav-height: 20vh;
    display: grid;
    grid-template-columns: var(--_nav-width) [main-start] 1fr [main-end];
    gap: 1rem;
    background: white;
    color: black;
    @media (max-width: 800px) {
      grid-template-rows: var(--_nav-height) 1fr;
      grid-template-columns: 1fr;
      grid-template-areas:
        'nav'
        'main';
    }
    :global(nav.toc) {
      position: fixed;
      inset: 0 auto 0 0;
      background: var(--color-white-80);
      padding: 3rem 2rem;
      width: var(--_nav-width);
      overflow-y: auto;
      @media (max-width: 800px) {
        width: 100%;
        height: var(--_nav-height);
      }
      &::before {
        display: block;
        margin-bottom: 1rem;
        content: 'Übersicht';
        font-weight: 500;
        font-size: var(--scale-2);
        text-transform: uppercase;
      }
    }
    :global(nav.toc ol) {
      margin: 0 0 0 1rem;
      padding: 0;
      list-style: none;
    }

    :global(nav.toc .toc-link-h1) {
      padding-top: 0.75rem;
      text-transform: uppercase;
    }

    :global(nav.toc ol a) {
      display: block;
      margin-block: 0.25rem;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    :global(main) {
      grid-area: main;
      justify-self: center;
      padding: 1rem 1rem 10rem;
      max-width: min(100%, 72ch);
    }
    :global(main h1) {
      margin-block: 3rem 1.5rem;
      font: var(--display-h1);
      text-transform: uppercase;
    }
    :global(main h2) {
      margin-top: 1.5rem;
      font: var(--display-h5);
    }
  }
</style>
