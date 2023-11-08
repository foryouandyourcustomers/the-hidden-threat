<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { fly } from 'svelte/transition'

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

  let height = 800
</script>

<div class="overlays-container" bind:clientHeight={height}>
  {#each Object.entries(emojis) as [i, emoji] (i)}
    <div
      class="displayed-emoji"
      style:--_x={emoji.position[0]}
      in:fly={{ duration: 2000, y: height, opacity: 1, easing: (t) => t }}
      on:introend={() => {
        delete emojis[i]
        emojis = emojis
      }}
    >
      <span class="emjoi">{emoji.emoji}</span>
      <span class="name">{emoji.userName}</span>
    </div>
  {/each}
</div>

<style lang="postcss">
  .overlays-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .displayed-emoji {
    --_width: 5rem;
    --_height: 5rem;
    display: flex;
    position: fixed;
    top: calc(0px - var(--_height));
    left: calc(var(--_x) * (100% - var(--_width)));
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: var(--_width);
    height: var(--_height);
    font-size: 4rem;
    line-height: 1.1;
    & .name {
      position: absolute;
      bottom: -1.75em;
      border-radius: var(--radius-sm);
      background: black;
      padding: 0 0.5rem;
      font-size: 1rem;
    }
  }
</style>
