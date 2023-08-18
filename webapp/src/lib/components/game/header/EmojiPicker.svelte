<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'

  const context = getGameContext()

  const validEmojis = ['👋', '👍', '👏', '😃', '🧠', '🤔']

  const sendEmoji = (emoji: string) => {
    context.machine.send({ type: 'send emoji', emoji })
    context.machine.send({ type: 'show emoji', emoji, userId: context.userId })
  }
</script>

<div class="emojis">
  {#each validEmojis as emoji}
    <button class="emoji" on:click={() => sendEmoji(emoji)}>{emoji}</button>
  {/each}
</div>

<style lang="postcss">
  .emojis {
    display: flex;
    gap: 0.25rem;
  }
  .emoji {
    display: grid;
    flex-shrink: 0;
    place-content: center;
    opacity: 0.3;
    cursor: pointer;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--color-bg-secondary);
    padding: 0;
    aspect-ratio: 1;
    width: 2.5rem;
    font-size: var(--scale-3);
    &:hover {
      opacity: 1;
    }
  }
</style>
