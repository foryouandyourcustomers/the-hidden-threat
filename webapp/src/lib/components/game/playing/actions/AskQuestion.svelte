<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { findStageAt } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import type { ActionEventOf } from '$lib/game/types'
  import { derived } from 'svelte/store'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  type Question = ActionEventOf<'ask-question'>['question']
  let question: Question = undefined

  const { inProgressEvent, applyAction, cancel, canApplyAction } = createActionHandler(
    'ask-question',
    {
      createEvent: (gameState) => ({
        question,
        position: gameState.activePlayerPosition,
      }),
      enabledCheck: (gameState) => gameState.jokers > 0,
    },
  )

  const canAskForItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return !findStageAt(gameState.activePlayerPosition)
  })

  const inProgressQuestion = derived(
    inProgressEvent,
    ($inProgressEvent) => $inProgressEvent?.question,
  )

  $: if (question && $inProgressQuestion !== question) {
    applyAction()
  }
  $: question = $inProgressQuestion
</script>

<Action on:click={() => applyAction(false)}>Frage stellen</Action>

{#if $inProgressEvent}
  <GameDialog title="Frage stellen" on:close={cancel}>
    <Paragraph>Stelle dem/der Angreifer:in eine der folgenden Fragen:</Paragraph>
    <form on:submit|preventDefault={() => applyAction(true)}>
      <RadioOptions vertical>
        <RadioButton
          disabled={!$canAskForItems || !$canApplyAction}
          value="has-collected-items"
          bind:group={question}
        >
          Nach Gegenstand

          <Paragraph size="sm" spacing="none">
            Hat der/die Angreifer:in den Gegenstand, der auf dem Feld abgebildet ist, wo sich der
            Verteidiger befindet, schon gesammelt?
          </Paragraph>
        </RadioButton>

        <RadioButton disabled={!$canApplyAction} value="is-on-field" bind:group={question}>
          Nach Standort

          <Paragraph size="sm" spacing="none"
            >Befindet sich der/die Angreifer:in auf dem gleichen Feld?</Paragraph
          >
        </RadioButton>
      </RadioOptions>

      <Actions>
        <Button
          size="small"
          inverse
          type="submit"
          disabled={!question || !$canApplyAction}
          disabledReason={!$canApplyAction ? 'Du bist nicht am Zug' : 'Bitte wähle eine Frage aus'}
          >Bestätigen</Button
        >
      </Actions>
    </form>
  </GameDialog>
{/if}
