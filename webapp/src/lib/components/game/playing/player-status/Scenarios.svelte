<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Item from '$lib/components/icons/Item.svelte'
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import { getStage, isTargetedAttack } from '$lib/game/utils'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const activeAttacks = useSelector(
    machine.service,
    (state) => {
      const gameState = GameState.fromContext(state.context)
      const side = getCurrentUser(state.context).side
      return side === 'attack'
        ? gameState.getActiveTargetedAttacks()
        : gameState.getActiveGlobalAttacks()
    },
    isEqual,
  )

  const side = useSelector(machine.service, (state) => getCurrentUser(state.context).side)

  const totalAttackCount = useSelector(machine.service, (state) => {
    const side = getCurrentUser(state.context).side

    return side === 'attack'
      ? state.context.targetedAttacks.length
      : state.context.globalAttacks.length
  })

  let selectedAttackIndex = 0

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  $: selectedAttack = $activeAttacks[selectedAttackIndex]!
</script>

<div class="scenarios">
  <div class="description">
    <Paragraph spacing="none" size="sm"
      >{$side === 'attack' ? 'Gezielter' : 'Allgemeiner'} Angriff</Paragraph
    >

    <Heading size="sm" spacing="none">Angriff {selectedAttackIndex + 1}</Heading>
    <Paragraph size="sm" spacing="none">
      {selectedAttack.description}
    </Paragraph>
    <Heading size="xs" spacing="none">Benötigte Gegenstände</Heading>

    <div class="targets">
      {#if isTargetedAttack(selectedAttack)}
        <div class="target">
          <div class="items">
            {#each selectedAttack.target.requiredItems as item}
              <Item itemId={item} />
            {/each}
          </div>
        </div>
      {:else}
        {#each selectedAttack.targets as target}
          <div class="target">
            <div class="stage">
              {getStage(target.stageId).name}
            </div>
            <div class="items">
              {#each target.requiredItems as item}
                <Item itemId={item} />
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <ul class="attacks">
    {#each new Array($totalAttackCount) as _, index}
      <li class="attack">
        <button
          class:selected={selectedAttackIndex === index}
          disabled={$side === 'attack'
            ? index >= $activeAttacks.length
            : index !== selectedAttackIndex}
          class="unstyled {$side}"
          on:click={() => (selectedAttackIndex = index)}
        >
          <Polygon color={$side === 'attack' ? 'red' : 'orange'} />

          <span>
            Angriff {index + 1}
          </span>
        </button>
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

    .attack {
      button {
        text-wrap: nowrap;
        display: flex;
        position: relative;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        border-radius: var(--radius-xs);
        padding: 0.5rem 0;
        width: 3.625rem;
        height: 5.25rem;
        color: white;
        font-weight: bold;
        font-size: var(--scale-0000);
        text-align: center;

        :global(svg) {
          position: absolute;
          inset: 0.75rem 0.25rem auto;
        }

        &.attack {
          background-color: var(--color-red-polygon);
        }
        &.defense {
          background-color: var(--color-orange-dark);
        }
        &.selected {
          box-shadow: 0px 0px 8px 0px rgba(88, 90, 90, 0.4);
          width: 4rem;
          height: 5.875rem;
        }
      }
    }
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
