<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { ITEMS, isAttackItemId, type AttackItemId } from '$lib/game/constants/items'
  import { GameState } from '$lib/game/game-state'
  import { isActionEventOf, type SharedGameContext } from '$lib/game/types'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  const getActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    itemId?: AttackItemId,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'action',
        action: 'exchange-joker',
        playerId: gameState.activePlayer.id,
        finalized,
        itemId,
      },
    }
  }

  const hasJoker = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.jokers > 0
  })

  const applyAction = (finalized = false, itemId?: AttackItemId) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized, itemId))
  }

  const startedExchanchingJoker = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'exchange-joker')
  })

  const cancel = () => machine.send({ type: 'cancel game event' })

  let selectedItemId: AttackItemId | undefined

  const onSubmit = () => {
    if (!selectedItemId) return
    applyAction(true, selectedItemId)
  }
</script>

<Action disabled={!$hasJoker} on:click={() => applyAction(false)}>Joker einsetzen</Action>

{#if $startedExchanchingJoker}
  <GameDialog title="Joker einsetzen" on:close={cancel}>
    <Paragraph
      >Tausche den Joker gegen einen anderen Schadensgegenstand indem du einen Gegenstand aus der
      Liste wählst.
    </Paragraph>
    <form on:submit|preventDefault={onSubmit}>
      <div class="items">
        {#each ITEMS.filter((item) => isAttackItemId(item.id)) as item}
          <label>
            <input name="itemId" type="radio" bind:group={selectedItemId} value={item.id} />
            {item.name}
          </label>
        {/each}
      </div>
      <button disabled={!selectedItemId} type="submit">Auswahl bestätigen</button>
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
