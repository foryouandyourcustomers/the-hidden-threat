<script>
  import Heading from '$lib/components/ui/Heading.svelte'
</script>

<section>
  <Heading size="sm">Unsere Partner</Heading>

  <div class="logos">
    <img alt="" src="/images/logos/EU.svg" />
    <img alt="" src="/images/logos/Helmut_Schmidt.svg" />
    <img alt="" src="/images/logos/dtec.bw_gross.svg" />
    <img alt="" src="/images/logos/UnBW.svg" />
    <img alt="" src="/images/logos/fyayc.svg" />
  </div>
</section>

<style lang="postcss">
  section {
    background-color: var(--color-bg-secondary);
    padding: 2rem var(--size-content-px);

    .logos {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
  }
</style>
