<script lang="ts">
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const {
    inProgressEvent,
    isEnabled,
    applyAction,
    cancel,
    formAction,
    buttonDisabled,
    buttonDisabledReason,
  } = createActionHandler('quarter-reveal', {
    createEvent: () => ({}),
  })
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  Viertel aufdecken
</Action>

{#if $inProgressEvent}
  <GameDialog title="Rollenfähigkeit einsetzen" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen auf welchem Viertel des Spielfelds der/die Angreifer:in sich befindet?
    </Paragraph>

    <form use:formAction>
      <Actions>
        <Button
          disabled={$buttonDisabled}
          disabledReason={$buttonDisabledReason}
          inverse
          size="small"
          on:click={() => applyAction(true)}>Bestätigen</Button
        >
      </Actions>
    </form>
  </GameDialog>
{/if}
