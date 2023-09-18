<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import BackIcon from '~icons/lucide/undo-2'
  import ExpandableButton from './ExpandableButton.svelte'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)

  const lastGameEvent = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.lastEvent
  })
</script>

{#if $isAdmin}
  <ExpandableButton
    disabled={!$lastGameEvent}
    on:click={() =>
      $lastGameEvent
        ? machine.send({ type: 'rollback game event', gameEventType: $lastGameEvent.type })
        : null}
  >
    Aktion zurücksetzen

    <BackIcon slot="icon" />
  </ExpandableButton>
{/if}
