<script lang="ts">
  import { useSelector } from '$lib/@xstate/svelte'
  import { getGameContext } from '$lib/client/game-context'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { GameState } from '$lib/game/game-state'
  import { play, type Sound } from '$lib/sound'
  import isEqual from 'lodash/isEqual'
  import { onMount } from 'svelte'
  import { get, type Readable } from 'svelte/store'

  const { machine } = getGameContext()

  const positions = useSelector(
    machine.service,
    ({ context }) => {
      const gameState = GameState.fromContext(context)
      if (getCurrentUser(context).side === 'attack') {
        return gameState.playerPositions
      } else {
        const { attacker: _, ...playerPositions } = gameState.playerPositions
        return playerPositions
      }
    },
    isEqual,
  )

  const inventory = useSelector(machine.service, ({ context }) => {
    const gameState = GameState.fromContext(context)
    let itemCounts: number[]
    if (getCurrentUser(context).side === 'attack') {
      itemCounts = Object.values(gameState.attackInventory)
    } else {
      itemCounts = Object.values(gameState.defenseInventory)
    }

    return itemCounts.reduce((acc, count) => acc + count, 0)
  })

  const attackedStages = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).attackedStages.length,
  )
  const defendedStages = useSelector(
    machine.service,
    ({ context }) => GameState.fromContext(context).defendedStages.length,
  )

  const soundOnChange = <T>(
    store: Readable<T>,
    sample: Sound,
    triggerFunction = (prev: T, next: T) => !isEqual(prev, next),
  ) => {
    let previousValue = get(store)
    return store.subscribe((value) => {
      if (triggerFunction(previousValue, value)) {
        play(sample)
      }
      previousValue = value
    })
  }
  onMount(() => soundOnChange(positions, 'move'))
  onMount(() => soundOnChange(inventory, 'capture', (prev, next) => next > prev))
  // TODO: replace sound
  onMount(() => soundOnChange(attackedStages, 'select', (prev, next) => next > prev))
  // TODO: replace sound
  onMount(() => soundOnChange(defendedStages, 'select', (prev, next) => next > prev))
</script>
