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
import { objectEntries } from '$lib/utils'
import isEqual from 'lodash/isEqual'
import { BOARD_ITEMS } from './constants/board-items'
import { BOARD_SUPPLY_CHAINS } from './constants/board-stages'
import { GLOBAL_ATTACK_SCENARIOS } from './constants/global-attacks'
import {
  ITEMS,
  isAttackItemId,
  isDefenseItemId,
  type AttackItemId,
  type DefenseItemId,
} from './constants/items'
import type { StageId } from './constants/stages'
import { TARGETED_ATTACKS } from './constants/targeted-attacks'
import { getPlayerSide } from './utils'

export type ItemInventory<T extends Side> = {
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

  isValidPlacement(coordinate: Coordinate) {
    if (coordinate[0] < 0 || coordinate[0] > 8 || coordinate[1] < 0 || coordinate[1] > 7)
      return false

    // Any position for the attacker is valid.
    if (this.activePlayer.id === 'attacker') return true

    // Prevent same position for multiple players
    for (const [playerId, position] of objectEntries(this.playerPositions)) {
      if (isEqual(position, coordinate) && this.isPlaced(playerId)) return false
    }

    let stageIds: StageId[]
    switch (this.activePlayer.character) {
      case 'dispatch-manager':
        stageIds = ['logistics', 'storage']
        break
      case 'it-specialist':
        stageIds = ['datacenter']
        break
      case 'order-manager':
        stageIds = ['sales', 'supply']
        break
      case 'quality-manager':
        stageIds = ['production']
        break
    }

    let allValidCoordinates = BOARD_SUPPLY_CHAINS.flat()
      .filter((stage) => stageIds.includes(stage.id))
      .map((stage) => stage.coordinate)
      .filter((stageCoordinate) => {
        for (const [playerId, position] of objectEntries(this.playerPositions)) {
          if (isEqual(position, stageCoordinate) && this.isPlaced(playerId)) return false
        }
        return true
      })

    if (allValidCoordinates.length === 0) {
      // There actually are no valid coordinates (since all stages have already
      // been used by other players), so we allow the coordinates of all stages.
      //
      // Note, that it's not necessary to exclude the ones where other players
      // have already been placed, since we already checked that above.
      allValidCoordinates = BOARD_SUPPLY_CHAINS.flat().map((stage) => stage.coordinate)
    }

    for (const stageCoordinate of allValidCoordinates) {
      if (isEqual(stageCoordinate, coordinate)) return true
    }
    return false
  }

  isPlaced(playerId: PlayerId) {
    return (
      this.context.events
        .filter(guardForGameEventType('placement'))
        .filter((event) => event.playerId === playerId && event.finalized).length > 0
    )
  }

  get activeTargetedAttacks() {
    const attackCount = 3 * (Math.floor(this.currentRound / 3) + 1)
    return this.context.targetedAttacks
      .slice(0, attackCount)
      .map((attackIndex) => TARGETED_ATTACKS[attackIndex])
  }

  get activeGlobalAttackIndex() {
    return this.currentRound % 3
  }

  get activeGlobalAttack() {
    return this.globalAttackScenario.attacks[this.activeGlobalAttackIndex]
  }

  get globalAttackScenario() {
    return GLOBAL_ATTACK_SCENARIOS[this.context.globalAttackScenario]
  }

  /** All targeted attacks for which the user has all required items. */
  get attackableAttacks() {
    return this.activeTargetedAttacks.filter((attack) =>
      attack.target.requiredItems.every((item) => this.attackInventory[item] > 0),
    )
  }

  static isReachable(a: Coordinate, b: Coordinate) {
    return (
      (a[0] === b[0] && Math.abs(a[1] - b[1]) <= 1) || (a[1] === b[1] && Math.abs(a[0] - b[0]) <= 1)
    )
  }

  /** Stages that are reachable by the attacker. */
  get reachableStages() {
    return BOARD_SUPPLY_CHAINS.flat().filter((stage) =>
      GameState.isReachable(stage.coordinate, this.activePlayerPosition),
    )
  }

  /** All stages for which the attacker has the required items and that are reachable. */
  get attackableStages() {
    return this.reachableStages.filter((stage) =>
      this.attackableAttacks.find(
        (attack) =>
          attack.target.stageId === stage.id && attack.target.supplyChainId === stage.supplyChainId,
      ),
    )
  }
}
