<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte/useSelector'
  import { getGameContext } from '$lib/client/game-context'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'

  let visible = true

  const { machine } = getGameContext()
  const isNextToAttacker = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    const lastFinalizedActionEvent = gameState.finalizedActionEvents.at(-1)
    if (lastFinalizedActionEvent?.action !== 'is-next-to-attacker') {
      return false
    }
    return (
      Math.abs(lastFinalizedActionEvent.position[0] - gameState.playerPositions.attacker[0]) +
        Math.abs(lastFinalizedActionEvent.position[1] - gameState.playerPositions.attacker[1]) <=
      1
    )
  })
</script>

{#if visible}
  <GameDialog title="Angreifer:in angrenzend?" on:close={() => (visible = false)}>
    <Paragraph>
      Angreifer:in {$isNextToAttacker ? '' : 'nicht'} ist auf diesem oder einem angrenzenden Feld.
    </Paragraph>
  </GameDialog>
{/if}
