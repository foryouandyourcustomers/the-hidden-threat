import type { ClientEvent } from '$lib/client/game-machine/types'
import type { DEFAULT_ATTACK_INVENTORY, DEFAULT_DEFENSE_INVENTORY, FaceId } from './constants'

export type Side = 'defender' | 'attacker'

/**
 * All messages that the server might send to the clients via WebSockets.
 */
export type ServerMessage =
  | {
      type: 'shared game context update'
      sharedGameContext: SharedGameContext
    }
  | {
      type: 'show emoji'
      emoji: string
      userId: string
    }
  | {
      type: 'mouse position'
      userId: string
      position: [number, number]
    }

type UserPrefixed<T extends ClientEvent> = {
  [K in keyof T]: K extends 'type' ? `user: ${T[K]}` : T[K]
}
export type ClientEventAsMessage = UserPrefixed<ClientEvent>

/**
 * All messages that the clients might send to the server via WebSockets.
 */
export type ClientMessage =
  | ClientEventAsMessage
  /** This is not forwarded to the machine but redirected directly to the other
   * users */
  | {
      type: `mouse position`
      position: [number, number]
    }

/**
 * The base user type that is used by the server and client.
 *
 * A user is an actual person sitting in front of a browser and connecting to
 * the game.
 *
 * They might be an observer, a host/admin or controlling a `Character`.
 */
export type User = {
  id: string
  name: string
  isAdmin: boolean
  isConnected: boolean
  /**
   * Users don't really have a side since they are controlling "Characters"
   * which have a side.
   *
   * But they can be assigned to a side, since it defines what they can see.
   *
   * It doesn't make sense for a user to control a character that is on the
   * opposite side, but a user that is a spectator is simply assigned at side
   * at the start of the game.
   */
  side: Side
  /** Wether an admin has explicitly assigned a side.  */
  isSideAssigned: boolean
}

export type Role = DefenderRole | AttackerRole

export type AttackerRole = 'disappointment' | 'frustration'

export type DefenderRole =
  | 'it-specialist'
  | 'quality-manager'
  | 'dispatch-manager'
  | 'order-manager'

/**
 * The base class for Defender and Attacker.
 */
export type Player = {
  position: Coordinate
  userId: string
  faceId: FaceId
  /**
   * If false the player still has default values.
   * True, after an admin configured the player.
   */
  isConfigured: boolean
}

export type Defender = Player & {
  role: DefenderRole
}
export type Attacker = Player & {
  role: AttackerRole
}

export type Coordinate = [number, number]

export type DefenseInventory = typeof DEFAULT_DEFENSE_INVENTORY
export type AttackInventory = typeof DEFAULT_ATTACK_INVENTORY
export type DefenseItem = keyof DefenseInventory
export type AttackItem = keyof AttackInventory

export type PlayerId = DefenderId | AttackerId
export type DefenderId = 0 | 1 | 2 | 3
export type AttackerId = 'attacker'

export const isDefenderId = (id: PlayerId): id is DefenderId => id !== 'attacker'
export const isAttackerId = (id: PlayerId): id is AttackerId => id === 'attacker'

type BaseGameEvent = {
  timestamp: number
  playerId: PlayerId
  /** Which user actually triggered the event. */
  userId: number
  finalized: boolean
}

export type GameEvent =
  | (BaseGameEvent & {
      type: 'move'
      to: Coordinate
    })
  | (BaseGameEvent & {
      type: 'collect'
      item: AttackItem | DefenseItem
    })

export type AttackScenario = 'todo'

export type SharedGameContext = {
  gameId: string
  hostUserId: string
  users: User[]
  events: GameEvent[]
  finishedAssigningSides: boolean
  globalAttackScenarios: [AttackScenario, AttackScenario, AttackScenario, AttackScenario]
  defense: {
    editingPlayer?: undefined | DefenderId
    finishedAssigning: boolean
    /** The list of defenders in the correct order. Up to 4 */
    defenders: [Defender, Defender, Defender, Defender]
    inventory: DefenseInventory
  }
  attack: {
    editingPlayer?: undefined | AttackerId
    finishedAssigning: boolean
    attacker: Attacker
    inventory: AttackInventory
  }
}
