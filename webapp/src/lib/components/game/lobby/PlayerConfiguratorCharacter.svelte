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
      <!-- <button class="unstyled tab"> -->
      <button
        class="unstyled tab"
        on:click={() => updateCharacter(character.id)}
        class:active={player.character === character.id}
      >
        {character.name}
      </button>
    {/each}
  </div>
  <div class="content">
    <div>
      <Heading spacing="none" size="sm">Beschreibung</Heading>
      <Paragraph spacing="none">
        {#if activeCharacter}
          {activeCharacter.description}
        {/if}
      </Paragraph>
    </div>
    {#if activeCharacter && isDefenseCharacter(activeCharacter)}
      <div>
        <Heading spacing="none" size="sm">Fähigkeit</Heading>
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
      gap: 0.5rem;
      border-radius: var(--radius-md);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      background: var(--color-blue-spielbrett);
      padding: 0.125rem 1.5rem;
      font-size: var(--scale-2);
      line-height: 1.875rem;
      font-family: var(--font-display);
      white-space: nowrap;
      &::after {
        display: block;
        background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="#1B253A"/></svg>');
        width: 1.5rem;
        height: 1.5rem;
        content: '';
      }
      &.active {
        background: var(--color-bg-strong-secondary);
        color: var(--color-text-onstrong-secondary);
        font-size: var(--scale-3);
        line-height: 2.25rem;
      }
    }
  }
  .content {
    display: flex;
    gap: 1rem;
    border-radius: var(--radius-md);
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background: var(--color-bg-strong-secondary);
    padding: 1rem 1.5rem;
    min-height: 10rem;
    color: var(--color-text-onstrong-secondary);
  }
</style>
