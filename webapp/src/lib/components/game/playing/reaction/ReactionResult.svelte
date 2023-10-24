<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import { gameEventRequiresReaction } from '$lib/game/types'
  import ResultDidUseJoker from './result/ResultDidUseJoker.svelte'
  import ResultHasCollectedItems from './result/ResultHasCollectedItems.svelte'
  import ResultIsAttackingStage from './result/ResultIsAttackingStage.svelte'
  import ResultIsNextToAttacker from './result/ResultIsNextToAttacker.svelte'
  import ResultIsOnField from './result/ResultIsOnField.svelte'
  import ResultQuarterReveal from './result/ResultQuarterReveal.svelte'

  const { machine } = getGameContext()

  /** Whether the attacking side used a joker to avoid answering the question */
  const didUseJoker = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const lastDefenderAction = gameState.finalizedPlayerEvents
      .filter((event) => event.playerId !== 'attacker')
      .at(-1)
    if (!lastDefenderAction || !gameEventRequiresReaction(lastDefenderAction)) return undefined

    const reactionEvent = gameState.finalizedPlayerEvents.at(
      gameState.finalizedPlayerEvents.indexOf(lastDefenderAction) + 1,
    )

    if (!reactionEvent) return undefined

    if (reactionEvent?.type === 'reaction' && reactionEvent.action === 'joker') {
      return reactionEvent.useJoker
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

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)
</script>

{#if $question && $side === 'defense' && $didUseJoker !== undefined}
  {#if $didUseJoker}
    <ResultDidUseJoker />
  {:else if $question === 'is-on-field'}
    <ResultIsOnField />
  {:else if $question === 'has-collected-items'}
    <ResultHasCollectedItems />
  {:else if $question === 'quarter-reveal'}
    <ResultQuarterReveal />
  {:else if $question === 'is-attacking-stage'}
    <ResultIsAttackingStage />
  {:else if $question === 'is-next-to-attacker'}
    <ResultIsNextToAttacker />
  {/if}
{/if}
