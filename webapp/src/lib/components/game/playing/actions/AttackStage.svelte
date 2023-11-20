<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Item from '$lib/components/icons/Item.svelte'
  import Stage from '$lib/components/icons/Stage.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import type { StageId } from '$lib/game/constants/stages'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate, SharedGameContext } from '$lib/game/types'
  import { getStage } from '$lib/game/utils'
  import Action from './Action.svelte'
  import { createActionHandler } from './utils'

  const { machine } = getGameContext()

  let selectedPosition: Coordinate | undefined = undefined

  const { inProgressEvent, applyAction, cancel, canApplyAction } = createActionHandler('attack', {
    createEvent: (gameState) => ({
      position: selectedPosition,
    }),
  })

  const attackableStages = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.attackableStages.map((stage) => {
      return {
        ...stage,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attack: gameState.executableAttacks.find(
          (attack) =>
            attack.target.stageId === stage.id &&
            attack.target.supplyChainId === stage.supplyChainId,
        )!,
      }
    })
  })
</script>

<Action disabled={!$attackableStages.length} on:click={() => applyAction(false)}>
  Stufe angreifen
</Action>

{#if $inProgressEvent}
  <GameDialog title="Stufe angreifen" on:close={cancel}>
    <Paragraph>Welche der Stufen möchtest Du angreifen?</Paragraph>
    <form on:submit|preventDefault={() => applyAction(true)}>
      <RadioOptions>
        {#each $attackableStages as boardStage}
          {@const stage = getStage(boardStage.id)}
          <RadioButton
            disabled={!$canApplyAction}
            value={boardStage.coordinate}
            bind:group={selectedPosition}
          >
            <svelte:fragment slot="title">
              <div class="title">
                <Stage stageId={stage.id} />
                {stage.name}
              </div>
            </svelte:fragment>

            <Paragraph size="sm" spacing="none">
              <div class="items">
                {#each boardStage.attack.target.requiredItems as item}
                  <div class="item">
                    <Item itemId={item} />
                  </div>
                {/each}
              </div>
            </Paragraph>
          </RadioButton>
        {/each}
      </RadioOptions>
      <Actions>
        <Button
          disabled={!$canApplyAction || !selectedPosition}
          type="submit"
          size="small"
          inverse
          disabledReason={!$canApplyAction ? 'Du bist nicht am Zug' : 'Bitte wähle eine Stufe aus'}
          >Bestätigen</Button
        >
      </Actions>
    </form>
  </GameDialog>
{/if}

<style lang="postcss">
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    :global(svg) {
      aspect-ratio: 1;
      width: 2rem;
    }
  }
  .items {
    display: flex;
    justify-content: space-evenly;
  }
</style>
