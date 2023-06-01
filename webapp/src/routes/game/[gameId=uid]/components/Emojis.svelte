<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '../context'

  const context = getGameContext()

  const players = useSelector(context.machine.service, (state) => state.context.players)

  const validEmojis = ['👋', '👍', '👏', '😃', '🧠', '🤔']

  const sendEmoji = (emoji: string) => {
    context.machine.send({ type: 'player sends emoji', emoji })
  }

  let emojis: string[] = []

  export const showEmoji = ({ playerId, emoji }: { playerId: string; emoji: string }) => {
    const name = $players.find((player) => player.id === playerId)?.name ?? 'Unknown'
    emojis = [...emojis, `${emoji} ${name}`]
  }
</script>

<div class="emojis">
  {#each emojis as emoji}
    <p>{emoji}</p>
  {/each}
  {#each validEmojis as emoji}
    <button on:click={() => sendEmoji(emoji)}>{emoji}</button>
  {/each}
</div>

<style lang="postcss">
  .emojis {
    position: fixed;
    right: var(--size-2);
    bottom: var(--size-2);
    border: 2px solid var(--color-grey-200);
    border-radius: var(--radius-md);
    background: white;
    padding: var(--size-2) var(--size-3);
  }
</style>
