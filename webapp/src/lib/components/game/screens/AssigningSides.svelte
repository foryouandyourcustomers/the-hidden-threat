<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
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

<Heading separator>
  Einteilung in Teams

  <svelte:fragment slot="info">Schritt 2 von 3</svelte:fragment>
</Heading>

<p>
  Gleich geht’s los. Sobald alle Teilnehmende sich eingeloggt haben, kann die Spielleitung alle in
  Teams einteilen.
</p>

<div class="users">
  {#each $users as user}
    <div class="user">
      {user.name}
      {#if user.isAdmin}
        <span class="admin">(admin)</span>
      {/if}
      {#if user.isSideAssigned}
        <span class="side">
          {#if user.side === 'attacker'}
            Angriff
          {:else}
            Verteidigung
          {/if}
        </span>
      {/if}
      {#if $canAssignSides}
        <Button on:click={() => assignSide(user.id, 'attacker')}>Angriff</Button>
        <Button on:click={() => assignSide(user.id, 'defender')}>Verteidigung</Button>
      {/if}
      {#if $canAssignAdmin && user.id !== userId}
        <Button on:click={() => assignAdmin(user.id, !user.isAdmin)}>Toggle Admin</Button>
      {/if}
    </div>
  {/each}
</div>

{#if $canContinue}
  <Button on:click={() => machine.send({ type: 'next step' })}>Next</Button>
{/if}

<style lang="postcss">
  .users {
    margin-block: 3rem;
  }
  .side {
    display: inline-block;
    border-radius: 0.5em;
    background: black;
    padding: 0.25rem 0.5rem;
    color: white;
    font-size: 0.875rem;
  }
</style>
