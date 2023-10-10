<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import AssigningSidesColumn from './AssigningSidesColumn.svelte'

  const { user, machine } = getGameContext()

  const canAssignSides = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'assign side', otherUserId: '', side: 'attack', isAdmin: true }),
  )
  const canContinue = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'next step' }),
  )
  const unassignedUsers = useSelector(machine.service, (snapshot) =>
    snapshot.context.users.filter((user) => !user.isSideAssigned),
  )

  const onDragstart = (e: DragEvent, userId: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('userId', userId)
      e.dataTransfer.effectAllowed = 'move'
    }
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

<div class="columns">
  <AssigningSidesColumn side="defense" />

  <div class="unassigned">
    {#each $unassignedUsers as user}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="user"
        on:dragstart={(e) => onDragstart(e, user.id)}
        draggable={$canAssignSides ? 'true' : 'false'}
      >
        {user.name}
      </div>
    {/each}
  </div>

  <AssigningSidesColumn side="attack" />
</div>

<Actions>
  <Button
    primary
    disabled={!$canContinue}
    disabledReason={$user.isAdmin
      ? 'Alle Spieler:innen müssen einer Seite zugewiesen sein'
      : 'Nur Administrator:innen dürfen bestätigen'}
    on:click={() => machine.send({ type: 'next step' })}>Next</Button
  >
</Actions>

<style lang="postcss">
  .columns {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    gap: 3rem;
    margin-block: 3rem;
    height: 24rem;
  }
  .unassigned {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .user {
    word-wrap: nowrap;
    border-radius: var(--radius-xs);
    background: var(--color-white-80);
    padding: 0rem 0.5rem;
    height: 2rem;
    overflow: hidden;
    color: var(--color-blue-spielbrett);
    line-height: 2rem;
    text-align: center;
    text-overflow: ellipsis;
    &[draggable='true'] {
      cursor: grab;
    }
  }
</style>
