import {
  guardForGameEventType,
  type AttackerId,
  type Coordinate,
  type DefenderId,
  type PlayerId,
  type SharedGameContext,
  type Side,
} from '$lib/game/types'

/**
 * The state of the current game after applying all GameEvents to it.
 */
type GameState = {
  currentRound: number
  activeSide: Side
  activePlayerId: PlayerId
  playerMoved: boolean
  playerPositions: { [key in DefenderId | AttackerId]: Coordinate }
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

  return {
    currentRound,
    activeSide,
    activePlayerId,
    playerMoved,
    playerPositions,
  }
}

export const getPlayerPositions = (context: SharedGameContext): GameState['playerPositions'] => {
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
