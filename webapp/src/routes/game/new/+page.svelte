<script>
  import CenteredContent from '$lib/components/layout/CenteredContent.svelte'
  import Button from '$lib/components/ui/Button.svelte'
</script>

<CenteredContent>
  <form method="post">
    <h1>Neues Spiel</h1>

    <div class="actions">
      <Button href="/">Abbrechen</Button>
      <Button type="submit" accent>Start</Button>
    </div>
  </form>
</CenteredContent>

<style lang="postcss">
  .actions {
    display: flex;
    gap: var(--size-2);
  }
</style>
