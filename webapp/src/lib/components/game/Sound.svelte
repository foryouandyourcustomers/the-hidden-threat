<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import { play } from '$lib/sound'
  import isEqual from 'lodash/isEqual'

  const { machine } = getGameContext()

  const positions = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    if (getCurrentUser(context).side === 'attack') {
      return gameState.playerPositions
    } else {
      const { attacker: _, ...playerPositions } = gameState.playerPositions
      return playerPositions
    }
  })

  let previousPlayerPositions = $positions

  $: if (!isEqual(previousPlayerPositions, $positions)) {
    play('move')
    previousPlayerPositions = $positions
  }
</script>
