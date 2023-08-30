<script lang="ts">
  import Face from '$lib/components/icons/Face.svelte'
  import type { FaceId } from '$lib/game/constants'
  import type { Side } from '$lib/game/types'

  export let name: string
  export let faceId: FaceId | undefined = undefined
  export let isConnected: boolean | undefined = undefined
  export let isPlaying = false
  export let side: Side | 'admin'
</script>

<div class="player side-{side}" class:playing={isPlaying}>
  <div class="face">
    <Face faceId={faceId ?? 0} />
  </div>
  <div class="name">{name}</div>
  {#if isConnected !== undefined}
    <div class="online-status" class:connected={isConnected} />
  {/if}
</div>

<style lang="postcss">
  .player {
    --_radius: var(--radius-md);
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    gap: 0.12rem;
    border-radius: var(--_radius);
    padding-top: 0.5rem;
    width: 4.875rem;
    height: 4.875rem;
    &.playing {
      &::after {
        position: absolute;
        inset: calc(0px - var(--px));
        border: 2px solid white;
        border-radius: var(--_radius);
        content: '';
      }
      .name {
        font-weight: bold;
      }
    }

    &.side-attack {
      background: var(--color-red-medium);
    }
    &.side-defense {
      background: var(--color-blue-medium);
    }
    &.side-admin {
      background: var(--color-blue-transp-12);
    }
    .name {
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      height: 1.25rem;
      font-size: 0.5rem;
    }
    .face {
      width: 2.625rem;
      height: 2.625rem;
    }
    .online-status {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      z-index: var(--layer-4);
      border-radius: var(--radius-full);
      background: orange;
      width: 0.5rem;
      height: 0.5rem;
      &.connected {
        background: #38c60077;
      }
    }
  }
</style>
