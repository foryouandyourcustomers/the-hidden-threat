<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'

  const { machine, highlightedFields } = getGameContext()
  let visible = true

  const attackerPosition = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).playerPositions.attacker,
    isEqual,
  )

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

  $: {
    if ($didUseJoker === false) {
      highlightedFields.update((fields) => ({ ...fields, attacker: [$attackerPosition] }))
    } else {
      highlightedFields.update((fields) => ({ ...fields, attacker: undefined }))
    }
  }

  $: {
    visible = true
    $didUseJoker
  }

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)
</script>

{#if $side === 'defense' && $didUseJoker !== undefined && visible}
  {#if $didUseJoker}
    <GameDialog title="Joker eingesetzt" on:close={() => (visible = false)}>
      <Paragraph
        >Der/Die Angreifer:in hat einen Joker eingesetzt um der Frage auszuweichen.</Paragraph
      >
    </GameDialog>
  {:else}
    <GameDialog title="Position aufgedeckt" on:close={() => (visible = false)}>
      <Paragraph>Die Position wird jetzt angezeigt.</Paragraph>
    </GameDialog>
  {/if}
{/if}
