<script lang="ts">
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { inProgressEvent, isEnabled, applyAction, cancel, canApplyAction } = createActionHandler(
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
  <GameDialog title="Rollenfähigkeit einsetzen" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen ob der/die Angreifer:in sich auf einem der angrenzenden Felder befindet?
    </Paragraph>
    <Actions>
      <Button disabled={!$canApplyAction} inverse size="small" on:click={() => applyAction(true)}>
        Bestätigen
      </Button>
    </Actions>
  </GameDialog>
{/if}
