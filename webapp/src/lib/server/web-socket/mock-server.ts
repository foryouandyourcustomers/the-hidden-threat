import type { ExtendedWebSocketServer } from './global-server'

/**
 * This is a fake web socket server that throws an error when you try to use it.
 *
 * It's used during prerendering so there is a sensible error message when
 * trying to access the web socket server.
 *
 * The other alternative would be to make `event.locals.webSocketServer`
 * optional but this would mean that each route has to add a check or use `!` to
 * assert it.
 */
export const FAKE_WEB_SOCKET_SERVER = new Proxy({} as ExtendedWebSocketServer, {
  get() {
    throw new Error(
      `

=================================================
Web sockets are not available during prerendering
=================================================

`,
    )
  },
})
