import {
  guardForGameEventType,
  type AttackerId,
  type Coordinate,
  type DefenderId,
  type GameEvent,
  type Player,
  type SharedGameContext,
  type Side,
  isDefenderId,
  type PlayerId,
  isPlayerIdOfSide,
  guardForGameEventAction,
} from '$lib/game/types'
import isEqual from 'lodash/isEqual'
import {
  ITEMS,
  isAttackItemId,
  isDefenseItemId,
  type AttackItemId,
  type DefenseItemId,
} from './constants'

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
  private finalizedEvents: GameEvent[]

  public currentRound: number
  public activePlayer: Player
  public activeSide: Side
  public activePlayerPosition: Coordinate

  public lastEvent?: GameEvent
  public lastFinalizedEvent?: GameEvent

  public nextEventType: 'move' | 'action'

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
    this.currentRound = Math.floor(this.finalizedEvents.length / this.eventsPerRound)
    this.activePlayer =
      this.playersInOrder[Math.floor(this.finalizedEvents.length / 2) % this.playersInOrder.length]

    this.activeSide = Math.floor(this.finalizedEvents.length / 2) % 3 === 0 ? 'attack' : 'defense'

    this.lastEvent = context.events[context.events.length - 1]
    this.lastFinalizedEvent = this.finalizedEvents[this.finalizedEvents.length - 1]

    this.nextEventType =
      this.lastFinalizedEvent && this.lastFinalizedEvent.type === 'move' ? 'action' : 'move'

    this.activePlayerPosition = this.playerPositions[this.activePlayer.id]
  }

  get playerPositions() {
    const playerPositions: { [key in DefenderId | AttackerId]: Coordinate } = {
      attacker: this.context.attack.attacker.originalPosition,
      defender0: this.context.defense.defenders[0].originalPosition,
      defender1: this.context.defense.defenders[1].originalPosition,
      defender2: this.context.defense.defenders[2].originalPosition,
      defender3: this.context.defense.defenders[3].originalPosition,
    }

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
    const items = this.context.items.filter((item) => isEqual(item.position, coordinate))

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

    isDefenderId

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
}
