<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { ITEMS, isDefenseItemId, type DefenseItemId } from '$lib/game/constants/items'
  import { derived } from 'svelte/store'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  let selectedItemId: DefenseItemId | undefined

  const { inProgressEvent, isEnabled, applyAction, cancel, canApplyAction } = createActionHandler(
    'exchange-digital-footprint',
    {
      createEvent: () => ({ item: selectedItemId }),
      enabledCheck: (gameState) => gameState.defenseInventory['digital-footprint'] > 0,
    },
  )

  const onSubmit = () => {
    if (!selectedItemId) return
    applyAction(true)
  }

  const inProgressItem = derived(inProgressEvent, ($inProgressEvent) => $inProgressEvent?.item)

  $: if (selectedItemId && $inProgressItem !== selectedItemId) {
    applyAction()
  }
  $: selectedItemId = $inProgressItem
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  "Digital Footprint" eintauschen
</Action>

{#if $inProgressEvent}
  <GameDialog title="Rollenfähigkeit einsetzten" on:close={cancel}>
    <Paragraph>
      Tausche den Digital Footprint gegen <strong>einen</strong> anderen Schutzgegenstand indem du einen
      Gegenstand aus der Liste wählst.
    </Paragraph>

    <form on:submit|preventDefault={onSubmit}>
      <RadioOptions>
        {#each ITEMS.filter((item) => item.id !== 'digital-footprint' && isDefenseItemId(item.id)) as item}
          <RadioButton bind:group={selectedItemId} value={item.id}>
            <div class="item-choice">
              <div class="icon">
                <Item itemId={item.id} />
              </div>
              <div class="name">{item.name}</div>
            </div>
          </RadioButton>
        {/each}
      </RadioOptions>

      <Actions>
        <Button
          disabled={!selectedItemId || !$canApplyAction}
          disabledReason={!$canApplyAction
            ? 'Du bist nicht am Zug'
            : 'Bitte wähle einen Gegenstand aus'}
          size="small"
          inverse
          type="submit">Auswahl bestätigen</Button
        >
      </Actions>
    </form>
  </GameDialog>
{/if}

<style lang="postcss">
  .item-choice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    .icon {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
    }
  }
</style>
