<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Polygon from '$lib/components/icons/Polygon.svelte'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import ShareIcon from '~icons/lucide/share-2'
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

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'The Hidden Threat',
          text: 'The Hidden Threat',
          url: url,
        })
      } else {
        navigator.clipboard.writeText(url)
        copiedLink = true
        setTimeout(() => (copiedLink = false), 2000)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  let copiedLink = false
</script>

<div class="backdrop">
  <Polygon color="blue" />
  <Polygon color="red" />
</div>

<Heading separator>
  Einteilung in Teams

  <svelte:fragment slot="info">Schritt 2 von 3</svelte:fragment>
</Heading>

<div class="intro">
  <p>
    Gleich geht’s los. Sobald alle Teilnehmende sich eingeloggt haben, kann die Spielleitung alle in
    Teams einteilen.
  </p>

  <button class="unstyled share" on:click={share}>
    <ShareIcon />

    {#if copiedLink}
      <Tooltip showOnCreate position="left">Link kopiert!</Tooltip>
    {/if}
  </button>
</div>

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

<Actions spacing="none">
  <Button
    primary
    disabled={!$canContinue}
    disabledReason={$user.isAdmin
      ? 'Alle Spieler:innen müssen einer Seite zugewiesen sein'
      : 'Nur Administrator:innen dürfen bestätigen'}
    on:click={() => machine.send({ type: 'next step' })}>Bestätigen und weiter</Button
  >
</Actions>

<style lang="postcss">
  .columns {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.5fr;
    gap: 3rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    height: 27.5rem;
  }
  .unassigned {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .user {
    border-radius: var(--radius-xs);
    background: var(--color-white-80);
    padding: 0rem 0.5rem;
    height: 2rem;
    overflow: hidden;
    color: var(--color-blue-spielbrett);
    line-height: 2rem;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    &[draggable='true'] {
      cursor: grab;
    }
  }

  .backdrop {
    position: absolute;
    z-index: -1;
    inset: var(--size-header-height) 0 var(--size-game-footer-height) 0;
    overflow: hidden;
    pointer-events: none;

    :global(svg) {
      position: absolute;
      rotate: -15deg;
      z-index: -1;
      width: 28rem;
    }
    :global(:first-child) {
      bottom: -5%;
      left: -12%;
    }
    :global(:last-child) {
      right: -17%;
      bottom: 15%;
    }
  }
  .intro {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .share {
      display: grid;
      position: relative;
      top: -0.4rem;
      place-content: center;
      border: 2px solid white;
      border-radius: var(--radius-full);
      width: 2.5rem;
      height: 2.5rem;
      > :global(svg) {
        position: relative;
        left: -0.08rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
</style>
