<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'

  const { machine } = getGameContext()

  const canPerformReaction = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Reacting'),
  )

  const getReactionEvent = (
    context: SharedGameContext,
    finalized: boolean,
    useJoker: boolean | undefined,
  ): ClientEventOf<'apply game event'> => {
    const gameState = GameState.fromContext(context)
    return {
      type: 'apply game event',
      gameEvent: {
        type: 'reaction',
        action: 'joker',
        finalized,
        useJoker,
        playerId: gameState.activePlayer.id,
      },
    }
  }
  const applyReaction = (finalized = false) => {
    const context = machine.service.getSnapshot().context
    machine.send(getReactionEvent(context, finalized, answer))
  }
  let answer: boolean | undefined = undefined

  const onSubmit = () => {
    applyReaction(true)
  }
</script>

{#if $canPerformReaction}
  <GameDialog title="Joker einsetzen">
    <Paragraph>Möchtest Du Deinen Joker einsetzen, um der Frage auszuweichen?</Paragraph>

    <form on:submit|preventDefault={onSubmit}>
      <div class="options">
        <label>
          <input type="radio" name="answer" value={true} bind:group={answer} />
          Ja
        </label>
        <label>
          <input type="radio" name="answer" value={false} bind:group={answer} />
          Nein
        </label>
      </div>

      <Button inverse type="submit">Bestätigen</Button>
    </form>
  </GameDialog>
{/if}
