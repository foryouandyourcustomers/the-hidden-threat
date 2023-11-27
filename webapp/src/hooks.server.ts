import { dev } from '$app/environment'
import { cleanupGames } from '$lib/server/cron/cleanup'
import { setupWebSocketServerListeners } from '$lib/server/web-socket/setup-server-listeners'
import type { Handle } from '@sveltejs/kit'
import schedule from 'node-schedule'

if (!dev) {
  schedule.scheduleJob('0 3 * * *', cleanupGames)
}

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
