<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Finished from './finished/Finished.svelte'
  import Header from './header/Header.svelte'
  import Lobby from './lobby/Lobby.svelte'
  import Playing from './playing/Playing.svelte'

  const { machine } = getGameContext()

  export let reportMousePosition: (position: [number, number]) => void

  let gameContainer: HTMLDivElement
  let gameWidth = 1
  let gameHeight = 1

  const onMouseMove = (e: MouseEvent) => {
    // This is an ugly way to work around the wrong cursor position when the
    // board is scaled down.
    const scale = window.matchMedia('(width < 1200px) or (height < 675px)').matches
      ? 0.6
      : window.matchMedia('(width < 1200px) or (height < 675px)').matches
      ? 0.8
      : 1
    const x = (e.clientX - gameContainer.offsetLeft) / gameWidth
    const y = (e.clientY - gameContainer.offsetTop) / gameHeight
    reportMousePosition([(x - (1 - scale) / 2) / scale, (y - (1 - scale) / 2) / scale])
  }

  type Section = 'Lobby' | 'Playing' | 'Finished' | undefined

  const section = useSelector(machine.service, (snapshot) => {
    let section: Section = undefined
    if (snapshot.matches('Lobby')) {
      section = 'Lobby'
    } else if (snapshot.matches('Playing')) {
      section = 'Playing'
    } else if (snapshot.matches('Finished')) {
      section = 'Finished'
    }
    return section
  })
</script>

<div class="game-wrapper">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="game section-{$section?.toLowerCase()}"
    on:mousemove={onMouseMove}
    bind:this={gameContainer}
    bind:clientWidth={gameWidth}
    bind:clientHeight={gameHeight}
  >
    <Header />
    <div class="content">
      {#if $section === 'Lobby'}
        <Lobby />
      {:else if $section === 'Playing'}
        <Playing />
      {:else if $section === 'Finished'}
        <Finished />
      {:else}
        Unknown state
      {/if}
    </div>
    <slot name="overlays" />
  </div>
</div>

<style lang="postcss">
  .game-wrapper {
    display: grid;
    place-content: center;
    background: black;
    /* padding: 0.5rem; */
    width: 100%;
    height: 100%;
  }
  .game {
    display: grid;
    position: relative;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-bg);
    width: var(--size-game-width);
    height: var(--size-game-height);
    overflow: hidden;

    &.section-playing {
      background-image: url('/images/board-backdrop.svg');
      background-size: cover;
      background-repeat: no-repeat;
    }
    @media (width < 1440px) or (height < 810px) {
      transform-origin: center;
      scale: 0.8;
    }
    @media (width < 1200px) or (height < 675px) {
      scale: 0.6;
    }
  }

  .content {
    isolation: isolate;
  }
</style>
