import { getGlobalWebSocketServer, type ExtendedWebSocket } from './global-server'

/**
 * Returns all open web sockets for a given player in a given game.
 *
 * TODO: this is a pretty expensive operation, because it iterates over all
 * connections. We might need to improve this in the future.
 */
export const getSocketsForPlayer = ({
  gameId,
  playerId,
}: {
  gameId: string
  playerId: string
}): ExtendedWebSocket[] => {
  return [...getGlobalWebSocketServer().clients].filter(
    (client) => client.playerId === playerId && client.gameId === gameId,
  )
}
