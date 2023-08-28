<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Item from '$lib/components/icons/Item.svelte'
  import { GameState } from '$lib/game/game-state'
  import { objectEntries } from '$lib/utils'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const currentRound = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).currentRound,
  )

  const itemInventories = useSelector(
    machine.service,
    (state) => {
      const gameState = GameState.fromContext(state.context)
      return { attack: gameState.attackInventory, defense: gameState.defenseInventory }
    },
    isEqual,
  )
</script>

Round: {$currentRound + 1}

Defense:
{#each objectEntries($itemInventories.defense) as [itemId, count]}
  {#if count > 0}
    <div><Item {itemId} />: {count}</div>
  {/if}
{/each}

Attack:
{#each objectEntries($itemInventories.attack) as [itemId, count]}
  {#if count > 0}
    <div><Item {itemId} />: {count}</div>
  {/if}
{/each}

<style lang="postcss">
</style>
