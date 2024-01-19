<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Icon from '~icons/lucide/undo-2'
  import ClickableOption from './ClickableOption.svelte'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)
  const isActive = useSelector(machine.service, (state) => state.matches('Playing.Gameloop'))

  const lastGameEvent = useSelector(machine.service, ({ context }) => {
    return context.events[context.events.length - 1]
  })
</script>

{#if $isAdmin}
  <ClickableOption
    disabled={!$lastGameEvent || !$isActive}
    on:click={() =>
      $lastGameEvent
        ? machine.send({ type: 'rollback game event', gameEventType: $lastGameEvent.type })
        : null}
  >
    <Icon slot="icon" />

    Aktion zurücksetzen
  </ClickableOption>
{/if}
