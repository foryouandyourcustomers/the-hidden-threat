<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import { isActionEventOf, type SharedGameContext } from '$lib/game/types'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  const getActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'action',
        action: 'defend',
        finalized,
        playerId: gameState.activePlayer.id,
        position: gameState.activePlayerPosition,
      },
    }
  }

  const canDefend = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.defendableStage
  })

  const applyAction = (finalized = false) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized))
  }

  const startedDefending = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'defend')
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

<Action disabled={!$canDefend} on:click={() => applyAction(false)}>Stufe verteidigen</Action>

{#if $startedDefending}
  <GameDialog title="Stufe verteidigen" on:close={cancel}>
    <Paragraph>Möchtest du folgende Gegenstände einsetzen um die Stufe zu verteidigen?</Paragraph>
    <button on:click={() => applyAction(true)}>Ja</button>
  </GameDialog>
{/if}
