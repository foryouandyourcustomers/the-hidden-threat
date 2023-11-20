<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { inProgressEvent, isEnabled, applyAction, cancel } = createActionHandler(
    'is-next-to-attacker',
    {
      createEvent: (gameState) => ({ position: gameState.activePlayerPosition }),
    },
  )
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  Angreifer:in angrenzend?
</Action>

{#if $inProgressEvent}
  <GameDialog title="Angreifer:in angrenzend?" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen ob der/die Angreifer:in sich auf einem der angrenzenden Felder befindet?
    </Paragraph>
    <button on:click={() => applyAction(true)}>Ja</button>
  </GameDialog>
{/if}
