import {
  guardForGameEventAction,
  guardForGameEventType,
  isGameEventOf,
  isPlayerIdOfSide,
  type AttackerId,
  type Coordinate,
  type DefenderId,
  type GameEvent,
  type Player,
  type PlayerId,
  type SharedGameContext,
  type Side,
} from '$lib/game/types'
import isEqual from 'lodash/isEqual'
import { BOARD_ITEMS } from './constants/board-items'
import {
  ITEMS,
  isAttackItemId,
  isDefenseItemId,
  type AttackItemId,
  type DefenseItemId,
} from './constants/items'
import { getPlayerSide } from './utils'

type ItemInventory<T extends Side> = {
  [key in T extends 'defense' ? DefenseItemId : AttackItemId]: number
}

/**
 * The current game state that reflects the current state by applying all
 * `GameEvent`s to the initial state.
 *
 * The reason things like player position and items collected, etc... are not
 * stored in the players directly, is because we want the `GameEvent`s to be
 * the only source of truth of the current state, so we can rewind any event.
 */
export class GameState {
  private playersInOrder: Player[]
  private eventsPerRound: number
  public finalizedEvents: GameEvent[]

  public currentRound: number
  public activePlayer: Player
  public activeSide: Side
  public activePlayerPosition: Coordinate

  public lastEvent?: GameEvent
  public lastFinalizedEvent?: GameEvent

  public nextEventType: GameEvent['type']

  private static previousState: { state: GameState; context: SharedGameContext } | undefined

  public static fromContext(context: SharedGameContext) {
    if (this.previousState && isEqual(this.previousState.context, context)) {
      return this.previousState.state
    }
    const state = new GameState(context)
    this.previousState = { state, context }
    return state
  }

  /** Use GameState.fromContext() to create a GameState */
  private constructor(private context: SharedGameContext) {
    // The rules are:
    // - the attacker moves + performs an action
    // - defender 1 moves + performs an action
    // - defender 2 moves + performs an action
    // - the attacker moves + performs an action
    // - defender 3 moves + performs an action
    // - defender 4 moves + performs an action
    this.playersInOrder = [
      context.attack.attacker,
      context.defense.defenders[0],
      context.defense.defenders[1],
      context.attack.attacker,
      context.defense.defenders[2],
      context.defense.defenders[3],
    ]
    this.eventsPerRound = this.playersInOrder.length * 2 // 6 players * 2 events per player
    this.finalizedEvents = this.context.events.filter((event) => event.finalized)

    const finalizedPlacementEvents = this.finalizedEvents.filter(guardForGameEventType('placement'))
    const finalizedMoveOrActionEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, 'move') || isGameEventOf(event, 'action'),
    )

    this.lastEvent = context.events[context.events.length - 1]
    this.lastFinalizedEvent = this.finalizedEvents[this.finalizedEvents.length - 1]

    this.nextEventType =
      finalizedPlacementEvents.length < 5
        ? 'placement'
        : this.lastFinalizedEvent && this.lastFinalizedEvent.type === 'move'
        ? 'action'
        : 'move'

    if (this.nextEventType === 'placement') {
      // We're still in the placement phase.
      if (finalizedPlacementEvents.length < 4) {
        // The defenders are still placing
        this.activePlayer = context.defense.defenders[finalizedPlacementEvents.length]
      } else {
        // The attacker is placing
        this.activePlayer = context.attack.attacker
      }
    } else {
      this.activePlayer =
        this.playersInOrder[
          Math.floor(finalizedMoveOrActionEvents.length / 2) % this.playersInOrder.length
        ]
    }
    this.activeSide = getPlayerSide(this.activePlayer.id)

    this.currentRound = Math.floor(finalizedMoveOrActionEvents.length / this.eventsPerRound)

    this.activePlayerPosition = this.playerPositions[this.activePlayer.id]
  }

  get playerPositions() {
    const playerPositions: { [key in DefenderId | AttackerId]: Coordinate } = {
      attacker: [0, 0],
      defender0: [0, 0],
      defender1: [0, 0],
      defender2: [0, 0],
      defender3: [0, 0],
    }

    this.context.events
      .filter(guardForGameEventType('placement'))
      .forEach((event) => (playerPositions[event.playerId] = event.coordinate))

    this.context.events
      .filter(guardForGameEventType('move'))
      .forEach((event) => (playerPositions[event.playerId] = event.to))

    return playerPositions
  }

  get defenseInventory() {
    const defenseInventoryIds = Object.values(ITEMS)
      .map((item) => item.id)
      .filter(isDefenseItemId)

    const inventory = Object.fromEntries(
      defenseInventoryIds.map((id) => [id, 0]),
    ) as ItemInventory<'defense'>

    this.context.events.filter(guardForGameEventAction('collect')).forEach((event) => {
      if (event.itemId && isDefenseItemId(event.itemId)) {
        inventory[event.itemId] += 1
      }
    })

    return inventory
  }
  get attackInventory() {
    const attackInventoryIds = Object.values(ITEMS)
      .map((item) => item.id)
      .filter(isAttackItemId)

    const inventory = Object.fromEntries(
      attackInventoryIds.map((id) => [id, 0]),
    ) as ItemInventory<'attack'>

    this.context.events.filter(guardForGameEventAction('collect')).forEach((event) => {
      if (event.itemId && isAttackItemId(event.itemId)) {
        inventory[event.itemId] += 1
      }
    })

    return inventory
  }

  getItemsForCoordinate(coordinate: Coordinate) {
    const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate))

    return items.map((item) => {
      const collectedCount = this.context.events
        .filter(guardForGameEventAction('collect'))
        .filter((event) => isEqual(event.position, coordinate))
        .filter((event) => event.itemId === item.id).length

      return {
        item,
        collectedCount,
      }
    })
  }

  /** Check if this is a valid target destination for the active player */
  isValidMove(to: Coordinate) {
    if (to[0] < 0 || to[0] > 8 || to[1] < 0 || to[1] > 7) return false

    for (const playerPosition of Object.keys(this.playerPositions)
      .filter((playerId) => isPlayerIdOfSide(playerId as PlayerId, this.activeSide))
      .map((playerId) => this.playerPositions[playerId as PlayerId])) {
      // Make sure no other player (including the player itself, since the player
      // must move) is on the target position.
      if (isEqual(playerPosition, to)) return false
    }

    const currentPosition = this.activePlayerPosition
    const xDiff = Math.abs(currentPosition[0] - to[0])
    const yDiff = Math.abs(currentPosition[1] - to[1])
    return xDiff + yDiff <= 2 && xDiff + yDiff != 0
  }

  isPlaced(playerId: PlayerId) {
    return (
      this.context.events
        .filter(guardForGameEventType('placement'))
        .filter((event) => event.playerId === playerId && event.finalized).length > 0
    )
  }
}
