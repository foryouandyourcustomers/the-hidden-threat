<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import isEqual from 'lodash/isEqual'
  const { machine, highlightedFields } = getGameContext()

  const side = useSelector(machine.service, ({ context }) => getCurrentUser(context).side)

  const attackerPosition = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)
      const actionCount = gameState.finalizedActionEvents.length

      // We want to show the attacker position during the first 2 actions of round
      // 5 and 10.
      const showingAttackerPosition =
        (gameState.currentRound === 4 && actionCount < 6 * 4 + 2) ||
        (gameState.currentRound === 9 && actionCount < 6 * 9 + 2)

      if (!showingAttackerPosition) {
        return undefined
      }

      // Showing the position, but we need to make sure it's not updated after
      // the attacker has moved.

      return gameState.finalizedMoveEvents
        .filter((event) => event.playerId === 'attacker')
        .slice(gameState.currentRound * 2 - 1, gameState.currentRound * 2)
        .at(0)?.to
    },
    isEqual,
  )

  // We want to show the attacker position during the first 2 actions of round
  // 5 and 10.
  $: if ($attackerPosition && $side === 'defense') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    highlightedFields.update((fields) => ({ ...fields, attacker: [$attackerPosition!] }))
  } else {
    highlightedFields.update((fields) => ({ ...fields, attacker: undefined }))
  }

  let visible = true
</script>

{#if $attackerPosition && visible}
  <GameDialog title="Angreifer:innen Position" on:close={() => (visible = false)}>
    {#if $side === 'defense'}
      <Paragraph>Die Position des/der Angreifer:in wird nun am Feld angezeigt.</Paragraph>
      <Paragraph
        >Bedenke jedoch, dass der/die Angreifer:in jetzt ziehen kann und nicht mehr auf diesem Feld
        stehen wird.</Paragraph
      >
    {:else}
      <Paragraph>Deine Position wird der Verteidigung nun am Feld angezeigt.</Paragraph>
      <Paragraph>Die Verteidigung sieht jedoch nicht Deinen nächsten Zug.</Paragraph>
    {/if}
  </GameDialog>
{/if}
