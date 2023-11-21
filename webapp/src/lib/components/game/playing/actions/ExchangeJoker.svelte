<script lang="ts">
  import Item from '$lib/components/icons/Item.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { ITEMS, isAttackItemId } from '$lib/game/constants/items'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const {
    inProgressEvent,
    applyAction,
    cancel,
    canApplyAction,
    isEnabled,
    buttonDisabled,
    buttonDisabledReason,
    selectedOption,
    formAction,
  } = createActionHandler('exchange-joker', {
    extractSelectedOption: (event) => event.itemId,
    createEvent: (gameState, itemId) => ({
      itemId,
      position: gameState.activePlayerPosition,
    }),
    enabledCheck: (gameState) => gameState.jokers > 0,
  })
</script>

<Action disabled={!$isEnabled} on:click={() => applyAction()}>Joker einsetzen</Action>

{#if $inProgressEvent}
  <GameDialog title="Joker einsetzen" on:close={cancel}>
    <Paragraph
      >Tausche den Joker gegen einen anderen Schadensgegenstand indem du einen Gegenstand aus der
      Liste wählst.
    </Paragraph>
    <form use:formAction>
      <RadioOptions>
        {#each ITEMS.filter((item) => isAttackItemId(item.id)) as item}
          <RadioButton bind:group={$selectedOption} disabled={!$canApplyAction} value={item.id}>
            <div class="item-choice">
              <div class="icon">
                <Item itemId={item.id} />
              </div>
              <div class="name">
                {item.name}
              </div>
            </div>
          </RadioButton>
        {/each}
      </RadioOptions>
      <Actions>
        <Button
          size="small"
          inverse
          disabled={$buttonDisabled}
          disabledReason={$buttonDisabledReason}
          type="submit"
        >
          Auswahl bestätigen
        </Button>
      </Actions>
    </form>
  </GameDialog>
{/if}

<style lang="postcss">
  .item-choice {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .icon {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
