<script>
  import { navigating } from '$app/stores'
  import Footer from '$lib/components/layout/Footer.svelte'
  import Header from '$lib/components/layout/Header.svelte'
  import Partner from './Partner.svelte'
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

  <Partner />
  <Footer />
</div>

<style lang="postcss">
  .layout {
    display: flex;
    position: relative;
    flex-direction: column;
    margin-inline: auto;
    background-color: var(--color-blue-spielbrett);
    max-width: var(--width-2xl);
    min-height: 100%;
    overflow-x: clip;
  }
  main {
    flex: 1;
    padding: 0 0 6rem 0;
  }
</style>
