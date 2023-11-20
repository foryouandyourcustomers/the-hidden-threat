<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { ITEMS, isDefenseItemId, type DefenseItemId } from '$lib/game/constants/items'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { inProgressEvent, isEnabled, applyAction, cancel } = createActionHandler(
    'exchange-digital-footprint',
    {
      createEvent: () => ({ item: itemId }),
      enabledCheck: (gameState) => gameState.defenseInventory['digital-footprint'] > 0,
    },
  )

  let itemId: DefenseItemId

  const onSubmit = () => {
    if (!itemId) return
    applyAction(true)
  }
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  "Digital Footprint" eintauschen
</Action>

{#if $inProgressEvent}
  <GameDialog title="Digital Footprint eintauschen" on:close={cancel}>
    <Paragraph>
      Wähle den Gegenstand den du gegen den Digital Footprint eintauschen willst
    </Paragraph>

    <form on:submit|preventDefault={onSubmit}>
      <div class="items">
        {#each ITEMS.filter((item) => item.id !== 'digital-footprint' && isDefenseItemId(item.id)) as item}
          <label>
            <input name="itemId" type="radio" bind:group={itemId} value={item.id} />
            {item.name}
          </label>
        {/each}
      </div>
      <button disabled={!itemId} type="submit">Auswahl bestätigen</button>
    </form>
  </GameDialog>
{/if}

<style lang="postcss">
  .items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
  }
</style>
