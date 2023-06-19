/**
 * All messages that the server might send to the clients via WebSockets.
 */
export type ServerMessage =
  | {
      type: 'users update'
      users: { id: string; name: string; isConnected: boolean }[]
    }
  | {
      type: 'show emoji'
      emoji: string
      userId: string
    }

/**
 * All messages that the clients might send to the server via WebSockets.
 */
export type ClientMessage = {
  type: `send emoji`
  emoji: string
}

/**
 * The base user type that is used by the server and client.
 *
 * A user is an actual person sitting in front of a browser and connecting to
 * the game.
 *
 * They might be an observer, a host/admin or controlling a `Player`.
 */
export type User = {
  id: string
  name: string
  isConnected: boolean
}

type PlayerRole = 'defender' | 'attacker'

/**
 * The base player type that is used by the server and client.
 *
 * A player is an actual "piece" on the board. It can be controlled by 0 or 1
 * player. If it is not controlled by any player than an "admin" needs to move
 * it.
 *
 * Potentially, in the future, a player might be controlled by multiple users.
 */
export type Player = {
  id: number
  name: string
  role: PlayerRole
  position?: Coordinate | undefined
}

export type Coordinate = [number, number]

export type GameAction = {
  type: 'player moves'
  playerId: number
  /** Which user actually performed the action. */
  userId: number
  to: Coordinate
}
