<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import CollectItem from '$lib/components/game/playing/actions/CollectItem.svelte'
  import ExchangeJoker from '$lib/components/game/playing/actions/ExchangeJoker.svelte'
  import { GameState } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'
  import AttackStage from './AttackStage.svelte'
  import DefendStage from './DefendStage.svelte'
  import AskQuestion from './AskQuestion.svelte'

  const { machine } = getGameContext()

  const canPerformAction = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Action'),
  )

  const activePlayerPosition = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)
      return gameState.activePlayerPosition
    },
    isEqual,
  )

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)
</script>

{#if $canPerformAction}
  <div class="actions" style:--x={$activePlayerPosition[0]} style:--y={$activePlayerPosition[1]}>
    <ul class:on-left={$activePlayerPosition[0] > 5} class:on-top={$activePlayerPosition[1] > 4}>
      <li class="title">Aktion auswählen</li>
      <li>
        <CollectItem />
      </li>
      {#if $side === 'attack'}
        <li><AttackStage /></li>
        <li><ExchangeJoker /></li>
      {:else}
        <li><DefendStage /></li>
        <li><AskQuestion /></li>
      {/if}
    </ul>
  </div>
{/if}

<style lang="postcss">
  .actions {
    /* The actions is a 0x0 div that is placed in the top left corner of the square */
    position: absolute;
    top: calc((100% / 8) * (var(--y)));
    left: calc((100% / 9) * (var(--x)));

    & ul {
      position: absolute;
      margin: 0;
      border-radius: var(--radius-sm);
      background: white;
      padding: 0;
      min-width: 15rem;
      overflow: hidden;
      color: black;
      font-size: var(--scale-00);
      list-style-type: none;

      li.title {
        box-shadow: 0 0 0.5rem #0003;
        padding: 0.5rem 1rem;
      }

      &:not(.on-left) {
        left: calc(var(--board-square-size) + 0.3rem);
      }
      &.on-left {
        right: 0.3rem;
      }
      &:not(.on-top) {
        top: 0.3rem;
      }
      &.on-top {
        bottom: calc(0px - var(--board-square-size) + 0.3rem);
      }
    }
  }
</style>
