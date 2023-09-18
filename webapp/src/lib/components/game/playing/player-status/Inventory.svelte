<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Item from '$lib/components/icons/Item.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { ITEMS } from '$lib/game/constants/items'
  import { GameState, type ItemInventory } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const itemInventories = useSelector(
    machine.service,
    (state): ItemInventory<'attack' | 'defense'> => {
      const gameState = GameState.fromContext(state.context)
      const side = getCurrentUser(state.context).side
      return side === 'attack' ? gameState.attackInventory : gameState.defenseInventory
    },
    isEqual,
  )

  const side = useSelector(machine.service, (state) => getCurrentUser(state.context).side)

  $: sum = Object.values($itemInventories).reduce((prev, cur) => prev + cur, 0)
</script>

<Heading size="sm" spacing="none">Gesammelte Schadensgegenstände</Heading>
<Paragraph size="sm" spacing="none">
  Die Gegenstandsbeschreibungen sowie die Auflistung aller Gegenstände sind in der Spielanleitung zu
  finden.
</Paragraph>

<ul class="items">
  {#each ITEMS as item}
    {#if item.side === $side}
      <li class="item">
        <Item itemId={item.id} />
        <div>{item.name} <strong>{$itemInventories[item.id]}</strong></div>
      </li>
    {/if}
  {/each}
</ul>
<div class="sum">{$side === 'attack' ? 'Schadensgegenstände' : 'Schutzgegenstände'} {sum}</div>

<style lang="postcss">
  .items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
    margin: 0rem;
    padding: 0rem;
    list-style: none;
    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 40%;
      font-size: var(--scale-000);

      :global(svg) {
        display: block;
        width: 2rem;
        height: 2rem;
      }
    }
  }
  .sum {
    font-size: var(--scale-000);
  }
</style>
