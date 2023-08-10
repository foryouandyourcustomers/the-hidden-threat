<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import TempActionButton from './TempActionButton.svelte'
  import Finished from './finished/Finished.svelte'
  import Lobby from './lobby/Lobby.svelte'
  import Players from './playing/Players.svelte'
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
    class="game"
    on:mousemove={onMouseMove}
    bind:this={gameContainer}
    bind:clientWidth={gameWidth}
    bind:clientHeight={gameHeight}
  >
    <div class="name">The Hidden Threat</div>
    <div class="characters" />
    <div class="items"><slot name="items" /></div>
    <div class="actions">
      <slot name="actions" />
      {#if $section === 'Playing'}
        <Players />
      {/if}
      <TempActionButton />
    </div>
    <div class="content">
      {#if $section === 'Lobby'}
        <Lobby />
      {:else if $section === 'Playing'}
        <Playing />
      {:else if $section === 'Finished'}
        <Finished />
      {:else}
        Unkown state
      {/if}
    </div>
    <slot name="cursor-overlays" />
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
    grid-template-rows: 10% 1fr;
    grid-template-columns: 30rem 1fr 1fr;
    grid-template-areas:
      'name characters items'
      'actions content content';
    gap: 1rem;
    background: var(--color-bg);
    width: 90rem;
    height: 50.625rem;
    overflow: hidden;
    @media (width < 1440px) or (height < 810px) {
      transform-origin: center;
      scale: 0.8;
    }
    @media (width < 1200px) or (height < 675px) {
      scale: 0.6;
    }
  }
  .name {
    grid-area: name;
  }
  .characters {
    grid-area: characters;
  }
  .items {
    grid-area: items;
  }
  .actions {
    grid-area: actions;
  }
  .content {
    grid-area: content;
    padding-right: 3rem;
  }
</style>
