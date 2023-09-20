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
        action: 'attack',
        finalized,
        playerId: gameState.activePlayer.id,
        position: gameState.activePlayerPosition,
      },
    }
  }

  const canAttack = useSelector(machine.service, () => {
    return false
  })

  const applyAction = (finalized = false) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized))
  }

  const startedAttacking = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'defend')
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

<Action disabled={!$canAttack} on:click={() => applyAction(false)}>Stufe angreifen</Action>

{#if $startedAttacking}
  <GameDialog title="Stufe angreifen" on:close={cancel}>
    <Paragraph>Möchtest du folgende Gegenstände einsetzen um die Stufe anzugreifen?</Paragraph>
  </GameDialog>
{/if}
