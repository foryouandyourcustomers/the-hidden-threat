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
 * The base user type that is used by the server and client `User`.
 */
export type BaseUser = {
  id: string
  name: string
  isConnected: boolean
}

type PlayerRole = 'defender' | 'attacker'

/**
 * The base player type that is used by the server and client `Player`.
 */
export type BasePlayer = {
  name: string
  role: PlayerRole
}
