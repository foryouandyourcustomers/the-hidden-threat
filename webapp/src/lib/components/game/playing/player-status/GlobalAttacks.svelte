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

  const globalAttackStatuses = useSelector(machine.service, (state) => {
    const gameState = GameState.fromContext(state.context)
    return gameState.globalAttackStatuses
  })

  $: globalAttackStatus = $globalAttackStatuses[selectedAttackIndex]

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
          completed={$globalAttackStatuses[index].successful === false}
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
              <div class="stage-status">
                {#if globalAttackStatus.defended.includes(target.stageId)}
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"
                    ><circle cx="10" cy="10" r="10" fill="#B5BF39" /><path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.3 2.2h-.6L4 4.3c-.2.1-.4.4-.4.7v5c0 2.5 1.6 4.4 3 5.7a16.2 16.2 0 0 0 3 2l.4-.6-.3.7h.6L10 17l.3.7a8 8 0 0 0 1-.6c.5-.3 1.3-.8 2-1.5 1.5-1.3 3.1-3.2 3.1-5.7V5c0-.3-.2-.6-.4-.7l-5.7-2.1Zm.2 13.8-.5.3a14.1 14.1 0 0 1-2.4-1.7C6.2 13.4 5 11.8 5 10V5.5l5-1.9 5 1.9V10c0 1.8-1.2 3.4-2.6 4.6L10.5 16Zm2.1-7a.7.7 0 0 0-1-1l-2.3 2.4-1-1a.7.7 0 0 0-1 1.1l1.5 1.4a.7.7 0 0 0 1 0l2.8-2.8Z"
                      fill="#fff"
                    /></svg
                  >
                {:else if globalAttackStatus.successful === true}
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"
                    ><circle cx="10" cy="10" r="10" fill="#F03A50" /><path
                      d="M11.7 13.7 4 6V4h2l7.7 7.7m-3 3 4-4m-2 2 2.6 2.6m-.6.7 1.3-1.3m-4.3-8.4L14 4h2v2l-2.3 2.3m-8.4 3L8 14m-1.3-.7-2 2m-.7-.6L5.3 16"
                      stroke="#fff"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg
                  >
                {/if}
              </div>
            </div>
            <div class="items">
              {#each stage.defenseItems as item}
                <Item showIfOwned="defense" highlightOnHover itemId={item} />
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
    margin: -1.5rem -1rem -1rem;
    padding: 1rem;
    width: 100%;
    list-style: none;
  }

  .targets {
    display: flex;
    gap: 2rem;

    .stage {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
      font-size: 0.75rem;

      .stage-status {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }

    .items {
      display: flex;
      gap: 0.5rem;
      > :global(svg) {
        width: 2rem;
        height: 2rem;
      }
    }
  }
</style>
