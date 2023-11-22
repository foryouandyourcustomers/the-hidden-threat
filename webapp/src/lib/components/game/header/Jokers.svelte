<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Joker from '$lib/components/icons/Joker.svelte'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const jokers = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).jokers,
  )
  const side = useSelector(machine.service, (state) => getCurrentUser(state.context).side)
</script>

{#if $side === 'attack'}
  <div class="jokers">
    <button class="unstyled">
      <Joker />
      Jokerkarten ({$jokers})
    </button>
  </div>
{/if}

<style lang="postcss">
  .jokers {
    display: flex;
    grid-area: jokers;
    justify-content: center;
    align-items: center;

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: var(--scale-00);
    }
  }
</style>
