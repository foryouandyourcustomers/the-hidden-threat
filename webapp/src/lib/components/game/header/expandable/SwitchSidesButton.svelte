<script>
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import IconRightLeft from '~icons/lucide/arrow-right-left'
  import IconLeftRight from '~icons/lucide/arrow-left-right'
  import ExpandableButton from './ExpandableButton.svelte'

  const { machine } = getGameContext()
  const user = useSelector(machine.service, ({ context }) => getCurrentUser(context))
  $: isAdmin = $user.isAdmin
  $: side = $user.side
</script>

{#if isAdmin}
  <ExpandableButton disabled={!isAdmin} on:click={() => machine.send({ type: 'switch sides' })}>
    Zu {side === 'attack' ? 'Verteidigung' : 'Angriff'} wechseln
    {#if side === 'attack'}
      <IconRightLeft slot="icon" />
    {:else}
      <IconLeftRight slot="icon" />
    {/if}
  </ExpandableButton>
{/if}
