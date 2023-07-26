<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { fade, scale } from 'svelte/transition'

  const context = getGameContext()

  const users = useSelector(context.machine.service, (state) => state.context.users)

  const validEmojis = ['👋', '👍', '👏', '😃', '🧠', '🤔']

  const sendEmoji = (emoji: string) => {
    context.machine.send({ type: 'send emoji', emoji })
  }

  type DisplayedEmoji = { userName: string; emoji: string; position: [number, number] }
  let emojis: { [key: string]: DisplayedEmoji } = {}

  let i = 0
  export const showEmoji = ({ userId, emoji }: { userId: string; emoji: string }) => {
    const name = $users.find((user) => user.id === userId)?.name ?? 'Unknown'
    emojis[`${i++}`] = { emoji, userName: name, position: [Math.random(), Math.random()] }
    emojis = emojis
    i++
  }
</script>

<div class="emojis">
  {#each Object.entries(emojis) as [i, emoji] (i)}
    <div
      class="displayed-emoji"
      style:--_x={emoji.position[0]}
      style:--_y={emoji.position[1]}
      in:scale={{ duration: 200, start: 0.4 }}
      out:fade
      on:introend={() => {
        setTimeout(() => {
          delete emojis[i]
          emojis = emojis
        }, 2000)
      }}
    >
      <span class="emjoi">{emoji.emoji}</span>
      <span class="name">{emoji.userName}</span>
    </div>
  {/each}
  {#each validEmojis as emoji}
    <button class="emoji" on:click={() => sendEmoji(emoji)}>{emoji}</button>
  {/each}
</div>

<style lang="postcss">
  .emojis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
    gap: var(--size-1);
    padding: var(--size-2) var(--size-3);
  }
  .emoji {
    display: grid;
    place-content: center;
    border: none;
    border-radius: var(--radius-sm);
    background: #fafafa;
    padding: 0;
    aspect-ratio: 1;
    font-size: var(--scale-2);
    &:hover {
      background: #f0f0f0;
    }
  }
  .displayed-emoji {
    --_width: 15vw;
    --_height: 15vw;
    display: flex;
    position: fixed;
    top: calc(var(--_y) * (100% - var(--_height)));
    left: calc(var(--_x) * (100% - var(--_width)));
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 30px #dd7;
    border: var(--size-px) solid #ccc;
    border-radius: var(--radius-full);
    background: #fafafa;
    width: var(--_width);
    height: var(--_height);
    font-size: 8vw;
    line-height: 1.1;
    & .name {
      position: absolute;
      bottom: -1em;
      background: white;
      font-size: 0.3em;
    }
  }
</style>
