<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'

  const { machine } = getGameContext()

  const isAwaitingReaction = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).nextEventType === 'reaction',
  )

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)
</script>

{#if $side === 'defense' && $isAwaitingReaction}
  <GameDialog title="Warten auf Antwort">
    <Paragraph
      >Der/Die Angreifer:in hat nun die Möglichkeit einen Joker einzusetzen um der Frage
      auszuweichen.</Paragraph
    >
  </GameDialog>
{/if}
