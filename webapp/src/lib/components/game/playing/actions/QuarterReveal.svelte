<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { GameState } from '$lib/game/game-state'
  import Action from './Action.svelte'

  const { machine } = getGameContext()

  const canBeUsed = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    return !!gameState
  })

  const applyAction = (finalized = false) => {
    console.log(finalized)
  }
</script>

<Action title="Rollenfähigkeit" disabled={$canBeUsed} on:click={() => applyAction(false)}
  >Viertel aufdecken</Action
>
