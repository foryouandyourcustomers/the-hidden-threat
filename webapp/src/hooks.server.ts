import { setupWebSocketServerListeners } from '$lib/server/web-socket/setup-server-listeners'
import type { Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
  const webSocketServer = setupWebSocketServerListeners()

  // Add the web socket server to the locals object so that all routes can
  // access it without having to use the global object.
  event.locals.webSocketServer = webSocketServer

  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type',
  })
  return response
}) satisfies Handle
