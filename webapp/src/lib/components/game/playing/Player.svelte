<script lang="ts">
  import type { FaceId } from '$lib/game/constants'
  import Face from '../Face.svelte'

  export let name: string
  export let faceId: FaceId | undefined = undefined
  export let isConnected = false
</script>

<div class="player">
  <Face faceId={faceId ?? 0} />
  {name}
  <div class="online-status" class:connected={isConnected} />
</div>

<style lang="postcss">
  .player {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .online-status {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: var(--radius-full);
    background: orange;
    width: 0.5rem;
    height: 0.5rem;
    &.connected {
      background: green;
    }
  }
</style>
