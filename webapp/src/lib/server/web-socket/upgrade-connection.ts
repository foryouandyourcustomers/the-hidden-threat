import type { IncomingMessage } from 'http'
import type { Duplex } from 'stream'
import { parse } from 'url'
import { getGlobalWebSocketServer } from './global-server'

/**
 * The callback function for `server.on('upgrade', callback)`
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade
 */
export const upgradeHttpConnection = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
  const pathname = req.url ? parse(req.url).pathname : null
  if (pathname !== '/websocket') return

  const webSocketServer = getGlobalWebSocketServer()

  webSocketServer.handleUpgrade(req, sock, head, (webSocket) => {
    webSocket.socketId = crypto.randomUUID()
    webSocketServer.emit('connection', webSocket, req)
  })
}
