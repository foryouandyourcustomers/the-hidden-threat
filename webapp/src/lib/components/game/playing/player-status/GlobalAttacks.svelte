<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import type { GlobalAttack } from '$lib/game/constants/global-attacks'
  import type { StageId } from '$lib/game/constants/stages'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate } from '$lib/game/types'
  import { getStage } from '$lib/game/utils'
  import { throwIfNotFound } from '$lib/utils'
  import isEqual from 'lodash/isEqual'
  import AttackCard from './AttackCard.svelte'

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

  const getPositionsForStage = (stageId: StageId) => {
    return (
      BOARD_SUPPLY_CHAINS.flat().filter((stage) => stage.id === stageId) ?? throwIfNotFound()
    ).map((stage) => stage.coordinate)
  }

  const highlightAttack = (attack: GlobalAttack | null) => {
    let highlighted: Coordinate[] | undefined = undefined

    if (attack) {
      highlighted = attack.targets.map((stage) => getPositionsForStage(stage.stageId)).flat()
    }

    highlightedFields.update((fields) => ({
      ...fields,
      info: highlighted,
    }))
  }

  $: console.log($highlightedFields.items)
</script>

<div class="scenarios">
  <h6 class="display-xxs">Allgemeiner Angriff</h6>
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
    {#each $globalAttackScenario.attacks as attack, index}
      {@const disabled = index > $activeAttackIndex}
      <li
        on:mouseenter={() => (disabled ? undefined : highlightAttack(attack))}
        on:mouseleave={() => highlightAttack(null)}
      >
        <AttackCard
          side="defense"
          {disabled}
          selected={selectedAttackIndex === index}
          on:click={() => (selectedAttackIndex = index)}
        >
          Szenario {$globalAttackScenarioIndex + 1}<br />
          Angriff {index + 1}
        </AttackCard>
      </li>
    {/each}
  </ul>
  {#if !selectedAttack}
    <div class="description">
      <h4 class="auto">{$globalAttackScenario.name}</h4>
      <p class="text-xs">
        {$globalAttackScenario.description}
      </p>
    </div>
  {:else}
    <div class="description">
      <h4 class="auto">Angriff {selectedAttackIndex + 1}</h4>
      <p class="text-xs">
        {selectedAttack.description}
      </p>
    </div>

    <div class="key-info">
      <h6 class="auto">Benötigte Gegenstände</h6>
      <div class="targets">
        {#each selectedAttack.targets as target}
          {@const stage = getStage(target.stageId)}
          <div class="target">
            <div class="stage">
              {stage.name}
            </div>
            <div class="items">
              {#each stage.defenseItems as item}
                <Item highlightOnHover itemId={item} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .scenarios {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }
  .description {
    flex: 1;
  }
  .attacks {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: -1rem;
    padding: 1rem;
    width: 100%;
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
