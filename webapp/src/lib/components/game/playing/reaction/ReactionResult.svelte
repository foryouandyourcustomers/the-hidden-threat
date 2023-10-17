<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import ResultHasCollectedItems from './result/ResultHasCollectedItems.svelte'
  import ResultIsAttackingStage from './result/ResultIsAttackingStage.svelte'
  import ResultIsNextToAttacker from './result/ResultIsNextToAttacker.svelte'
  import ResultIsOnField from './result/ResultIsOnField.svelte'
  import ResultQuarterReveal from './result/ResultQuarterReveal.svelte'

  const { machine } = getGameContext()

  /**
   * Every time we reach a condition where the result should be shown, this
   * will be set to true. The user can then dismiss this Dialog, but it will
   * only be dismissed "in memory" so a reload will show it again.
   *
   * The dismissal of the Dialog is also not synced between clients.
   */
  let visible = true

  /** Whether the attacking side used a joker to avoid answering the question */
  const didUseJoker = useSelector(machine.service, ({ context }) => {
    const lastFinalizedPlayerEvent = GameState.fromContext(context).finalizedPlayerEvents.at(-1)
    if (
      lastFinalizedPlayerEvent?.type === 'reaction' &&
      lastFinalizedPlayerEvent.action === 'joker'
    ) {
      return lastFinalizedPlayerEvent.useJoker
    }
    return undefined
  })

  /**
   * The question being asked.
   *
   * This is undefined if no question has been asked, at which point this will
   * not show anything.
   */
  const question = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).activeQuestion,
  )

  $: {
    visible = true
    $didUseJoker
  }

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)

  const onClose = () => (visible = false)
</script>

{#if $question && $side === 'defense' && $didUseJoker !== undefined && visible}
  {#if $didUseJoker}
    <GameDialog title="Joker eingesetzt" on:close={onClose}>
      <Paragraph>
        Der/Die Angreifer:in hat einen Joker eingesetzt um der Frage auszuweichen.
      </Paragraph>
    </GameDialog>
  {:else if $question === 'is-on-field'}
    <ResultIsOnField on:close={onClose} />
  {:else if $question === 'has-collected-items'}
    <ResultHasCollectedItems on:close={onClose} />
  {:else if $question === 'quarter-reveal'}
    <ResultQuarterReveal on:close={onClose} />
  {:else if $question === 'is-attacking-stage'}
    <ResultIsAttackingStage on:close={onClose} />
  {:else if $question === 'is-next-to-attacker'}
    <ResultIsNextToAttacker on:close={onClose} />
  {/if}
{/if}
