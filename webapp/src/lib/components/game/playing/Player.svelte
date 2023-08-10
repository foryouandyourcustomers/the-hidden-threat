<script lang="ts">
  import Face from '$lib/components/icons/Face.svelte'
  import type { FaceId } from '$lib/game/constants'

  export let name: string
  export let faceId: FaceId | undefined = undefined
  export let isConnected = false
  export let isPlaying = false
</script>

<div class="player" class:playing={isPlaying}>
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
    &.playing {
      border: 2px solid green;
    }
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
