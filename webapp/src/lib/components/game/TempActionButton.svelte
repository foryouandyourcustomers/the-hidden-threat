<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import { getCurrentGameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'

  const { machine } = getGameContext()

  const currentRound = useSelector(
    machine.service,
    ({ context }) => getCurrentGameState(context).currentRound,
  )

  const getActionEvent = (context: SharedGameContext): ClientEventOf<'apply game event'> => {
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'collect',
        finalized: true,
        playerId: getCurrentGameState(context).activePlayerId,
        item: 'alarm',
      },
    }
  }

  const canPerformAction = useSelector(machine.service, (state) =>
    state.can(getActionEvent(machine.service.getSnapshot().context)),
  )

  const performAction = () => {
    machine.send(getActionEvent(machine.service.getSnapshot().context))
  }
</script>

Round: {$currentRound + 1}

{#if $canPerformAction}
  <button on:click={performAction}>Perform Action</button>
{/if}

<style lang="postcss">
</style>
