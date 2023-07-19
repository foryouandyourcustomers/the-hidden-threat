import type { DEFAULT_ATTACK_INVENTORY, DEFAULT_DEFENSE_INVENTORY } from './constants'

export type Side = 'defender' | 'attacker'

/**
 * All messages that the server might send to the clients via WebSockets.
 */
export type ServerMessage =
  | {
      type: 'users update'
      users: User[]
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

/**
 * All messages that the clients might send to the server via WebSockets.
 */
export type ClientMessage =
  | {
      type: `send emoji`
      emoji: string
    }
  /** This is not forwarded to the machine but redirected directly to the other
   * users */
  | {
      type: `mouse position`
      position: [number, number]
    }
  | {
      type: 'assign side'
      side: Side
      otherUserId: string
    }
  | {
      type: 'assign admin'
      isAdmin: boolean
      otherUserId: string
    }
  | { type: 'start game' }
  | { type: 'finish setup' }
  | { type: 'assign role' }
  | { type: 'set character order' }
  | { type: 'start setup' }
  | { type: 'rollback game action' }
  | { type: 'execute game action' }

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
  side?: Side | undefined
}

type DefenderRole = 'it-specialist' | 'quality-manager' | 'dispatch-manager' | 'order-manager'

// TODO: add real faces
type Face = 'woman' | 'man' | 'other'

/**
 * The base class for Defender and Attacker.
 */
export type Player = {
  position: Coordinate
  userId: string
}

export type Defender = Player & {
  role: DefenderRole
  face: Face
}
export type Attacker = Player

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

export type GameAction = {
  timestamp: number
  type: 'chracter moves'
  playerId: PlayerId
  /** Which user actually performed the action. */
  userId: number
  to: Coordinate
}

export type SharedGameContext = {
  gameId: string
  hostUserId: string
  users: User[]
  actions: GameAction[]
  finishedAssigningSides: boolean
  defense: {
    finishedConfiguring: boolean
    /** The list of defenders in the correct order. Up to 4 */
    defenders: Defender[]
    inventory: DefenseInventory
  }
  attack: {
    finishedConfiguring: boolean
    attacker?: Attacker
    inventory: AttackInventory
  }
}
