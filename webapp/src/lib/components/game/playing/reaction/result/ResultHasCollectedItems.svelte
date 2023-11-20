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
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'

  let visible = true

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

{#if $collectedItems && visible}
  <GameDialog title="Frage stellen" on:close={() => (visible = false)}>
    {#if $collectedItems.length > 0}
      <Paragraph>Der/die Angreifer:in hat folgende Gegenstände gesammelt:</Paragraph>
      <div class="items">
        {#each $collectedItems as item}
          <Item itemId={item.id} />
        {/each}
      </div>
    {:else}
      <Paragraph>Der/die Angreifer:in hat keine der Gegenstände gesammelt.</Paragraph>
    {/if}
    <Actions>
      <Button on:click={() => (visible = false)} inverse size="small">Weiter geht's!</Button>
    </Actions>
  </GameDialog>
{/if}

<style lang="postcss">
  .items {
    display: flex;
    gap: 1rem;
    :global(svg) {
      width: 4rem;
      height: 4rem;
    }
  }
</style>
