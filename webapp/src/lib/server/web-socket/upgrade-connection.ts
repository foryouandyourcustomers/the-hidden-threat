import type { IncomingMessage } from 'http'
import type { Duplex } from 'stream'
import { getGlobalWebSocketServer } from './global-server'

/**
 * The callback function for `server.on('upgrade', callback)`
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade
 */
export const upgradeHttpConnection = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
  try {
    const url = req.url ? new URL(req.url, 'http://localhost') : undefined
    const pathname = url?.pathname
    if (!url || pathname !== '/websocket') return

    const gameId = url.searchParams.get('gameId')
    const playerId = url.searchParams.get('playerId')

    if (!gameId) throw new Error('No gameId provided')
    if (!playerId) throw new Error('No playerId provided')

    const webSocketServer = getGlobalWebSocketServer()

    webSocketServer.handleUpgrade(req, sock, head, (webSocket) => {
      webSocket.socketId = crypto.randomUUID()
      webSocket.gameId = gameId
      webSocket.playerId = playerId
      webSocketServer.emit('connection', webSocket, req)
    })
  } catch (e) {
    console.error('Unable to upgrade http connection:', e)
  }
}
