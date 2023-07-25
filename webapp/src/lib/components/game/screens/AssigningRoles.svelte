<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getUser } from '$lib/client/game-machine/utils'
  import AssigningRolesAttack from './AssigningRolesAttack.svelte'
  import AssigningRolesDefense from './AssigningRolesDefense.svelte'
  import PlayerConfigurator from './PlayerConfigurator.svelte'

  const { machine } = getGameContext()

  const side = useSelector(machine.service, ({ context }) => {
    const { side } = getUser(context)
    return side
  })

  const editingPlayerId = useSelector(
    machine.service,
    ({ context }) => ($side === 'attacker' ? context.attack : context.defense).editingPlayer,
  )
</script>

{#if $side === 'attacker'}
  <AssigningRolesAttack />
{:else if $side === 'defender'}
  <AssigningRolesDefense />
{/if}

{#if $side && $editingPlayerId !== undefined}
  <PlayerConfigurator side={$side} playerId={$editingPlayerId} />
{/if}
