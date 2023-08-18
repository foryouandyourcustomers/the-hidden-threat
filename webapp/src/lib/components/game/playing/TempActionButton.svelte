<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import type { AttackItemId, DefenseItemId } from '$lib/game/constants'
  import { getCurrentGameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'
  import { objectEntries } from '$lib/utils'
  import isEqual from 'lodash/isEqual'
  import Item from '$lib/components/icons/Item.svelte'

  const { machine } = getGameContext()

  const currentRound = useSelector(
    machine.service,
    ({ context }) => getCurrentGameState(context).currentRound,
  )

  const getCollectActionEvent = (
    itemId: DefenseItemId | AttackItemId,
    context: SharedGameContext,
  ): ClientEventOf<'apply game event'> => {
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'collect',
        finalized: true,
        playerId: getCurrentGameState(context).activePlayerId,
        item: itemId,
      },
    }
  }

  const canPerformAction = useSelector(machine.service, (state) =>
    state.can(getCollectActionEvent('alarm-system', machine.service.getSnapshot().context)),
  )

  const performAction = () => {
    const context = machine.service.getSnapshot().context
    const gameState = getCurrentGameState(context)
    const playerPosition = gameState.playerPositions[gameState.activePlayerId]
    const item = context.items.find((item) => isEqual(item.position, playerPosition))
    if (item) {
      machine.send(getCollectActionEvent(item.item, context))
    }
  }

  const itemInventories = useSelector(
    machine.service,
    (state) => {
      const gameState = getCurrentGameState(state.context)
      return { attack: gameState.attack.inventory, defense: gameState.defense.inventory }
    },
    isEqual,
  )
</script>

Round: {$currentRound + 1}

Defense:
{#each objectEntries($itemInventories.defense) as [itemId, count]}
  {#if count > 0}
    <div><Item {itemId} />: {count}</div>
  {/if}
{/each}

Attack:
{#each objectEntries($itemInventories.attack) as [itemId, count]}
  {#if count > 0}
    <div><Item {itemId} />: {count}</div>
  {/if}
{/each}

{#if $canPerformAction}
  <button on:click={performAction}>Collect item</button>
{/if}

<style lang="postcss">
</style>
