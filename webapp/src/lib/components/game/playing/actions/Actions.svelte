<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import CollectItem from '$lib/components/game/playing/actions/CollectItem.svelte'

  const { machine } = getGameContext()

  const canPerformAction = useSelector(machine.service, (state) =>
    state.matches('Playing.Ready for action'),
  )
</script>

{#if $canPerformAction}
  <ul class="actions">
    <li>
      <CollectItem />
    </li>
  </ul>
{/if}

<style lang="postcss">
  .actions {
    position: absolute;
    top: 50%;
    left: 50%;
    background: white;
    padding: 1rem;
  }
</style>
