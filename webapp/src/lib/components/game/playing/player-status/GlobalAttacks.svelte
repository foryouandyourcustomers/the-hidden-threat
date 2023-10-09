<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import { getStage } from '$lib/game/utils'
  import isEqual from 'lodash/isEqual'
  import AttackCard from './AttackCard.svelte'
  import type { StageId } from '$lib/game/constants/stages'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import { throwIfNotFound } from '$lib/utils'

  const { machine, highlightedFields } = getGameContext()

  const activeAttackIndex = useSelector(
    machine.service,
    (state) => GameState.fromContext(state.context).activeGlobalAttackIndex,
  )

  const globalAttackScenarioIndex = useSelector(
    machine.service,
    (state) => state.context.globalAttackScenario,
  )

  const globalAttackScenario = useSelector(
    machine.service,
    (state) => GameState.fromContext(state.context).globalAttackScenario,
    isEqual,
  )

  let selectedAttackIndex = 0

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  $: selectedAttack = $globalAttackScenario.attacks[selectedAttackIndex]

  let hovered = false

  const getPositionsForStage = (stageId: StageId) => {
    return (
      BOARD_SUPPLY_CHAINS.flat().filter((stage) => stage.id === stageId) ?? throwIfNotFound()
    ).map((stage) => stage.coordinate)
  }

  $: if (hovered && selectedAttack) {
    highlightedFields.update((fields) => ({
      ...fields,
      info: selectedAttack.targets.map((stage) => getPositionsForStage(stage.stageId)).flat(),
    }))
  } else {
    highlightedFields.update((fields) => ({
      ...fields,
      info: undefined,
    }))
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="scenarios"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <div class="description">
    <Paragraph spacing="none" size="sm">Allgemeiner Angriff</Paragraph>

    {#if !selectedAttack}
      <Heading size="sm" spacing="none">{$globalAttackScenario.name}</Heading>
      <Paragraph size="sm" spacing="none">
        {$globalAttackScenario.description}
      </Paragraph>
    {:else}
      <Heading size="sm" spacing="none">Angriff {selectedAttackIndex + 1}</Heading>
      <Paragraph size="sm" spacing="none">
        {selectedAttack.description}
      </Paragraph>
      <Heading size="xs" spacing="none">Benötigte Gegenstände</Heading>

      <div class="targets">
        {#each selectedAttack.targets as target}
          {@const stage = getStage(target.stageId)}
          <div class="target">
            <div class="stage">
              {stage.name}
            </div>
            <div class="items">
              {#each stage.defenseItems as item}
                <Item itemId={item} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <ul class="attacks">
    <li>
      <AttackCard
        side="defense"
        selected={selectedAttackIndex === -1}
        on:click={() => (selectedAttackIndex = -1)}
      >
        Szenario {$globalAttackScenarioIndex + 1}<br />
        Szenario
      </AttackCard>
    </li>
    {#each $globalAttackScenario.attacks as _, index}
      <li>
        <AttackCard
          side="defense"
          disabled={index > $activeAttackIndex}
          selected={selectedAttackIndex === index}
          on:click={() => (selectedAttackIndex = index)}
        >
          Szenario {$globalAttackScenarioIndex + 1}<br />
          Angriff {index + 1}
        </AttackCard>
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  .scenarios {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .description {
    flex: 1;
    overflow-y: scroll;
  }
  .attacks {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    margin: 0rem;
    padding: 0rem;
    width: 100%;
    overflow-x: scroll;
    list-style: none;
  }

  .targets {
    display: flex;
    gap: 2rem;

    .stage {
      font-size: 0.75rem;
    }

    .items {
      display: flex;
      gap: 0.5rem;
    }
  }
</style>
