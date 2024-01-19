<div class="header">
  <div class="backdrop">
    <svg
      width="346"
      height="53"
      viewBox="0 0 346 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M45 0H0l54 53-9-53Z" fill="#F03A50" />
      <path d="M45 0h33L54 53 45 0Z" fill="#A40224" />
      <path d="M346 38 330 0H78L54 53l292-15Z" fill="#D32746" />
    </svg>
  </div>
  <div class="title">The hidden threat</div>

  <slot />
</div>

<style lang="postcss">
  .header {
    display: grid;
    position: relative;
    grid-template-columns: 38rem 22rem 1fr auto;
    grid-template-areas: 'logo score jokers options';
    align-items: center;
    background: linear-gradient(to bottom, #2b344800, #2b3448a9),
      linear-gradient(to bottom, var(--color-blue-spielbrett), var(--color-blue-spielbrett));

    padding-inline: 7rem 1rem;
    height: var(--size-header-height);
  }
  .title {
    position: relative;
    grid-area: logo;
    align-self: start;
    font-size: var(--scale-4);
    line-height: 2.5rem;
    font-family: var(--font-display);
    text-transform: uppercase;
  }
  .backdrop {
    position: absolute;
    top: 0rem;
    left: 1.875rem;
    width: 21.625rem;
    height: 3.3125rem;
  }
</style>
