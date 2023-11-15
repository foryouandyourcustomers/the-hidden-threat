<script lang="ts">
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import isEqual from 'lodash/isEqual'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { isEnabled, inProgress, applyAction, cancel } = createActionHandler('is-attacking-stage', {
    createEvent: (gameState) => ({ position: gameState.activePlayerPosition }),
    enabledCheck: (gameState) =>
      !!BOARD_SUPPLY_CHAINS.flat().find((stage) =>
        isEqual(stage.coordinate, gameState.activePlayerPosition),
      ),
  })
</script>

<Action title="Rollenfähigkeit" disabled={!$isEnabled} on:click={() => applyAction()}>
  Aktiver Angriff?
</Action>

{#if $inProgress}
  <GameDialog title="Aktiver Angriff?" on:close={cancel}>
    <Paragraph>
      Möchtest du abfragen ob der/die Angreifer:in einen aktiven Angriff auf die Stufe auf der du
      dich befindest hat?
    </Paragraph>
    <button on:click={() => applyAction(true)}>Ja</button>
  </GameDialog>
{/if}
