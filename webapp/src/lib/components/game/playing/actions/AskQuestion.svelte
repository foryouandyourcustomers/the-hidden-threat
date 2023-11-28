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
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  const {
    inProgressEvent,
    applyAction,
    cancel,
    canApplyAction,
    selectedOption: question,
    formAction,
    buttonDisabled,
    buttonDisabledReason,
  } = createActionHandler('ask-question', {
    extractSelectedOption: (event) => event.question,
    createEvent: (gameState, question) => ({
      question,
      position: gameState.activePlayerPosition,
    }),
    enabledCheck: (gameState) => gameState.jokers > 0,
  })

  const canAskForItems = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return !findStageAt(gameState.activePlayerPosition)
  })
</script>

<Action on:click={() => applyAction(false)}>Frage stellen</Action>

{#if $inProgressEvent}
  <GameDialog title="Frage stellen" on:close={cancel}>
    <Paragraph>Stelle dem/der Angreifer:in eine der folgenden Fragen:</Paragraph>
    <form use:formAction>
      <RadioOptions vertical>
        <RadioButton
          disabled={!$canAskForItems || !$canApplyAction}
          value="has-collected-items"
          bind:group={$question}
        >
          Nach Gegenstand

          <Paragraph size="sm" spacing="none">
            Hat der/die Angreifer:in den Gegenstand, der auf dem Feld abgebildet ist, wo sich der
            Verteidiger befindet, schon gesammelt?
          </Paragraph>
        </RadioButton>

        <RadioButton disabled={!$canApplyAction} value="is-on-field" bind:group={$question}>
          Nach Standort

          <Paragraph size="sm" spacing="none"
            >Befindet sich der/die Angreifer:in auf dem gleichen Feld?</Paragraph
          >
        </RadioButton>
      </RadioOptions>

      <Actions spacing="dialog">
        <Button
          size="small"
          inverse
          type="submit"
          disabled={$buttonDisabled}
          disabledReason={$buttonDisabledReason}>Bestätigen</Button
        >
      </Actions>
    </form>
  </GameDialog>
{/if}
