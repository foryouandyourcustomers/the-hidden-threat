<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { inProgressEvent, isEnabled, applyAction, cancel } = createActionHandler(
    'quarter-reveal',
    {
      createEvent: () => ({}),
    },
  )
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  Viertel aufdecken
</Action>

{#if $inProgressEvent}
  <GameDialog title="Viertel aufdecken" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen auf welchem Viertel des Spielfelds der/die Angreifer:in sich befindet?
    </Paragraph>
    <button on:click={() => applyAction(true)}>Ja</button>
  </GameDialog>
{/if}
