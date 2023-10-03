<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { findStageAt } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import { isActionEventOf, type ActionEventOf, type SharedGameContext } from '$lib/game/types'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  type Question = ActionEventOf<'ask-question'>['question']

  const getActionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    question: Question = undefined,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'action',
        action: 'ask-question',
        finalized,
        question,
        playerId: gameState.activePlayer.id,
        position: gameState.activePlayerPosition,
      },
    }
  }

  let question: Question = undefined

  const applyAction = (finalized = false) => {
    const context = machine.service.getSnapshot().context
    machine.send(getActionEvent(context, finalized, question))
  }

  const startedQuestioning = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return isActionEventOf(gameState.lastEvent, 'ask-question')
  })

  const canAskForItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return !findStageAt(gameState.activePlayerPosition)
  })

  const cancel = () => machine.send({ type: 'cancel game event' })
</script>

<Action on:click={() => applyAction(false)}>Frage stellen</Action>

{#if $startedQuestioning}
  <GameDialog title="Frage stellen" on:close={cancel}>
    <Paragraph>Stellen Sie dem/der Angreifer:in eine der folgenden Fragen:</Paragraph>
    <form on:submit|preventDefault={() => applyAction(true)}>
      <label>
        <input
          disabled={!$canAskForItems}
          type="radio"
          name="question"
          value="has-collected-items"
          bind:group={question}
        />
        Nach Gegenstand

        <Paragraph>
          Hat der/die Angreifer:in den Gegenstand, der auf dem Feld abgebildet ist, wo sich der
          Verteidiger befindet, schon gesammelt?
        </Paragraph>
      </label>

      <label>
        <input type="radio" name="question" value="is-on-field" bind:group={question} />
        Nach Standort

        <Paragraph>Befindet sich der/die Angreifer:in auf dem gleichen Feld?</Paragraph>
      </label>

      <button type="submit" disabled={!question}>Bestätigen</button>
    </form>
  </GameDialog>
{/if}
