<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import IconRightLeft from '~icons/lucide/arrow-right-left'
  import IconLeftRight from '~icons/lucide/arrow-left-right'
  import ClickableOption from './ClickableOption.svelte'

  const { machine } = getGameContext()
  const user = useSelector(machine.service, ({ context }) => getCurrentUser(context))
  const isActive = useSelector(machine.service, (state) => state.matches('Playing.Gameloop'))
  $: isAdmin = $user.isAdmin
  $: side = $user.side
</script>

{#if isAdmin}
  <ClickableOption
    disabled={!isAdmin || !$isActive}
    on:click={() => machine.send({ type: 'switch sides' })}
  >
    <svelte:fragment slot="icon">
      {#if side === 'attack'}
        <IconRightLeft />
      {:else}
        <IconLeftRight />
      {/if}
    </svelte:fragment>
    Zu {side === 'attack' ? 'Verteidigung' : 'Angriff'} wechseln
  </ClickableOption>
{/if}
