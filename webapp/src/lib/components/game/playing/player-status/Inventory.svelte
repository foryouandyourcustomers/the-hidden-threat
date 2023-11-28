<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Item from '$lib/components/icons/Item.svelte'
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

<div class="inventory">
  <div class="header">
    <h6 class="auto">
      Gesammelte {$side === 'attack' ? 'Schadensgegenstände' : 'Schutzgegenstände'} ({sum})
    </h6>
    <Paragraph size="sm" spacing="none">
      Die Gegenstandsbeschreibungen sowie die Auflistung aller Gegenstände sind in der
      <a href="/manual" target="_blank">Spielanleitung</a> zu finden.
    </Paragraph>
  </div>

  <ul class="items">
    {#each ITEMS as item}
      {#if item.side === $side}
        <li class="item">
          <Item highlightOnHover itemId={item.id} />
          <div>{item.name} <strong>({$itemInventories[item.id]})</strong></div>
        </li>
      {/if}
    {/each}
  </ul>
</div>

<style lang="postcss">
  .inventory {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
  }
  .items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
    flex: 1;
    margin: 0rem;
    padding: 0 0.5rem;
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
</style>
