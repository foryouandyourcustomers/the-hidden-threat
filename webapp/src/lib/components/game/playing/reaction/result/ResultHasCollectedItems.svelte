<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte/useSelector'
  import { getGameContext } from '$lib/client/game-context'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { BOARD_ITEMS } from '$lib/game/constants/board-items'
  import { isAttackItemId, type AttackItemId } from '$lib/game/constants/items'
  import { GameState } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'
  import Item from '$lib/components/icons/Item.svelte'

  const { machine } = getGameContext()

  const collectedItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const lastFinalizedActionEvent = gameState.finalizedActionEvents.at(-1)
    if (
      lastFinalizedActionEvent?.action !== 'ask-question' ||
      lastFinalizedActionEvent.question !== 'has-collected-items'
    ) {
      return undefined
    }

    return BOARD_ITEMS.filter(
      (item) =>
        isAttackItemId(item.id) && isEqual(item.position, lastFinalizedActionEvent.position),
    )
      .map((item) => ({
        id: item.id,
        count: gameState.attackInventory[item.id as AttackItemId],
      }))
      .filter((item) => item.count)
  })
</script>

{#if $collectedItems}
  <GameDialog title="Gesammelte Gegenstände" on:close>
    {#if $collectedItems.length > 0}
      <Paragraph>Der/die Angreifer:in hat folgende Gegenstände gesammelt:</Paragraph>
      {#each $collectedItems as item}
        <Item itemId={item.id} />
      {/each}
    {:else}
      <Paragraph>Der/die Angreifer:in hat keine der Gegenstände gesammelt.</Paragraph>
    {/if}
  </GameDialog>
{/if}