<script lang="ts">
  import Face from '$lib/components/icons/Face.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import type { FaceId } from '$lib/game/constants/faces'
  import type { Side } from '$lib/game/types'

  export let name: string
  export let character: string
  export let characterAbility: string | undefined = undefined
  export let faceId: FaceId | undefined = undefined
  export let isConnected: boolean | undefined = undefined
  export let isPlaying = false
  export let side: Side | 'admin'
  export let showFace = true
</script>

<button class="unstyled player side-{side}" class:playing={isPlaying}>
  <Tooltip click position="bottom">
    <div class="tooltip-content">
      <div class="header">
        <div class="face">
          <Face faceId={faceId ?? 0} />
        </div>
        <div class="description">
          <div class="character">{character}</div>
          <div class="name">{name}</div>
        </div>
      </div>

      {#if side === 'admin'}
        <Heading size="sm" spacing="none">Spielleitung</Heading>
        <Paragraph size="sm" spacing="none">
          Kann Spielseite wechseln und alle Züge rückgängig machen.
        </Paragraph>
      {:else if characterAbility}
        <Heading size="sm" spacing="none">Fähigkeit</Heading>
        <Paragraph size="sm" spacing="none">
          {characterAbility}
        </Paragraph>
      {/if}
    </div>
  </Tooltip>
  {#if showFace}
    <div class="face">
      <Face faceId={faceId ?? 0} />
    </div>
  {/if}
  <div class="description">
    <div class="character">{character}</div>
    <div class="name">{name}</div>
  </div>
  {#if isConnected !== undefined}
    <div class="online-status" class:connected={isConnected} />
  {/if}
</button>

<style lang="postcss">
  .player {
    --_radius: var(--radius-sm);
    display: flex;
    position: relative;
    align-items: center;
    border-radius: var(--_radius);
    width: 100%;
    height: 3.125rem;

    &.playing {
      &::after {
        position: absolute;
        inset: calc(0px - var(--px));
        border: 2px solid white;
        border-radius: var(--_radius);
        content: '';
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
    .description {
      padding-inline: 0.5rem;
      min-width: 0;
      .character,
      .name {
        text-wrap: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .character {
        font-size: var(--scale-00);
      }
      .name {
        font-size: var(--scale-000);
      }
    }
    .face {
      flex-shrink: 0;
      background: #fff1;
      padding: 0.375rem;
      aspect-ratio: 1;
      height: 100%;
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

  .tooltip-content {
    .header {
      display: flex;
      align-items: center;
      gap: 0rem;
      margin-bottom: 0.5rem;
      .description {
        .character {
          font-weight: bold;
          font-size: var(--scale-0);
        }
        .name {
          font-size: var(--scale-00);
        }
      }
      .face {
        border-radius: var(--radius-sm);
        width: 3.125rem;
        height: 3.125rem;
        color: white;
        .side-attack & {
          background: var(--color-red-medium);
        }
        .side-defense & {
          background: var(--color-blue-medium);
        }
        .side-admin & {
          background: var(--color-blue-transp-12);
        }
      }
    }
  }
</style>
