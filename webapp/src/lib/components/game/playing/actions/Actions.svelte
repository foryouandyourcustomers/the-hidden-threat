<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import CollectItem from '$lib/components/game/playing/actions/CollectItem.svelte'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const canPerformAction = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Ready for action'),
  )

  const activePlayerPosition = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.activePlayerPosition
  })
</script>

{#if $canPerformAction}
  <div class="actions" style:--x={$activePlayerPosition[0]} style:--y={$activePlayerPosition[1]}>
    <ul class:on-left={$activePlayerPosition[0] > 5} class:on-top={$activePlayerPosition[1] > 4}>
      <li>
        <CollectItem />
      </li>
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
      background: var(--color-bg);
      padding: 1rem;
      list-style-type: none;

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
