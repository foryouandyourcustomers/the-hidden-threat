<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '../context'

  const context = getGameContext()

  const users = useSelector(context.machine.service, ({ context }) => context.users)
</script>

<div class="users">
  <h3>Users</h3>
  {#each $users as user}
    <p>
      {#if user.isConnected}🟢{:else}🟠{/if}
      {user.name}
    </p>
  {/each}
</div>

<style lang="postcss">
  .users {
    position: fixed;
    top: var(--size-2);
    right: var(--size-2);
    border: 2px solid var(--color-grey-200);
    border-radius: var(--radius-md);
    background: white;
    padding: var(--size-2) var(--size-3);
  }
</style>
