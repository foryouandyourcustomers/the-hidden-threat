<script>
  import Item from '$lib/components/icons/Item.svelte'
  import Section from '$lib/components/layout/Section.svelte'
  import { ITEMS } from '$lib/game/constants/items'
</script>

<Section>
  <div class="items">
    {#each ITEMS as item}
      <div class="item">
        <h3>{item.name}</h3>
        <Item itemId={item.id} />
        <p>{item.description}</p>
      </div>
    {/each}
  </div>
</Section>

<style lang="postcss">
  .items {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    .item {
      display: flex;
      flex-direction: column;
      border: 1px solid silver;
      border-radius: 0.5rem;
      padding: 1rem;
      max-width: 20rem;
    }
  }
</style>
