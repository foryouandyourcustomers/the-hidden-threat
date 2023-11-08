<script lang="ts">
  import { getGameContext } from '$lib/client/game-context'
  import ChatIcon from '~icons/lucide/message-circle'

  const context = getGameContext()

  const validEmojis = ['👋', '👍', '👏', '😃', '🧠', '🤔']

  const sendEmoji = (emoji: string) => {
    context.machine.send({ type: 'send emoji', emoji })
    context.machine.send({ type: 'show emoji', emoji, userId: context.userId })
  }

  let open = false
</script>

<div class="picker">
  <button class="unstyled toggle" on:click={() => (open = !open)}><ChatIcon /></button>

  {#if open}
    <div class="emojis">
      {#each validEmojis as emoji}
        <button class="unstyled emoji" on:click={() => sendEmoji(emoji)}>{emoji}</button>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .picker {
    position: relative;
    isolation: isolate;
    aspect-ratio: 1;
    width: 2.5rem;
  }
  .toggle {
    display: grid;
    position: relative;
    place-content: center;
    z-index: var(--layer-top);
    box-shadow: 0 0 1rem var(--color-shadow-secondary);
    border-radius: var(--radius-full);
    background: var(--color-bg-strong);
    padding: 0;
    width: 100%;
    height: 100%;
    color: var(--color-blue-spielbrett);
    font-size: var(--scale-3);
  }
  .emojis {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    flex-direction: row;
    gap: 0.125rem;
    border-radius: var(--radius-full);
    background: var(--color-white-80);
    padding-right: 3rem;
    padding-left: 0.5rem;
  }
  .emoji {
    display: grid;
    flex-shrink: 0;
    place-content: center;
    cursor: pointer;
    border: none;
    padding: 0;
    aspect-ratio: 1;
    width: 2.5rem;
    font-size: var(--scale-3);
  }
</style>
