<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { GameState } from '$lib/game/game-state'
  import BackIcon from '~icons/lucide/chevron-left'
  import ExpandableIconButton from './IconButton.svelte'
  import { getCurrentUser } from '$lib/client/game-machine/utils'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)

  const lastGameEvent = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.lastEvent
  })
</script>

{#if $isAdmin}
  <ExpandableIconButton
    disabled={!$lastGameEvent}
    on:click={() =>
      $lastGameEvent
        ? machine.send({ type: 'rollback game event', gameEventType: $lastGameEvent.type })
        : null}
  >
    <BackIcon />
  </ExpandableIconButton>
{/if}
