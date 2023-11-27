<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { BOARD_SUPPLY_CHAINS } from '$lib/game/constants/board-stages'
  import type { TargetedAttack } from '$lib/game/constants/targeted-attacks'
  import { GameState } from '$lib/game/game-state'
  import type { Coordinate } from '$lib/game/types'
  import { getStage } from '$lib/game/utils'
  import { throwIfNotFound } from '$lib/utils'
  import isEqual from 'lodash/isEqual'
  import AttackCard from './AttackCard.svelte'

  const { machine, highlightedFields } = getGameContext()

  const activeAttacks = useSelector(
    machine.service,
    (state) => GameState.fromContext(state.context).activeTargetedAttacks,
    isEqual,
  )

  const totalAttackCount = useSelector(
    machine.service,
    (state) => state.context.targetedAttacks.length,
  )

  let selectedAttackIndex = 0

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  $: selectedAttack = $activeAttacks[selectedAttackIndex]!

  $: selectedStage = getStage(selectedAttack.target.stageId)

  const getPositionForTarget = (target: TargetedAttack['target']) => {
    return (
      BOARD_SUPPLY_CHAINS.flat().find(
        (stage) => stage.id === target.stageId && stage.supplyChainId === target.supplyChainId,
      ) ?? throwIfNotFound()
    ).coordinate
  }

  const highlightAttack = (attackIndex: number | null) => {
    let highlighted: Coordinate[] | undefined = undefined

    if (attackIndex !== null) {
      highlighted = [getPositionForTarget($activeAttacks[attackIndex].target)]
    }

    console.log('highlighting', highlighted, attackIndex)

    highlightedFields.update((fields) => ({
      ...fields,
      info: highlighted,
    }))
  }
</script>

<div class="scenarios">
  <div class="description">
    <Paragraph spacing="none" size="sm">Gezielter Angriff</Paragraph>

    <Heading size="sm" spacing="none">Angriff {selectedAttackIndex + 1}</Heading>
    <Paragraph size="sm" spacing="none">
      {selectedAttack.description}
    </Paragraph>

    <Heading size="xs" spacing="none">Aufgabe</Heading>
    <Paragraph size="sm" spacing="none">
      Legt {selectedStage.gender === 'f' ? 'die' : selectedStage.gender === 'n' ? 'das' : 'den'}
      {selectedStage.name} der Supply Chain {selectedAttack.target.supplyChainId + 1} lahm.
    </Paragraph>

    <Heading size="xs" spacing="none">Benötigte Gegenstände</Heading>

    <div class="targets">
      <div class="target">
        <div class="items">
          {#each selectedAttack.target.requiredItems as item}
            <Item highlightOnHover itemId={item} />
          {/each}
        </div>
      </div>
    </div>
  </div>
  <ul class="attacks">
    {#each new Array($totalAttackCount) as _, index}
      {@const disabled = index >= $activeAttacks.length}
      <li
        on:mouseenter={() => (disabled ? undefined : highlightAttack(index))}
        on:mouseleave={() => highlightAttack(null)}
      >
        <AttackCard
          side="attack"
          selected={selectedAttackIndex === index}
          {disabled}
          on:click={() => (selectedAttackIndex = index)}
        >
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

    .items {
      display: flex;
      gap: 0.5rem;
    }
  }
</style>
