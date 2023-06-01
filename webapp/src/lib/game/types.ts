/**
 * All messages that the server might send to the clients via WebSockets.
 */
export type ServerMessage =
  | {
      type: 'players update'
      players: { id: string; name: string; isConnected: boolean }[]
    }
  | {
      type: 'show emoji'
      emoji: string
      playerId: string
    }

/**
 * All messages that the clients might send to the server via WebSockets.
 */
export type ClientMessage = {
  type: `send emoji`
  emoji: string
}

/**
 * The base player type that is used by the server `Player` and client `Player`.
 */
export type BasePlayer = {
  id: string
  name: string
  isConnected: boolean
}
