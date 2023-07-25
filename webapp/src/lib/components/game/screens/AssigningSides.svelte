<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { Side } from '$lib/game/types'

  const { userId, machine } = getGameContext()

  const canAssignSides = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'assign side', otherUserId: '', side: 'attacker' }),
  )
  const canAssignAdmin = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'assign admin', otherUserId: '', isAdmin: true }),
  )
  const canContinue = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'next step' }),
  )
  const users = useSelector(machine.service, (snapshot) => snapshot.context.users)

  const assignSide = (userId: string, side: Side) => {
    machine.send({
      type: 'assign side',
      otherUserId: userId,
      side,
    })
  }
  const assignAdmin = (userId: string, isAdmin: boolean) => {
    machine.send({
      type: 'assign admin',
      otherUserId: userId,
      isAdmin,
    })
  }
</script>

<h1>Einteilung in Teams</h1>

<div class="users">
  {#each $users as user}
    <div class="user">
      {user.name}
      {#if user.isAdmin}
        <span class="admin">admin</span>
      {/if}
      <span class="side">
        {#if user.side === 'attacker'}
          Angriff
        {:else if user.side === 'defender'}
          Verteidigung
        {:else}
          ---
        {/if}
      </span>
      {#if $canAssignSides}
        <button on:click={() => assignSide(user.id, 'attacker')}>Angriff</button>
        <button on:click={() => assignSide(user.id, 'defender')}>Verteidigung</button>
      {/if}
      {#if $canAssignAdmin && user.id !== userId}
        <button on:click={() => assignAdmin(user.id, !user.isAdmin)}>Toggle Admin</button>
      {/if}
    </div>
  {/each}
</div>

{#if $canContinue}
  <button on:click={() => machine.send({ type: 'next step' })}>Next</button>
{/if}

<style lang="postcss">
  .side {
    display: inline-block;
    border-radius: 0.5em;
    background: black;
    padding: 0.25rem 0.5rem;
    color: white;
    font-size: 0.875rem;
  }
</style>
