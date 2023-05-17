import type { ServerMessage } from '$lib/game/types'
import { writable } from 'svelte/store'

type WebSocketConnection = {
  status: 'not-started' | 'opening' | 'opened' | 'closed'
  log: string[]
}

export const createWebSocketConnection = ({
  gameId,
  playerId,
  onMessage,
}: {
  gameId: string
  playerId: string
  onMessage: (message: ServerMessage) => void
}) => {
  const webSocketConnection = writable<WebSocketConnection>({ status: 'opening', log: [] })

  const logEvent = (message: string, consoleData?: unknown) => {
    console.log('[websocket]', message, consoleData)
    return webSocketConnection.update((connection) => ({
      ...connection,
      log: [...connection.log, `[websocket] ${message}`],
    }))
  }

  const updateStatus = (status: WebSocketConnection['status']) =>
    webSocketConnection.update((connection) => ({ ...connection, status }))

  let ws: WebSocket | undefined

  const open = () => {
    logEvent('connecting')

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(
      `${protocol}//${window.location.host}/websocket?gameId=${gameId}&playerId=${playerId}`,
    )

    ws.addEventListener('open', () => {
      updateStatus('opened')
      logEvent('connection open')
    })
    ws.addEventListener('close', () => {
      updateStatus('closed')
      logEvent('connection closed')
    })
    ws.addEventListener('message', (event) => {
      logEvent(`message received: ${event.data}`, event)
      try {
        const message = JSON.parse(event.data) as ServerMessage
        onMessage(message)
      } catch (error) {
        logEvent(`error parsing message`, error)
      }
    })
  }

  return { subscribe: webSocketConnection.subscribe, open, close: () => ws?.close() }
}
