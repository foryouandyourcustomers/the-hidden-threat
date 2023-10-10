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
    snapshot.context.users.filter((user) => user.side === side && user.isSideAssigned),
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

  const onDragover = (e: DragEvent, tgt: 'players' | 'admins') => {
    if (e.dataTransfer) {
      console.log('a', e, e.dataTransfer.getData('userId'), 'i', userId)
      if (tgt === 'admins' && $users.filter((user) => user.isAdmin).length > 0) {
        target = undefined
        e.dataTransfer.dropEffect = 'none'
      } else {
        target = tgt
        e.dataTransfer.dropEffect = 'move'
      }
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="assigned {side}" class:can-assign={$canAssignSides}>
  <Heading centered size="lg" spacing="none">
    {#if side === 'defense'}Verteidigung{:else}Angriff{/if}
  </Heading>
  <div
    class="users players"
    class:target={target === 'players'}
    on:drop={(e) => onDrop(e, 'players')}
    on:dragover|preventDefault={(e) => onDragover(e, 'players')}
    on:dragleave|preventDefault={() => (target = undefined)}
  >
    <Heading centered size="sm">Spieler:innen</Heading>
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
  <div
    class="users admins"
    class:target={target === 'admins'}
    on:drop={(e) => onDrop(e, 'admins')}
    on:dragover|preventDefault={(e) => onDragover(e, 'admins')}
    on:dragleave|preventDefault={() => (target = undefined)}
  >
    <Heading centered size="sm">Spielleitung</Heading>
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
    &.players {
      flex: 1;
    }
    &.admins {
      min-height: 6.25rem;
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
</style>
