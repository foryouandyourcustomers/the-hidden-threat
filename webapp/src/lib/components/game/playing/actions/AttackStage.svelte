<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import { isActionEventOf, type Coordinate, type SharedGameContext } from '$lib/game/types'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  const getActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    position?: Coordinate,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'action',
        action: 'attack',
        finalized,
        playerId: gameState.activePlayer.id,
        position,
      },
    }
  }

  const attackableStages = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.attackableStages
  })

  const applyAction = (finalized = false, position?: Coordinate) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized, position))
  }

  const startedAttacking = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'attack')
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

<Action disabled={!$attackableStages.length} on:click={() => applyAction(false)}
  >Stufe angreifen</Action
>

{#if $startedAttacking}
  <GameDialog title="Stufe angreifen" on:close={cancel}>
    <Paragraph>Möchtest du folgende Gegenstände einsetzen um die Stufe anzugreifen?</Paragraph>
    {#each $attackableStages as stage}
      <button on:click={() => applyAction(true, stage.coordinate)}>{stage.id}</button>
    {/each}
  </GameDialog>
{/if}
