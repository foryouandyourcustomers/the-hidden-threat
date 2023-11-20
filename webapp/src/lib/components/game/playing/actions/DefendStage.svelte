<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import Stage from '$lib/components/icons/Stage.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { findStageAt } from '$lib/game/constants/board-stages'
  import { GameState } from '$lib/game/game-state'
  import { getStage } from '$lib/game/utils'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  const { inProgressEvent, applyAction, cancel, canApplyAction, isEnabled } = createActionHandler(
    'defend',
    {
      createEvent: (gameState) => ({
        position: gameState.activePlayerPosition,
      }),
      enabledCheck: (gameState) => gameState.canDefendStage,
    },
  )

  const boardStage = useSelector(machine.service, ({ context }) =>
    findStageAt(GameState.fromContext(context).activePlayerPosition),
  )
</script>

<Action disabled={!$isEnabled} on:click={() => applyAction()}>Stufe verteidigen</Action>

{#if $inProgressEvent && $boardStage}
  <GameDialog title="Stufe verteidigen" on:close={cancel}>
    <Paragraph>Möchtest Du wirklich diese Stufe verteidigen?</Paragraph>

    {@const stage = getStage($boardStage.id)}
    <div class="stage">
      <div class="icon">
        <Stage stageId={$boardStage.id} />
      </div>
      <div class="name">
        {stage.name}
      </div>
      <div class="items">
        {#each stage.defenseItems as itemId}
          <Item {itemId} />
        {/each}
      </div>
    </div>

    <Actions>
      <Button
        disabled={!$canApplyAction}
        disabledReason={'Du bist nicht am Zug'}
        on:click={() => applyAction(true)}
        inverse
        size="small"
      >
        Stufe verteidigen
      </Button>
    </Actions>
  </GameDialog>
{/if}

<style lang="postcss">
  .stage {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: var(--radius-sm);
    background: var(--color-white-80);
    background: color-mix(in oklab, var(--color-white-80), transparent 60%);
    padding: 0.5rem;

    .icon {
      margin-left: 0.5rem;
      width: 2rem;
      height: 2rem;
    }
    .name {
      flex: 1;
      font-weight: bold;
    }
    .items {
      display: flex;
      gap: 1rem;
      border-radius: var(--radius-sm);
      background: var(--color-bg-strong);
      padding: 0.5rem;
      :global(svg) {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }
</style>
