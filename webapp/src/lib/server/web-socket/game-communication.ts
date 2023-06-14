import type { ServerMessage } from '$lib/game/types'
import { getGlobalWebSocketServer } from './global-server'

/**
 * Sends `message` to all users in `gameId`, except those in
 * `excludeUserIds`.
 *
 * Note that this will send the same message to _all_ connected WebSockets so
 * the same user might receive the message multiple times.
 */
export const sendMessageToUsers = ({
  gameId,
  message,
  excludeUserIds = [],
}: {
  gameId: string
  message: ServerMessage
  excludeUserIds?: string[]
}) => {
  ;[...getGlobalWebSocketServer().clients]
    .filter((client) => client.gameId === gameId && !excludeUserIds.includes(client.userId))
    .forEach((client) => {
      client.send(JSON.stringify(message))
    })
}
