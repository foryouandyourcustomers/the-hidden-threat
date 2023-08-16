import {
  guardForGameEventType,
  type AttackerId,
  type Coordinate,
  type DefenderId,
  type PlayerId,
  type SharedGameContext,
  type Side,
} from '$lib/game/types'
import {
  isDefenseItemId,
  type AttackItemId,
  type DefenseItemId,
  ITEMS,
  isAttackItemId,
} from './constants'

type ItemInventory<T extends Side> = {
  [key in T extends 'defense' ? DefenseItemId : AttackItemId]: number
}

/**
 * The state of the current game after applying all GameEvents to it.
 */
type GameState = {
  currentRound: number
  activeSide: Side
  activePlayerId: PlayerId
  playerMoved: boolean
  playerPositions: { [key in DefenderId | AttackerId]: Coordinate }
  defense: {
    inventory: ItemInventory<'defense'>
  }
  attack: {
    inventory: ItemInventory<'attack'>
  }
}

/**
 * This returns a `GameState` that reflects the current state by applying all
 * `GameEvent`s to the initial state.
 *
 * The reason things like player position and items collected, etc... are not
 * stored in the players directly, is because we want the `GameEvent`s to be
 * the only source of truth of the current state, so we can rewind any event.
 */
export const getCurrentGameState = (context: SharedGameContext): GameState => {
  const events = context.events
  // The rules are:
  // - the attacker moves + performs an action
  // - defender 1 moves + performs an action
  // - defender 2 moves + performs an action
  // - the attacker moves + performs an action
  // - defender 3 moves + performs an action
  // - defender 4 moves + performs an action

  const playersInOrder = [
    context.attack.attacker,
    context.defense.defenders[0],
    context.defense.defenders[1],
    context.attack.attacker,
    context.defense.defenders[2],
    context.defense.defenders[3],
  ]

  const eventsPerRound = playersInOrder.length * 2 // 6 players * 2 events per player

  const finalizedEvents = events.filter((event) => event.finalized)

  const currentRound = Math.floor(finalizedEvents.length / eventsPerRound)

  const activePlayerId =
    playersInOrder[Math.floor(finalizedEvents.length / 2) % playersInOrder.length].id

  const activeSide: Side = Math.floor(finalizedEvents.length / 2) % 3 === 0 ? 'attack' : 'defense'

  const lastEvent = events[events.length - 1]
  const playerMoved = lastEvent && lastEvent.type === 'move' && lastEvent.finalized

  const playerPositions = getPlayerPositions(context)

  const inventories = getInventories(context)

  return {
    currentRound,
    activeSide,
    activePlayerId,
    playerMoved,
    playerPositions,
    defense: {
      inventory: inventories.defense,
    },
    attack: {
      inventory: inventories.attack,
    },
  }
}

const getPlayerPositions = (context: SharedGameContext): GameState['playerPositions'] => {
  const playerPositions: GameState['playerPositions'] = {
    attacker: context.attack.attacker.originalPosition,
    defender0: context.defense.defenders[0].originalPosition,
    defender1: context.defense.defenders[1].originalPosition,
    defender2: context.defense.defenders[2].originalPosition,
    defender3: context.defense.defenders[3].originalPosition,
  }

  context.events
    .filter(guardForGameEventType('move'))
    .forEach((event) => (playerPositions[event.playerId] = event.to))

  return playerPositions
}

const getInventories = (context: SharedGameContext) => {
  const defenseInventoryIds = Object.values(ITEMS)
    .map((item) => item.id)
    .filter(isDefenseItemId)
  const attackInventoryIds = Object.values(ITEMS)
    .map((item) => item.id)
    .filter(isAttackItemId)

  const inventories: { attack: ItemInventory<'attack'>; defense: ItemInventory<'defense'> } = {
    defense: Object.fromEntries(
      defenseInventoryIds.map((id) => [id, 0]),
    ) as ItemInventory<'defense'>,
    attack: Object.fromEntries(attackInventoryIds.map((id) => [id, 0])) as ItemInventory<'attack'>,
  }

  context.events.filter(guardForGameEventType('collect')).forEach((event) => {
    if (isDefenseItemId(event.item)) {
      inventories.defense[event.item] += 1
    } else {
      inventories.attack[event.item] += 1
    }
  })

  return inventories
}
