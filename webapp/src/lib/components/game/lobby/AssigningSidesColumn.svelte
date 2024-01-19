<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Heading from '$lib/components/ui/Heading.svelte'
  import type { Side } from '$lib/game/types'

  export let side: Side

  let target: 'players' | 'admins' | undefined = undefined

  const { userId, machine } = getGameContext()

  const canAssignSides = useSelector(machine.service, (snapshot) =>
    snapshot.can({ type: 'assign side', otherUserId: '', side: 'attack', isAdmin: true }),
  )

  const users = useSelector(machine.service, (snapshot) =>
    snapshot.context.users
      .filter((user) => user.side === side && user.isSideAssigned)
      .sort((a, b) => a.name.localeCompare(b.name)),
  )

  const assignSide = (userId: string, isAdmin: boolean) => {
    machine.send({
      type: 'assign side',
      otherUserId: userId,
      side,
      isAdmin,
    })
  }

  const onDragstart = (e: DragEvent, userId: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('userId', userId)
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const onDrop = (e: DragEvent, tgt: 'players' | 'admins') => {
    target = undefined
    if (e.dataTransfer) {
      if (e.dataTransfer.getData('userId') === userId && tgt === 'players') {
        window.alert('Du kannst Dir nicht selbst aus der Spielleitung entfernen')
      } else {
        assignSide(e.dataTransfer.getData('userId'), tgt === 'admins')
      }
    }
  }

  // If you want to restrict the number of possible admins per side, you can set this to a lower number.
  const maxAdmins = 999

  const onDragover = (e: DragEvent, tgt: 'players' | 'admins') => {
    if (e.dataTransfer) {
      if (tgt === 'admins' && $users.filter((user) => user.isAdmin).length >= maxAdmins) {
        target = undefined
        e.dataTransfer.dropEffect = 'none'
      } else {
        target = tgt
        e.dataTransfer.dropEffect = 'move'
      }
    }
  }

  $: usersColumnCount = Math.ceil(($users.length + (Math.ceil($users.length / 5) - 1)) / 5)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="assigned {side}"
  class:can-assign={$canAssignSides}
  style:--column-count={usersColumnCount}
>
  <Heading centered size="lg" spacing="none">
    {#if side === 'defense'}Verteidigung{:else}Angriff{/if}
  </Heading>
  {#if $users.length <= 1}
    <div class="explanation">
      <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.1 22.9V20a1.5 1.5 0 0 1 0-.4v-9c0-2.5 2-4.5 4.6-4.5h12.1c2.6 0 4.6 2 4.6 4.6v3c0 .9-.6 1.5-1.5 1.5-.8 0-1.5-.6-1.5-1.5v-3c0-.9-.7-1.6-1.5-1.6H20a1.5 1.5 0 0 1-.4 0h-9c-.8 0-1.5.7-1.5 1.6v12.1c0 .9.7 1.6 1.6 1.6h3a1.5 1.5 0 1 1 0 3h-3C8 27.4 6 25.4 6 23Zm-6.1-3a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm0-6.2a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm0-6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm0-6.2a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM7.6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6.1 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6.1 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-4.4 17.4L19.9 31a1.5 1.5 0 0 0 2.8.2l2.8-5.7 5.7-2.8a1.5 1.5 0 0 0-.2-2.8l-13.7-4.6h-.5a1.5 1.5 0 0 0-1.5 1.2v1Zm11.1 4.2-7.3-2.4 2.4 7.3 1.4-2.8.7-.7 2.8-1.4Z"
          fill="#fff"
        />
      </svg>
      <p>Ziehe die entsprechende Anzahl an Spieler:innen in die gewünschten Felder.</p>
    </div>
  {/if}
  <div
    class="users players"
    class:target={target === 'players'}
    on:drop={(e) => onDrop(e, 'players')}
    on:dragover|preventDefault={(e) => onDragover(e, 'players')}
    on:dragleave|preventDefault={() => (target = undefined)}
  >
    <h3 class="auto">Spieler:innen</h3>
    <div class="user-list">
      {#each $users.filter((user) => !user.isAdmin) as user (user.id)}
        <div
          class="user"
          on:dragstart={(e) => onDragstart(e, user.id)}
          draggable={$canAssignSides ? 'true' : 'false'}
        >
          {user.name}
        </div>
      {/each}
    </div>
  </div>
  <div
    class="users admins"
    class:target={target === 'admins'}
    on:drop={(e) => onDrop(e, 'admins')}
    on:dragover|preventDefault={(e) => onDragover(e, 'admins')}
    on:dragleave|preventDefault={() => (target = undefined)}
  >
    <h3 class="auto">Spielleitung</h3>
    <div class="user-list">
      {#each $users.filter((user) => user.isAdmin) as user (user.id)}
        <div
          class="user"
          on:dragstart={(e) => onDragstart(e, user.id)}
          draggable={$canAssignSides ? 'true' : 'false'}
        >
          {user.name}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .assigned {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-radius: var(--radius-md);
    background-color: var(--color-blue-transp-760);
    padding: 0.5rem 1.25rem 1.25rem;
  }
  .users {
    border-radius: var(--radius-sm);
    background: var(--color-bg);
    padding: 0.5rem 0.8rem 0.8rem;
    text-align: center;

    .user-list {
      display: grid;
      grid-template-columns: repeat(var(--column-count, 1), 1fr);
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    &.players {
      flex: 1;
    }
    &.admins {
      min-height: 5.5rem;
    }
    &.target {
      outline: 2px solid var(--color-orange-dark);
    }
  }
  .user {
    word-wrap: nowrap;
    border-radius: var(--radius-xs);
    background: var(--color-blue-transp-760);
    padding: 0rem 0.5rem;
    height: 2rem;
    overflow: hidden;
    line-height: 2rem;
    text-align: center;
    text-overflow: ellipsis;
    &[draggable='true'] {
      cursor: grab;
    }
  }
  .explanation {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    svg {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
    }
    p {
      font-size: var(--scale-00);
    }
  }
</style>
