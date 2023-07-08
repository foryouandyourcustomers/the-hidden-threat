<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { User } from '$lib/game/types'
  import Cursor from './Cursor.svelte'

  export let mousePositions: MousePositions = {}

  type MousePositions = { [key: string]: [number, number] }

  const context = getGameContext()

  let gameWidth = 1
  let gameHeight = 1

  const users = useSelector(context.machine.service, (state) => state.context.users)
  const getMousePositions = (users: User[], mousePositions: MousePositions) => {
    return users
      .filter((user) => user.isConnected && !!mousePositions[user.id])
      .map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const percentages = mousePositions[user.id]!
        return {
          id: user.id,
          name: user.name,
          position: [percentages[0] * gameWidth, percentages[1] * gameHeight] as [number, number],
        }
      })
  }

  $: userMousePositions = getMousePositions($users, mousePositions)
</script>

<div class="cursor-overlays" bind:clientWidth={gameWidth} bind:clientHeight={gameHeight}>
  {#each userMousePositions as position (position.id)}
    <Cursor {position} />
  {/each}
</div>

<style lang="postcss">
  .cursor-overlays {
    position: absolute;
    z-index: var(--layer-top);
    inset: 0;
    pointer-events: none;
  }
</style>
