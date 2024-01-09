<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import Score from '$lib/components/game/Score.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { Side } from '$lib/game/types'
  import { getGameSummary, getGameSummaryFilename, getSharedGameContext } from '$lib/game/utils'

  const { machine } = getGameContext()

  const isAdmin = useSelector(machine.service, ({ context }) => getCurrentUser(context).isAdmin)

  const sharedContext = useSelector(machine.service, ({ context }) => getSharedGameContext(context))

  $: sharedContextData = $sharedContext
    ? 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(getGameSummary($sharedContext), undefined, 2))
    : null

  const score = useSelector(machine.service, ({ context }) => GameState.fromContext(context).score)

  $: winningSide = ($score.attack > $score.defense ? 'attack' : 'defense') as Side
</script>

<div class="wrapper">
  <section>
    <h3 class="auto">Das Spiel ist beendet</h3>
    <p class="auto">
      Das

      {#if winningSide === 'attack'}
        <strong>Angriffs-Team</strong>
      {:else}
        <strong>Verteidigungs-Team</strong>
      {/if}

      hat gewonnen.
    </p>

    <div class="score">
      <Score final />
    </div>

    {#if $isAdmin && $sharedContext && sharedContextData}
      {@const filename = getGameSummaryFilename($sharedContext)}
      Download Data:
      <a href={sharedContextData} download={filename}>{filename}</a>
    {/if}
  </section>
</div>

<style lang="postcss">
  .wrapper {
    display: grid;
    place-content: center;
    height: 100%;
  }
  section {
    margin-inline: auto;
    border-radius: var(--radius-md);
    background: var(--color-bg-strong);
    padding: 1rem 1.25rem 1.5rem 1.25rem;
    width: 30rem;
    color: var(--color-text-onstrong);
  }

  h3 {
    margin-top: 0;
  }
  .score {
    margin-block: 1rem;
  }
</style>
