<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { ITEMS, isDefenseItemId } from '$lib/game/constants/items'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const {
    inProgressEvent,
    isEnabled,
    applyAction,
    cancel,
    selectedOption: selectedItemId,
    formAction,
    buttonDisabled,
    buttonDisabledReason,
  } = createActionHandler('exchange-digital-footprint', {
    extractSelectedOption: (event) => event.item,
    enabledCheck: (gameState) => gameState.defenseInventory['digital-footprint'] > 0,
    createEvent: (_, item) => ({ item }),
  })
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

    <form use:formAction>
      <RadioOptions>
        {#each ITEMS.filter((item) => item.id !== 'digital-footprint' && isDefenseItemId(item.id)) as item}
          <RadioButton bind:group={$selectedItemId} value={item.id}>
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
          disabled={$buttonDisabled}
          disabledReason={$buttonDisabledReason}
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
