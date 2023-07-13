import { WebSocketServer, WebSocket } from 'ws'

const GLOBAL_WEB_SOCKET_SERVER_KEY = Symbol.for('sveltekit.web-socket-server')

/**
 * A modified version of the WebSocket that contains additional information about
 * the game and user.
 *
 * The `WebSocketServer` uses this class when instantiating a new web socket
 * connection.
 */
export class ExtendedWebSocket extends WebSocket {
  public socketId = ''
  public gameId = ''
  public userId = ''
}

export type ExtendedWebSocketServer = InstanceType<typeof WebSocketServer<typeof ExtendedWebSocket>>

/**
 * This gets called exactly once when the server starts (production and dev) and
 * stores the web socket server in the global object.
 */
export const createGlobalWebSocketServer = () => {
  const webSocketServer = new WebSocketServer({ noServer: true, WebSocket: ExtendedWebSocket })

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
