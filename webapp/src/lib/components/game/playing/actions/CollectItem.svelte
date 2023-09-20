<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Item from '$lib/components/icons/Item.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { isItemIdOfSide, type ItemId } from '$lib/game/constants/items'
  import { GameState } from '$lib/game/game-state'
  import { isActionEventOf, type SharedGameContext } from '$lib/game/types'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  const getActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    itemId?: ItemId,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'action',
        action: 'collect',
        finalized,
        playerId: gameState.activePlayer.id,
        itemId: itemId,
        position: gameState.activePlayerPosition,
      },
    }
  }

  const collectableItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const playerPosition = gameState.activePlayerPosition
    return gameState
      .getItemsForCoordinate(playerPosition)
      .filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide))
  })

  const applyAction = (finalized = false, itemId?: ItemId) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized, itemId))
  }

  const startedCollecting = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'collect')
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

<Action disabled={$collectableItems.length === 0} on:click={() => applyAction(false)}>
  Gegenstand einsammeln
</Action>

{#if $startedCollecting}
  <GameDialog title="Gegenstand einsammeln" on:close={cancel}>
    <Paragraph>Klicke auf den Gegenstand den du einsammeln möchtest</Paragraph>
    {#each $collectableItems as collectableItem}
      <button class="unstyled" on:click={() => applyAction(true, collectableItem.item.id)}>
        <Item itemId={collectableItem.item.id} />
      </button>
    {/each}
  </GameDialog>
{/if}

<style lang="postcss">
</style>
