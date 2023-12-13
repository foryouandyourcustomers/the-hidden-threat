<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'
  import Heading from '$lib/components/ui/Heading.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import {
    ABILITIES,
    CHARACTERS,
    isDefenseCharacter,
    type CharacterId,
  } from '$lib/game/constants/characters'
  import type { Player, Side } from '$lib/game/types'

  export let player: Player

  const { machine } = getGameContext()

  $: side = (player.id === 'attacker' ? 'attack' : 'defense') as Side

  $: characters = CHARACTERS.filter((character) => character.side === side)

  const updateCharacter = (character: CharacterId) => {
    machine.send({
      type: 'assign role',
      character,
      playerId: player.id,
      playingUserId: player.userId,
      faceId: player.faceId,
    })
  }

  $: activeCharacter = characters.find((character) => character.id === player.character)
</script>

<div class="roles">
  <div class="tabs">
    {#each characters as character}
      <button
        class="unstyled tab"
        on:click={() => updateCharacter(character.id)}
        class:active={player.character === character.id}
      >
        {character.name}

        <svg
          class="icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" />
          {#if player.character === character.id}
            <circle cx="12" cy="12" r="6" fill="currentColor" />
          {/if}
        </svg>
      </button>
    {/each}
  </div>
  <div class="content">
    <div>
      <h5 class="auto">Beschreibung</h5>
      <Paragraph spacing="none">
        {#if activeCharacter}
          {activeCharacter.description}
        {/if}
      </Paragraph>
    </div>
    {#if activeCharacter && isDefenseCharacter(activeCharacter)}
      <div>
        <h5 class="auto">Fähigkeit</h5>
        <Paragraph spacing="none">
          {ABILITIES[activeCharacter.ability]}
        </Paragraph>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .tabs {
    display: flex;
    align-items: flex-end;
    gap: 0.25rem;
    .tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: var(--radius-md);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background: var(--color-blue-spielbrett);
      padding: 0.38rem 1.5rem;
      color: #bfc2ca;
      font-size: var(--scale-2);
      line-height: 150%;
      font-family: var(--font-display);
      text-transform: uppercase;
      white-space: nowrap;

      .icon {
        display: block;
        aspect-ratio: 1;
        width: 1.125rem;
      }
      &.active {
        background: var(--color-bg-strong-secondary);
        color: var(--color-text-onstrong-secondary);
        font-size: var(--scale-3);
        line-height: 2.25rem;
        .icon {
          width: 1.5rem;
        }
      }
    }
  }
  .content {
    display: flex;
    gap: 3rem;
    border-radius: var(--radius-md);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background: var(--color-bg-strong-secondary);
    padding: 1rem 1.5rem;
    min-height: 10rem;
    color: var(--color-text-onstrong-secondary);
  }
</style>
