<script>
  import { navigating } from '$app/stores'
</script>

<header>
  <nav>
    <a href="/">home</a>
    <a href="/contact">contact</a>
    <a href="/help">help</a>
  </nav>
</header>

<main>
  {#if $navigating}
    Loading...
  {:else}
    <slot />
  {/if}
</main>

<footer>
  <nav>
    <a href="/">home</a>
    <a href="/help">help</a>
  </nav>
</footer>
