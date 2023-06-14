import { getGlobalWebSocketServer, type ExtendedWebSocket } from './global-server'

/**
 * Returns all open web sockets for a given user in a given game.
 *
 * TODO: this is a pretty expensive operation, because it iterates over all
 * connections. We might need to improve this in the future.
 */
export const getSocketsForUser = ({
  gameId,
  userId,
}: {
  gameId: string
  userId: string
}): ExtendedWebSocket[] => {
  return [...getGlobalWebSocketServer().clients].filter(
    (client) => client.userId === userId && client.gameId === gameId,
  )
}
