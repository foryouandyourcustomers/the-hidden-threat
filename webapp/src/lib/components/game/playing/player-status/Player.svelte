<script lang="ts">
  import Face from '$lib/components/icons/Face.svelte'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import Tooltip from '$lib/components/ui/Tooltip.svelte'
  import type { FaceId } from '$lib/game/constants/faces'
  import type { Side } from '$lib/game/types'
  import SelfIcon from '~icons/lucide/check-circle'

  export let name: string
  export let character: string
  export let characterAbility: string | undefined = undefined
  export let faceId: FaceId | undefined = undefined
  export let isConnected: boolean | undefined = undefined
  export let isPlaying = false
  export let isSelf = false
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
      {#if isConnected === false}
        <div class="disconnected">Spieler:in ist nicht connected.</div>
      {/if}

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
  {#if isSelf}
    <div class="self-indicator"><SelfIcon /></div>
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
        border: 2px solid rgba(255, 255, 255, 0.7);
        border-radius: var(--_radius);
        content: '';
      }
    }

    &.side-attack {
      background: #7c0d24;
      background: color-mix(in oklab, #7c0d24, transparent 30%);
      .face {
        background: #94142e;
      }
    }
    &.side-defense {
      background: var(--color-blue-polygon);
      background: color-mix(in oklab, var(--color-blue-polygon), transparent 20%);
      .face {
        background: var(--color-blue-medium);
      }
    }
    &.side-admin {
      background: var(--color-blue-transp-12);
      background: color-mix(in oklab, var(--color-blue-transp-12), transparent 20%);
      .face {
        background: #445784;
      }
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
      border-radius: var(--_radius);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding: 0.375rem;
      aspect-ratio: 1;
      height: 100%;
    }
    .self-indicator {
      position: absolute;
      top: -0.125rem;
      right: -0.0625rem;
      width: 0.875rem;
      height: 0.875rem;
      :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .online-status {
      position: absolute;
      right: 0.25rem;
      bottom: 0.25rem;
      z-index: var(--layer-4);
      border-radius: var(--radius-full);
      background: var(--color-orange-dark);
      width: 0.5rem;
      height: 0.5rem;
      &.connected {
        display: none;
      }
    }
  }
  .disconnected {
    color: var(--color-orange-dark);
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
