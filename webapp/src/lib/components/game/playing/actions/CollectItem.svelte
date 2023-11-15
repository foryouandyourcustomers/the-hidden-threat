<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { getItem, isItemIdOfSide, type ItemId } from '$lib/game/constants/items'
  import { GameState } from '$lib/game/game-state'
  import { derived } from 'svelte/store'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  let selectedItemId: ItemId | undefined = undefined

  const { inProgress, inProgressEvent, applyAction, cancel, canApplyAction } = createActionHandler(
    'collect',
    {
      createEvent: (gameState) => ({
        itemId: selectedItemId,
        position: gameState.activePlayerPosition,
      }),
    },
  )

  const collectableItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const playerPosition = gameState.activePlayerPosition
    return gameState
      .getItemsForCoordinate(playerPosition)
      .filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide))
  })

  const inProgressItem = derived(inProgressEvent, ($inProgressEvent) => $inProgressEvent?.itemId)

  $: if (selectedItemId && $inProgressItem !== selectedItemId) {
    applyAction()
  }
  $: selectedItemId = $inProgressItem
</script>

<Action disabled={$collectableItems.length === 0} on:click={() => applyAction()}>
  Gegenstand einsammeln
</Action>

{#if $inProgress}
  <GameDialog title="Gegenstand einsammeln" on:close={cancel}>
    <Paragraph>Bitte wähle einen Gegenstand aus</Paragraph>

    <RadioOptions>
      {#each $collectableItems as collectableItem}
        <RadioButton
          disabled={!$canApplyAction}
          bind:group={selectedItemId}
          value={collectableItem.item.id}
        >
          {@const item = getItem(collectableItem.item.id)}

          <div class="item-choice">
            <div class="icon">
              <Item itemId={collectableItem.item.id} />
            </div>
            <div class="content">
              <div class="name">{item.name}</div>
              <div class="description">{item.description}</div>
            </div>
          </div>
        </RadioButton>
      {/each}
    </RadioOptions>

    <Actions>
      <Button
        size="small"
        inverse
        disabled={!selectedItemId || !$canApplyAction}
        disabledReason={!$canApplyAction
          ? 'Du bist nicht am Zug'
          : 'Bitte wähle einen Gegenstand aus'}
        on:click={() => applyAction(true)}
      >
        Auswahl bestätigen
      </Button>
    </Actions>
  </GameDialog>
{/if}

<style lang="postcss">
  .item-choice {
    display: flex;
    .icon {
      flex-shrink: 0;
      width: 3rem;
      height: 3rem;
    }
    .name {
      font-weight: bold;
    }
    .content {
      max-width: 20ch;
      max-height: 10rem;
      overflow-y: auto;
    }
  }
</style>
