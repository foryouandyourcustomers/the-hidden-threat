<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
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
    Jokers: {$jokers}
  </div>
{/if}
