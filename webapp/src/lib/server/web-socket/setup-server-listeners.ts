import { building, dev } from '$app/environment'
import type { ClientMessage } from '$lib/game/types'
import { sendMessageToMachine } from '$lib/server/game'
import { sendMessageToUsers } from './game-communication'
import { getSocketsForUser } from './game-utils'
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

/**
 * This function is invoked when a new connection by a user is made. It will
 * setup the error, message and close listeners on the web socket and inform the
 * ServerStateMachine of relevant updates.
 *
 * Each connection is directly tied to a user and a game.
 *
 * This connection will do nothing, if the user hasn't joined the game
 * beforehand.
 */
const connectionCallback: ConnectionCallback = (webSocket) => {
  console.log(`[wss:kit] client connected (${webSocket.socketId})`)

  if (getSocketsForUser(webSocket).length === 1) {
    // Inform the ServerStateMachine that a user has connected, but only if this
    // was the first connection (otherwise the server already knows).
    sendMessageToMachine(webSocket.gameId, {
      type: 'user connected',
      userId: webSocket.userId,
    })
  } else {
    sendMessageToMachine(webSocket.gameId, {
      type: 'user reconnected',
      userId: webSocket.userId,
    })
  }

  webSocket.on('error', console.error)

  webSocket.on('message', (data) => {
    const message = JSON.parse(data.toString()) as ClientMessage

    if (message.type === 'mouse position') {
      sendMessageToUsers({
        gameId: webSocket.gameId,
        message: { type: 'mouse position', userId: webSocket.userId, position: message.position },
        excludeUserIds: [webSocket.userId],
      })
    } else {
      console.log('[wss:kit] received: %s', data)
      sendMessageToMachine(webSocket.gameId, { ...message, userId: webSocket.userId })
    }
  })

  webSocket.on('close', () => {
    console.log(`[wss:kit] client disconnected (${webSocket.socketId})`)

    if (getSocketsForUser(webSocket).length === 0) {
      // Inform the ServerStateMachine that a user has disconnected, but only if this
      // was the last remaining connection. If the user has multiple tabs open, they are
      // not disconnected.
      sendMessageToMachine(webSocket.gameId, {
        type: 'user disconnected',
        userId: webSocket.userId,
      })
    }
  })
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
