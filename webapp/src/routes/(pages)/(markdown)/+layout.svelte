<script>
  import Section from '$lib/components/layout/Section.svelte'
</script>

<Section width="sm">
  <div class="richtext">
    <slot />
  </div>
</Section>

<style lang="postcss">
  .richtext {
    :global(nav.toc) {
      display: none;
    }
  }
</style>
