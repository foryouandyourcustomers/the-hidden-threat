<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { getItem, isItemIdOfSide } from '$lib/game/constants/items'
  import { GameState } from '$lib/game/game-state'
  import { afterUpdate, onMount } from 'svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  const collectableItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const playerPosition = gameState.activePlayerPosition
    return gameState
      .getItemsForCoordinate(playerPosition)
      .filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide))
  })

  const {
    inProgressEvent,
    applyAction,
    cancel,
    canApplyAction,
    selectedOption,
    formAction,
    buttonDisabled,
    buttonDisabledReason,
  } = createActionHandler('collect', {
    extractSelectedOption: (event) =>
      $collectableItems.length === 1 ? $collectableItems[0].item.id : event?.itemId,
    createEvent: (gameState, itemId) => ({
      itemId,
      position: gameState.activePlayerPosition,
    }),
  })
</script>

<Action disabled={$collectableItems.length === 0} on:click={() => applyAction()}>
  Gegenstand einsammeln
</Action>

{#if $inProgressEvent}
  <GameDialog title="Gegenstand einsammeln" on:close={cancel}>
    {#if $collectableItems.length > 1}<p class="intro text-xs">
        Bitte wähle einen Gegenstand aus
      </p>{/if}

    <form use:formAction>
      <RadioOptions vertical>
        {#each $collectableItems as collectableItem}
          <RadioButton
            disabled={!$canApplyAction}
            bind:group={$selectedOption}
            value={collectableItem.item.id}
          >
            {@const item = getItem(collectableItem.item.id)}

            <div class="item-choice">
              <div class="icon">
                <Item itemId={collectableItem.item.id} />
              </div>
              <div class="content">
                <div class="name">{item.name}</div>
                <div class="description">{item.description.split('.')[0]}.</div>
              </div>
            </div>
          </RadioButton>
        {/each}
      </RadioOptions>

      <Actions>
        <Button
          type="submit"
          size="small"
          inverse
          disabled={$buttonDisabled}
          disabledReason={$buttonDisabledReason}
        >
          {$collectableItems.length > 1 ? 'Auswahl bestätigen' : 'Bestätigen'}
        </Button>
      </Actions>
    </form>
  </GameDialog>
{/if}

<style lang="postcss">
  .intro {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  .item-choice {
    display: flex;
    gap: 0.5rem;
    .icon {
      flex-shrink: 0;
      width: 3rem;
      height: 3rem;
    }
    .name {
      font-weight: bold;
    }
    .content {
      /* max-width: 20ch; */
      max-height: 15rem;
      overflow-y: auto;
    }
  }
</style>
