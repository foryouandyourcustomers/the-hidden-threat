<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'
  import type { PlayerId, Side } from '$lib/game/types'

  export let side: Side
  export let playerId: PlayerId

  const { machine } = getGameContext()
</script>

<div class="configurator">
  {side}
  {playerId}

  <button on:click={() => machine.send({ type: 'stop editing player', side })}>Close</button>
</div>

<style lang="postcss">
  .configurator {
    display: grid;
    position: fixed;
    place-content: center;
    z-index: 100000;
    inset: 0;
    background: #fffe;
  }
</style>
