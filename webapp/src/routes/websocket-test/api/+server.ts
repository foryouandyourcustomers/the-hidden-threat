import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { WebSocket } from 'ws'

export const GET = (async ({ url, locals }) => {
  console.log(locals.webSocketServer.clients.size, 'web socket clients connected')
  locals.webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`Hello from the GET handler at ${new Date().toLocaleString()}`)
    }
  })
  return json({ success: true, message: 'Hello world from GET handler', url })
}) satisfies RequestHandler
