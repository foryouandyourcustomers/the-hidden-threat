<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte/useSelector'
  import { getGameContext } from '$lib/client/game-context'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'

  let visible = true

  const { machine } = getGameContext()
  const isAttackingStage = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const lastFinalizedActionEvent = gameState.finalizedActionEvents.at(-1)
    if (lastFinalizedActionEvent?.action !== 'is-attacking-stage') {
      return false
    }
    return !!gameState.activeTargetedAttacks.find((attack) => {
      const stage = BOARD_SUPPLY_CHAINS.flat().find(
        (stage) =>
          stage.supplyChainId === attack.target.supplyChainId && stage.id === attack.target.stageId,
      )
      return isEqual(stage?.coordinate, lastFinalizedActionEvent.position)
    })
  })
</script>

{#if visible}
  <GameDialog title="Frage stellen" on:close={() => (visible = false)}>
    {#if $isAttackingStage}
      <Paragraph>Der/die Angreifer:in hat einen gezielten Angriff auf diese Stufe.</Paragraph>
    {:else}
      <Paragraph>Der/die Angreifer:in hat keinen gezielten Angriff auf diese Stufe.</Paragraph>
    {/if}
    <Actions>
      <Button on:click={() => (visible = false)} inverse size="small">Weiter geht's!</Button>
    </Actions>
  </GameDialog>
{/if}
