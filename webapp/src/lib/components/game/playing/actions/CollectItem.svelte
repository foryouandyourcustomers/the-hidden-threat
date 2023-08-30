<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Button from '$lib/components/ui/Button.svelte'
  import { isItemIdOfSide, type ItemId } from '$lib/game/constants'
  import { GameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'

  const { machine } = getGameContext()

  const getCollectActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    itemId?: ItemId,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'collect',
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
    machine.send(getCollectActionEvent(context, finalized, itemId))
  }

  const startedCollecting = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.lastEvent?.type === 'collect'
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

{#if !$startedCollecting}
  <Button disabled={$collectableItems.length === 0} on:click={() => applyAction(false)}>
    Gegenstand einsammeln
  </Button>
{:else}
  <Button on:click={cancel}>Abbrechen</Button>
  {#each $collectableItems as collectableItem}
    <Button on:click={() => applyAction(true, collectableItem.item.id)}
      >{collectableItem.item.id}</Button
    >
  {/each}
{/if}

<style lang="postcss">
</style>
