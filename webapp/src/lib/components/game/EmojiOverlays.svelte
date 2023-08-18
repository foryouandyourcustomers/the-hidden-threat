<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { fade, scale } from 'svelte/transition'

  const context = getGameContext()

  const users = useSelector(context.machine.service, (state) => state.context.users)

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

<style lang="postcss">
  .displayed-emoji {
    --_width: 4rem;
    --_height: 4rem;
    display: flex;
    position: fixed;
    top: calc(var(--_y) * (100% - var(--_height)));
    left: calc(var(--_x) * (100% - var(--_width)));
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 30px #fff5;
    border-radius: var(--radius-full);
    background: #fafafa;
    width: var(--_width);
    height: var(--_height);
    font-size: 3rem;
    line-height: 1.1;
    & .name {
      position: absolute;
      bottom: -1.75em;
      border-radius: var(--radius-sm);
      background: black;
      padding: 0 0.5rem;
      font-size: 0.3em;
    }
  }
</style>
