import type { Server, WebSocket as WebSocketBase } from 'ws'
import { WebSocketServer } from 'ws'

const GLOBAL_WEB_SOCKET_SERVER_KEY = Symbol.for('sveltekit.web-socket-server')

export type ExtendedWebSocket = WebSocketBase & {
  socketId: string
}

export type ExtendedWebSocketServer = Server<ExtendedWebSocket>

/**
 * This gets called exactly once when the server starts (production and dev) and
 * stores the web socket server in the global object.
 */
export const createGlobalWebSocketServer = () => {
  const webSocketServer = new WebSocketServer({ noServer: true }) as ExtendedWebSocketServer

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any)[GLOBAL_WEB_SOCKET_SERVER_KEY] = webSocketServer

  return webSocketServer
}
/**
 * Returns the global web socket server.
 *
 * **NOTE:** You should not need to use this in the app / routes. Instead, you
 * should access the global instance via `event.locals.webSocketServer`.
 *
 * This assumes that `createGlobalWebSocketServer()` has already been called,
 * and will throw if not.
 */
export const getGlobalWebSocketServer = (): ExtendedWebSocketServer => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const webSocketServer = (globalThis as any)[GLOBAL_WEB_SOCKET_SERVER_KEY]
  if (!webSocketServer) throw new Error('There is no global WebSocket server')
  return webSocketServer
}
