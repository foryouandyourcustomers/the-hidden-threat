<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte/useSelector'
  import { getGameContext } from '$lib/client/game-context'
  import GameDialog from '$lib/components/ui/GameDialog.svelte'
  import Paragraph from '$lib/components/ui/Paragraph.svelte'
  import { GameState } from '$lib/game/game-state'
  import { guardForGameEventType, type Coordinate } from '$lib/game/types'
  import isEqual from 'lodash/isEqual'
  import { onDestroy } from 'svelte'

  let visible = true

  const sections: Coordinate[][] = [
    [
      ...Array.from({ length: 5 }, (_, i) => [i, 0] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [i, 1] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [i, 2] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [i, 3] as Coordinate),
    ],
    [
      ...Array.from({ length: 4 }, (_, i) => [8 - i, 0] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [8 - i, 1] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [8 - i, 2] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [8 - i, 3] as Coordinate),
    ],
    [
      ...Array.from({ length: 5 }, (_, i) => [i, 4] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [i, 5] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [i, 6] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [i, 7] as Coordinate),
    ],
    [
      ...Array.from({ length: 4 }, (_, i) => [8 - i, 4] as Coordinate),
      ...Array.from({ length: 4 }, (_, i) => [8 - i, 5] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [8 - i, 6] as Coordinate),
      ...Array.from({ length: 5 }, (_, i) => [8 - i, 7] as Coordinate),
    ],
  ]

  const { machine, highlightedFields } = getGameContext()
  const attackerFields = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)

      const lastDefenderAction = gameState.finalizedPlayerEvents
        .filter((event) => event.playerId !== 'attacker')
        .at(-1)
      if (!lastDefenderAction) return undefined

      const attackerPosition = gameState.finalizedPlayerEvents
        .slice(0, gameState.finalizedPlayerEvents.indexOf(lastDefenderAction))
        .filter((event) => event.playerId === 'attacker')
        .filter(guardForGameEventType('move'))
        .at(-1)?.to

      if (!attackerPosition) return undefined

      return sections.find((section) => {
        return section.find((coordinate) => isEqual(coordinate, attackerPosition))
      })
    },
    isEqual,
  )

  $: highlightedFields.update((fields) => {
    fields.reveal = $attackerFields
    return fields
  })

  onDestroy(() => {
    highlightedFields.update((fields) => {
      fields.reveal = undefined
      return fields
    })
  })
</script>

{#if visible}
  <GameDialog title="Angreifer:innen Position" on:close={() => (visible = false)}>
    <Paragraph>
      Das Viertel des Spielbretts auf dem sich der/die Angreifer:in befindet werden nun angezeigt.
    </Paragraph>
  </GameDialog>
{/if}
