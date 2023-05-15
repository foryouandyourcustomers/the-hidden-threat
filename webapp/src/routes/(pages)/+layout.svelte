<script>
  import { navigating } from '$app/stores'
  import Footer from '$lib/components/layout/Footer.svelte'
  import Header from '$lib/components/layout/Header.svelte'
</script>

<div class="layout">
  <Header />

  <main>
    {#if $navigating}
      Loading...
    {:else}
      <slot />
    {/if}
  </main>

  <Footer />
</div>

<style lang="postcss">
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  main {
    flex: 1;
    padding: var(--size-4) var(--size-content-px);
  }
</style>
