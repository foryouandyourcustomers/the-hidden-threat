<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import type { AttackItemId, DefenseItemId } from '$lib/game/constants'
  import { GameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const getCollectActionEvent = (
    itemId: DefenseItemId | AttackItemId,
    context: SharedGameContext,
    finalized: boolean,
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

  const applyAction = (finalized = false) => {
    const context = machine.service.getSnapshot().context
    const gameState = GameState.fromContext(context)
    const playerPosition = gameState.activePlayerPosition
    const item = context.items.find((item) => isEqual(item.position, playerPosition))
    if (item) {
      machine.send(getCollectActionEvent(item.id, context, finalized))
    }
  }

  // const cancel = () => {
  // TODO
  // const context = machine.service.getSnapshot().context
  // const gameState = getCurrentGameState(context)
  // const playerPosition = gameState.playerPositions[gameState.activePlayerId]
  // const item = context.items.find((item) => isEqual(item.position, playerPosition))
  // if (item) {
  //   machine.send(getCollectActionEvent(item.item, context))
  // }
  // }
</script>

<button on:click={() => applyAction(true)}>Collect item</button>

<style lang="postcss">
</style>
