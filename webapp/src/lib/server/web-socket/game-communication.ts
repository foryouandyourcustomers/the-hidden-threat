import type { ServerMessage } from '$lib/logic/game/types'
import { getGlobalWebSocketServer } from './global-server'

/**
 * Sends `message` to all players in `gameId`, except those in
 * `excludePlayerIds`.
 *
 * Note that this will send the same message to _all_ connected WebSockets so
 * the same player might receive the message multiple times.
 */
export const sendMessageToPlayers = ({
  gameId,
  message,
  excludePlayerIds = [],
}: {
  gameId: string
  message: ServerMessage
  excludePlayerIds?: string[]
}) => {
  ;[...getGlobalWebSocketServer().clients]
    .filter((client) => client.gameId === gameId && !excludePlayerIds.includes(client.playerId))
    .forEach((client) => {
      client.send(JSON.stringify(message))
    })
}
