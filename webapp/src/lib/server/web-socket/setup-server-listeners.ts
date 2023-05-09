import { building, dev } from '$app/environment'
import {
  getGlobalWebSocketServer,
  type ExtendedWebSocket,
  type ExtendedWebSocketServer,
} from './global-server'
import { FAKE_WEB_SOCKET_SERVER } from './mock-server'

let wssInitialized = false

/**
 * Initializes the web socket server if it hasn't already been initialized.
 *
 * This takes care of unsubscribing any previous connection listeners in case it
 * is called again with `wssInitialized == false`, which can happen in dev mode
 * during hot reloading.
 */
export const setupWebSocketServerListeners = (): ExtendedWebSocketServer => {
  if (building) return FAKE_WEB_SOCKET_SERVER

  const webSocketServer = getGlobalWebSocketServer()
  if (wssInitialized) return webSocketServer

  wssInitialized = true

  console.log('[wss:kit] setup')

  if (dev) {
    // If this file is edited, Vite will rerun it and the next connection would
    // simply add the same listeners again. To avoid this, we remove all
    // previous listeners.
    removePreviousConnectionListeners(webSocketServer)
  }

  console.log('[wss:kit] setting up connection listener')

  webSocketServer.on('connection', connectionCallback)

  return webSocketServer
}

/**
 * Because other connection listeners might exist on the web socket server, and
 * vite might simply rebuild our callback we need a way to identify which
 * connection listeners are the ones in this file. We do this by adding a
 * `svelteKitListener` property on the function that we can test for.
 */
type ConnectionCallback = ((webSocket: ExtendedWebSocket) => void) & { svelteKitListener: true }

const connectionCallback: ConnectionCallback = (webSocket: ExtendedWebSocket) => {
  // This is where you can authenticate the client from the request
  // const session = await getSessionFromCookie(request.headers.cookie || '');
  // if (!session) ws.close(1008, 'User not authenticated');
  // ws.userId = session.userId;
  console.log(`[wss:kit] client connected (${webSocket.socketId})`)

  webSocket.on('error', console.error)

  webSocket.on('message', (data) => {
    console.log('[wss:kit] received: %s', data)
    webSocket.send('Thanks for the awesome message!')
  })
  webSocket.on('close', () => {
    console.log(`[wss:kit] client disconnected (${webSocket.socketId})`)
  })

  webSocket.send(`Hello from SvelteKit ${new Date().toLocaleString()} (${webSocket.socketId})]`)
}
connectionCallback.svelteKitListener = true

const isConnectionCallback = (callback: object): callback is ConnectionCallback =>
  Object.hasOwn(callback, 'svelteKitListener')

const removePreviousConnectionListeners = (webSocketServer: ExtendedWebSocketServer) => {
  const previousSvelteKitListeners = webSocketServer
    .listeners('connection')
    .filter(isConnectionCallback)
  if (previousSvelteKitListeners.length > 0) {
    console.log('[wss:kit] removing old connection listeners')
    previousSvelteKitListeners.forEach((listener) =>
      webSocketServer.removeListener('connection', listener),
    )
  }
}
