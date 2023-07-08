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

/**
 * A character is an actual "piece" on the board. It can be controlled by 0 or 1
 * users. If it is not controlled by any user than an "admin" needs to move
 * it.
 *
 * Potentially, in the future, a character might be controlled by multiple users.
 */
export type Character = {
  id: number
  name: string
  side: Side
  position?: Coordinate | undefined
}

export type Coordinate = [number, number]

export type GameAction = {
  type: 'chracter moves'
  characterId: number
  /** Which user actually performed the action. */
  userId: number
  to: Coordinate
}
