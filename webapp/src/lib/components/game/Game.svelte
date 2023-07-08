<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import Lobby from './screens/Lobby.svelte'

  const { machine } = getGameContext()

  export let reportMousePosition: (position: [number, number]) => void

  let gameContainer: HTMLDivElement
  let gameWidth = 1
  let gameHeight = 1

  const onMouseMove = (e: MouseEvent) => {
    reportMousePosition([
      (e.clientX - gameContainer.offsetLeft) / gameWidth,
      (e.clientY - gameContainer.offsetTop) / gameHeight,
    ])
  }

  type Section = 'Lobby' | 'Ingame' | undefined

  const section = useSelector(machine.service, (snapshot) => {
    let section: Section = undefined
    if (snapshot.matches('Lobby')) {
      section = 'Lobby'
    }
    return section
  })
</script>

<div class="game-wrapper">
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
    <div class="actions"><slot name="actions" /></div>
    <div class="content">
      {#if $section === 'Lobby'}
        <Lobby />
      {:else}
        ...
      {/if}
    </div>
    <slot name="cursor-overlays" />
  </div>
</div>

<style lang="postcss">
  .game-wrapper {
    display: grid;
    align-content: center;
    background: #666;
    /* padding: var(--size-2); */
    width: 100%;
    height: 100%;
    @media (min-aspect-ratio: 4/3) {
      align-content: normal;
      justify-items: center;
    }
  }
  .game {
    display: grid;
    position: relative;
    grid-template-rows: 10% 1fr;
    grid-template-columns: 10% 1fr 1fr;
    grid-template-areas:
      'name characters items'
      'actions content content';
    /* container: game / size; */
    background: white;
    aspect-ratio: 4 / 3;
    width: 100%;
    overflow: hidden;
    @media (min-aspect-ratio: 4/3) {
      width: auto;
      height: 100%;
    }
  }
  :global(html) {
    font-size: min(16px, 1vw);
    @media (min-aspect-ratio: 4/3) {
      font-size: min(16px, 1vh * 4 / 3);
    }
  }
  .name {
    grid-area: 'name';
  }
  .characters {
    grid-area: 'characters';
  }
  .items {
    grid-area: 'items';
  }
  .actions {
    grid-area: 'actions';
  }
  .content {
    grid-area: 'content';
  }
</style>
