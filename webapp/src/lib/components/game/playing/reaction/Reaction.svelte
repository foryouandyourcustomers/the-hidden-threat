<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import type { ClientEventOf } from '$lib/client/game-machine/types'
  import Actions from '$lib/components/ui/Actions.svelte'
  import Button from '$lib/components/ui/Button.svelte'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import RadioButton from '$lib/components/ui/RadioButton.svelte'
  import RadioOptions from '$lib/components/ui/RadioOptions.svelte'
  import { GameState } from '$lib/game/game-state'
  import type { SharedGameContext } from '$lib/game/types'

  const { machine } = getGameContext()

  const question = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).activeQuestion,
  )

  const canPerformReaction = useSelector(machine.service, (state) =>
    state.matches('Playing.Gameloop.Playing.Reacting'),
  )

  const hasJoker = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return gameState.jokers > 0
  })

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
    machine.send(getReactionEvent(context, finalized, $hasJoker ? answer : false))
  }
  let answer: boolean | undefined = undefined

  const onSubmit = () => {
    applyReaction(true)
  }
</script>

{#if $canPerformReaction}
  <GameDialog title="Joker einsetzen">
    <Paragraph>
      {#if $question === 'is-on-field'}
        Die Verteidigung fragt ob Du auf dem Feld bist.
      {:else if $question === 'has-collected-items'}
        Die Verteidigung fragt ob Du Gegenstände gesammelt hast.
      {:else if $question === 'quarter-reveal'}
        Die Verteidigung fragt auf welchem Viertel des Spielbretts Du dich befindest.
      {:else if $question === 'is-attacking-stage'}
        Die Verteidigung fragt ob Du einen gezielten Angriff auf eine Stufe hast.
      {:else if $question === 'is-next-to-attacker'}
        Die Verteidigung fragt ob Du dich auf einem angrenzend Feld befindest.
      {/if}
      <br />
      {#if $hasJoker}
        Möchtest Du Deinen Joker einsetzen, um der Frage auszuweichen?
      {:else}
        Du hast leider keinen Joker mehr zur Verfügung um der Frage auszuweichen.
      {/if}
    </Paragraph>

    <form on:submit|preventDefault={onSubmit}>
      {#if $hasJoker}
        <RadioOptions>
          <RadioButton on:change={() => applyReaction(false)} value={true} bind:group={answer}>
            Ja
            <Paragraph size="sm" spacing="none">
              Wir möchten den Joker einsetzen und der Frage ausweichen.
            </Paragraph>
          </RadioButton>

          <RadioButton on:change={() => applyReaction(false)} value={false} bind:group={answer}>
            Nein
            <Paragraph size="sm" spacing="none">
              Wir möchten den Joker nicht einsetzen und die Verteidigung soll die Antwort
              automatisch erhalten.
            </Paragraph>
          </RadioButton>
        </RadioOptions>
      {/if}

      <Actions>
        <Button size="small" inverse type="submit">Bestätigen</Button>
      </Actions>
    </form>
  </GameDialog>
{/if}
