<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { inProgress, isEnabled, applyAction, cancel } = createActionHandler('quarter-reveal', {
    createEvent: () => ({}),
  })
</script>

<Action
  title="Rollenfähigkeit"
  disabled={!$isEnabled}
  on:click={() => applyAction({ finalized: false })}
>
  Viertel aufdecken
</Action>

{#if $inProgress}
  <GameDialog title="Viertel aufdecken" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen auf welchem Viertel des Spielfelds der/die Angreifer:in sich befindet?
    </Paragraph>
    <button on:click={() => applyAction({ finalized: true })}>Ja</button>
  </GameDialog>
{/if}
