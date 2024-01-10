<script>
  import Face from '$lib/components/icons/Face.svelte'
  import Lyons from '$lib/components/icons/Lyons.svelte'
</script>

<header>
  <div>
    <nav>
      <svg
        class="polygons"
        width="860"
        height="372"
        viewBox="0 0 860 372"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2302_5336)">
          <path d="M521 372L372 -190L48 -19L521 372Z" fill="#A40224" />
          <path d="M521 372L860 54L372 -190L521 372Z" fill="#D32746" />
          <path d="M521 372L48 -19L0 343L521 372Z" fill="#F03A50" />
        </g>
        <defs>
          <clipPath id="clip0_2302_5336">
            <rect width="860" height="372" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <h1 class="name">
        <a href="/">The<br />hidden<br />threat</a>
        <div class="faces">
          <Face faceId={1} />
          <Face faceId={2} />
          <Face faceId={3} />
          <Face faceId={4} />
        </div>
      </h1>

      <Lyons />
    </nav>
  </div>
</header>

<style lang="postcss">
  header {
    isolation: isolate;
    height: 14rem;

    @media (min-width: 78rem) {
      height: 0;
    }

    & > div {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      padding-inline: var(--size-content-px);
      padding-block: 1rem;
    }
  }
  .polygons {
    position: absolute;
    top: -2rem;
    left: -29rem;
    rotate: -40deg;
    z-index: -1;
    max-width: none;
  }
  nav {
    display: flex;
    position: relative;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0;
    padding-top: 1.5rem;

    .name {
      & a {
        font: var(--display-h1);
        font-size: 2.5rem;
        line-height: 1;
        text-decoration: none;
        text-transform: uppercase;
      }
      .faces {
        display: flex;
        margin-top: 1.2rem;
        :global(svg) {
          width: 2.3rem;
        }
      }
    }
  }
</style>
