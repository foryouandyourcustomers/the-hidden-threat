<script lang="ts">
  import type { FaceId } from '$lib/game/constants/faces'
  import type { Side } from '$lib/game/types'
  import Player from './Player.svelte'

  type PlayerDescription = {
    isSelf: boolean
    faceId: FaceId
    name: string
    character: string
    characterAbility?: string | undefined
    isConnected: boolean
    isPlaying: boolean
  }

  export let players: PlayerDescription[]
  export let side: Side | 'admin'
</script>

<div class="wrapper">
  <h3>
    {#if side === 'attack'}
      Angreifer:in
    {:else if side === 'defense'}
      Verteidiger:innen
    {:else}
      Spielleitung
    {/if}
  </h3>

  <div class="players side-{side}">
    {#each players as player}
      <div class="player">
        <Player
          faceId={player.faceId}
          name={player.name}
          character={player.character}
          characterAbility={player.characterAbility}
          isConnected={player.isConnected}
          isPlaying={player.isPlaying}
          isSelf={player.isSelf}
          {side}
          showFace={side !== 'admin' || players.length <= 3}
        />
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  h3 {
    margin-block: 0 0.25rem;
    font: var(--text-small);
    font-size: 1rem;
    font-family: var(--font-display);
    text-transform: uppercase;
  }

  .players {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 0.75rem;

    &.side-admin {
      grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
    }
  }
</style>
