import {
  gameEventRequiresReaction,
  guardForGameEventAction,
  guardForGameEventAdminAction,
  guardForGameEventType,
  isActionEventOf,
  isGameEventOf,
  isPlayerGameEvent,
  isPlayerIdOfSide,
  type AttackerId,
  type Coordinate,
  type DefenderId,
  type GameEvent,
  type GameEventOf,
  type Player,
  type PlayerGameEvent,
  type PlayerId,
  type SharedGameContext,
  type Side,
} from '$lib/game/types'
import { objectEntries, seededRandomGenerator } from '$lib/utils'
import isEqual from 'lodash/isEqual'
import { BOARD_ITEMS } from './constants/board-items'
import {
  BOARD_SUPPLY_CHAINS,
  findStageAt,
  getStageAt,
  type BoardStage,
} from './constants/board-stages'
import { TOTAL_ROUNDS } from './constants/general'
import { GLOBAL_ATTACK_SCENARIOS } from './constants/global-attacks'
import {
  ITEMS,
  isAttackItemId,
  isDefenseItemId,
  type AttackItemId,
  type DefenseItemId,
} from './constants/items'
import { STAGES, type StageId } from './constants/stages'
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
  private randomNumbers: number[]

  public playerEvents: PlayerGameEvent[]
  public finalizedEvents: PlayerGameEvent[]
  public finalizedPlacementEvents: PlayerGameEvent[]
  public finalizedActionEvents: GameEventOf<'action'>[]
  public finalizedMoveEvents: GameEventOf<'move'>[]
  public finalizedReactionEvents: GameEventOf<'reaction'>[]
  public finalizedPlayerEvents: GameEventOf<'action' | 'move' | 'placement' | 'reaction'>[]
  public finalizedActionEventsRequiringReaction: GameEventOf<'action'>[]
  public finalizedMoveOrActionEvents: GameEventOf<'action' | 'move'>[]

  public currentRound: number
  public activePlayer: Player
  public activeSide: Side
  public activePlayerPosition: Coordinate

  public lastEvent?: PlayerGameEvent
  public lastFinalizedEvent?: PlayerGameEvent

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
    const numberGenerator = seededRandomGenerator(context.timestamp)
    this.randomNumbers = Array.from({ length: 23 }, () => numberGenerator())

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

    this.playerEvents = this.context.events.filter(isPlayerGameEvent)

    this.finalizedEvents = this.playerEvents.filter((event) => event.finalized)

    this.finalizedPlacementEvents = this.finalizedEvents.filter(guardForGameEventType('placement'))
    this.finalizedActionEvents = this.finalizedEvents.filter(guardForGameEventType('action'))
    this.finalizedMoveEvents = this.finalizedEvents.filter(guardForGameEventType('move'))
    this.finalizedReactionEvents = this.finalizedEvents.filter(guardForGameEventType('reaction'))
    this.finalizedActionEventsRequiringReaction =
      this.finalizedActionEvents.filter(gameEventRequiresReaction)
    this.finalizedMoveOrActionEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, 'move') || isGameEventOf(event, 'action'),
    ) as GameEventOf<'action' | 'move'>[]
    this.finalizedPlayerEvents = this.finalizedEvents.filter(
      (event) =>
        isGameEventOf(event, 'move') ||
        isGameEventOf(event, 'action') ||
        isGameEventOf(event, 'placement') ||
        isGameEventOf(event, 'reaction'),
    ) as GameEventOf<'action' | 'move' | 'placement' | 'reaction'>[]

    this.lastEvent = this.playerEvents[this.playerEvents.length - 1]
    this.lastFinalizedEvent = this.finalizedEvents[this.finalizedEvents.length - 1]

    // Determine current round
    const finalizedAndReactedActionEventCount =
      this.finalizedActionEvents.length -
      (this.finalizedActionEventsRequiringReaction.length - this.finalizedReactionEvents.length)
    this.currentRound = Math.floor(finalizedAndReactedActionEventCount / this.playersInOrder.length)

    // Determine next event type
    this.nextEventType =
      this.finalizedPlacementEvents.length < 5
        ? 'placement'
        : this.lastFinalizedEvent && this.lastFinalizedEvent.type === 'move'
        ? 'action'
        : this.finalizedActionEventsRequiringReaction.length > this.finalizedReactionEvents.length
        ? 'reaction'
        : 'move'

    // Which player is active?
    if (this.nextEventType === 'reaction') {
      this.activePlayer = context.attack.attacker
    } else if (this.nextEventType === 'placement') {
      // We're still in the placement phase.
      if (this.finalizedPlacementEvents.length < 4) {
        // The defenders are still placing
        this.activePlayer = context.defense.defenders[this.finalizedPlacementEvents.length]
      } else {
        // The attacker is placing
        this.activePlayer = context.attack.attacker
      }
    } else {
      this.activePlayer =
        this.playersInOrder[
          Math.floor(this.finalizedMoveOrActionEvents.length / 2) % this.playersInOrder.length
        ]
    }

    this.activeSide = getPlayerSide(this.activePlayer.id)

    this.activePlayerPosition = this.playerPositions[this.activePlayer.id]
  }

  get isFinished() {
    return (
      (this.nextEventType !== 'reaction' &&
        this.finalizedActionEvents.length >= this.playersInOrder.length * TOTAL_ROUNDS) ||
      this.attackerIsCaught
    )
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
      .filter((event) => event.finalized)
      .forEach((event) => (playerPositions[event.playerId] = event.coordinate))

    this.context.events
      .filter(guardForGameEventType('move'))
      .filter((event) => event.finalized)
      .forEach((event) => (playerPositions[event.playerId] = event.to))

    return playerPositions
  }

  get jokers() {
    return (
      2 -
      this.finalizedEvents.filter(
        (event) =>
          (event.type === 'action' && event.action === 'exchange-joker') ||
          (event.type === 'reaction' && event.action === 'joker' && event.useJoker === true),
      ).length
    )
  }

  get defenseInventory() {
    const defenseInventoryIds = Object.values(ITEMS)
      .map((item) => item.id)
      .filter(isDefenseItemId)

    let initialAmount = 0
    if (this.context.events.find(guardForGameEventAdminAction('fill-inventory'))) {
      initialAmount = 50
    }

    const inventory = Object.fromEntries(
      defenseInventoryIds.map((id) => [id, initialAmount]),
    ) as ItemInventory<'defense'>

    this.finalizedActionEvents.filter(guardForGameEventAction('collect')).forEach((event) => {
      if (event.itemId && isDefenseItemId(event.itemId)) {
        inventory[event.itemId] += 1
      }
    })

    this.finalizedActionEvents
      .filter(guardForGameEventAction('exchange-digital-footprint'))
      .forEach((event) => {
        if (event.item) {
          inventory[event.item]++
          inventory['digital-footprint']--
        }
      })

    return inventory
  }

  get attackInventory() {
    const attackInventoryIds = Object.values(ITEMS)
      .map((item) => item.id)
      .filter(isAttackItemId)

    let initialAmount = 0
    if (this.context.events.find(guardForGameEventAdminAction('fill-inventory'))) {
      initialAmount = 50
    }

    const inventory = Object.fromEntries(
      attackInventoryIds.map((id) => [id, initialAmount]),
    ) as ItemInventory<'attack'>

    this.finalizedActionEvents.filter(guardForGameEventAction('collect')).forEach((event) => {
      if (event.itemId && isAttackItemId(event.itemId)) {
        inventory[event.itemId] += 1
      }
    })

    this.finalizedActionEvents
      .filter(guardForGameEventAction('exchange-joker'))
      .forEach((event) => {
        if (event.itemId) {
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

  get defendedStages(): BoardStage[] {
    return this.attackedAndDefendedStages.defended
  }

  get attackedStages(): BoardStage[] {
    return this.attackedAndDefendedStages.attacked
  }

  // Returns a random number, but always the same for i
  public getRandomNumber(i: number) {
    return this.randomNumbers[Math.round(i) % this.randomNumbers.length]
  }

  private attackedAndDefendedStagesCache:
    | { attacked: BoardStage[]; defended: BoardStage[] }
    | undefined

  private get attackedAndDefendedStages(): { attacked: BoardStage[]; defended: BoardStage[] } {
    if (this.attackedAndDefendedStagesCache) return this.attackedAndDefendedStagesCache

    const attackedStages: BoardStage[] = []
    const defendedStages: BoardStage[] = []

    let defendedStagesInSection: StageId[] = []

    // Get all stages for which there are explicit attacks
    this.finalizedActionEvents.forEach((event, i) => {
      const round = Math.floor(i / this.playersInOrder.length)

      if (isActionEventOf(event, 'attack')) {
        // We assume that every attack is valid, otherwise it wouldn't be in
        // the list.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attackedStages.push(getStageAt(event.position!))
      } else if (isActionEventOf(event, 'defend')) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defendedStages.push(getStageAt(event.position!))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defendedStagesInSection.push(getStageAt(event.position!).id)
      }

      // Every three rounds a section ends.
      // In each round, there are 6 action events.
      if ((i + 1) % (this.playersInOrder.length * 3) === 0 && this.nextEventType !== 'reaction') {
        // We're at the end of a section, so let's see if a global attack
        // succeeded.

        const section = Math.floor(round / 3)
        const globalAttack = this.globalAttackScenario.attacks[section]

        globalAttack.targets.forEach((attackedStage) => {
          if (!defendedStagesInSection.includes(attackedStage.stageId)) {
            // So the global attack succeeded. Destroy a stage.
            const allAvailableStages = BOARD_SUPPLY_CHAINS.flat()
              .filter((stage) => stage.id === attackedStage.stageId)
              .filter(
                (stage) =>
                  ![...defendedStages, ...attackedStages].find((s) =>
                    isEqual(s.coordinate, stage.coordinate),
                  ),
              )

            if (allAvailableStages.length > 0) {
              attackedStages.push(
                allAvailableStages[Math.floor(allAvailableStages.length * this.getRandomNumber(i))],
              )
            }
          }
        })

        // Reset the defended stages for global attacks every 3 rounds
        defendedStagesInSection = []
      }

      // Destroy supply chains if there are 3 or more attacks on a supply chain
      const chainAttackCounts = [
        attackedStages.filter((stage) => stage.supplyChainId === 0).length,
        attackedStages.filter((stage) => stage.supplyChainId === 1).length,
        attackedStages.filter((stage) => stage.supplyChainId === 2).length,
      ]

      chainAttackCounts.forEach((count, chainId) => {
        if (count >= 3) {
          const otherStages = BOARD_SUPPLY_CHAINS[chainId]
            // Exclude already attacked or defended stages
            .filter((stage) => ![...attackedStages, ...defendedStages].includes(stage))
          attackedStages.push(...otherStages)
        }
      })
    })

    return (this.attackedAndDefendedStagesCache = {
      attacked: attackedStages,
      defended: defendedStages,
    })
  }

  isDefended(position: Coordinate) {
    return !!this.defendedStages.find((stage) => isEqual(stage.coordinate, position))
  }

  isAttacked(position: Coordinate) {
    return !!this.attackedStages.find((stage) => isEqual(stage.coordinate, position))
  }

  get activeTargetedAttacks() {
    // Active attacks are only available after the placement phase.
    if (this.finalizedPlacementEvents.length < 5) return []

    const attackCount = 3 * (Math.floor(this.currentRound / 3) + 1)
    return this.context.targetedAttacks
      .slice(0, attackCount)
      .map((attackIndex) => TARGETED_ATTACKS[attackIndex])
  }

  get activeGlobalAttackIndex() {
    return Math.floor(this.currentRound / 3)
  }

  get activeGlobalAttack() {
    return this.globalAttackScenario.attacks[this.activeGlobalAttackIndex]
  }

  get globalAttackScenario() {
    return GLOBAL_ATTACK_SCENARIOS[this.context.globalAttackScenario]
  }

  /** All targeted attacks for which the user has all required items. */
  get executableAttacks() {
    return this.activeTargetedAttacks.filter((attack) =>
      attack.target.requiredItems.every((item) => this.attackInventory[item] > 0),
    )
  }

  get executableDefenseStages() {
    return STAGES.filter((stage) =>
      stage.defenseItems.every((item) => this.defenseInventory[item] > 0),
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

  /** All stages that are reachable and can be attacked. */
  get attackableStages() {
    return this.reachableStages.filter(
      (stage) =>
        !this.isAttacked(stage.coordinate) &&
        !this.isDefended(stage.coordinate) &&
        this.executableAttacks.find(
          (attack) =>
            attack.target.stageId === stage.id &&
            attack.target.supplyChainId === stage.supplyChainId,
        ),
    )
  }

  /** Returns the stage of the player position if all required conditions are met. */
  get canDefendStage() {
    const currentStage = findStageAt(this.activePlayerPosition)
    if (!currentStage) return false

    if (this.isAttacked(currentStage.coordinate) || this.isDefended(currentStage.coordinate)) {
      return false
    }

    return !!this.executableDefenseStages.find((stage) => stage.id === currentStage.id)
  }

  get attackerIsCaught() {
    const lastFinalizedActionEvent = this.finalizedActionEvents.at(-1)
    if (
      lastFinalizedActionEvent?.action !== 'ask-question' ||
      lastFinalizedActionEvent.question !== 'is-on-field'
    ) {
      return false
    }

    // The defense asked whether the attacker is on the field

    const lastFinalizedPlayerEvent = this.finalizedPlayerEvents.at(-1)
    if (
      lastFinalizedPlayerEvent?.type === 'reaction' &&
      lastFinalizedPlayerEvent.action === 'joker' &&
      lastFinalizedPlayerEvent.useJoker === false &&
      lastFinalizedPlayerEvent.finalized
    ) {
      // There is a reaction, and no joker was used.

      // The attacker was caught if the defender was on the same field.
      return isEqual(lastFinalizedActionEvent.position, this.playerPositions.attacker)
    }

    return false
  }

  get score() {
    const section = Math.floor(this.currentRound / 3)

    const attackerCaughtPoints = Math.max(1, 3 - section)

    const attack = this.attackedStages.length
    const defense = this.defendedStages.length + (this.attackerIsCaught ? attackerCaughtPoints : 0)
    return {
      attack,
      defense,
    }
  }

  /**
   * Returns the "active" question, meaning: if the last *finalized* action was
   * an action that requires a reaction.
   *
   * This ignores any attacker movement or actions after.
   */
  get activeQuestion() {
    const lastEvent = this.finalizedActionEvents
      .filter((event) => event.playerId !== 'attacker')
      .at(-1)

    if (lastEvent) {
      if (lastEvent.action === 'ask-question') return lastEvent.question
      if (gameEventRequiresReaction(lastEvent)) {
        return lastEvent.action
      }
    }

    return undefined
  }
}
