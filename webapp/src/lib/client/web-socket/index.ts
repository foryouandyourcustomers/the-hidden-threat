import type { ClientMessage, ServerMessage } from '$lib/game/types'
import { writable } from 'svelte/store'

type WebSocketConnection = {
  status: 'not-started' | 'opening' | 'opened' | 'closed'
  log: string[]
}

export const createWebSocketConnection = ({
  gameId,
  userId,
  onMessage,
  debug,
}: {
  gameId: string
  userId: string
  onMessage: (message: ServerMessage) => void
  debug: boolean
}) => {
  const webSocketConnection = writable<WebSocketConnection>({ status: 'opening', log: [] })

  const logEvent = (message: string, consoleData?: unknown) => {
    if (!debug) return
    console.debug('[websocket]', message, consoleData)
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
      `${protocol}//${window.location.host}/websocket?gameId=${gameId}&userId=${userId}`,
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
      try {
        const message = JSON.parse(event.data) as ServerMessage
        if (message.type !== 'mouse position') logEvent(`message received: ${event.data}`, event)
        onMessage(message)
      } catch (error) {
        logEvent(`error parsing message`, error)
      }
    })
    // TODO: add error handling and reconnection here.
  }

  const send = (message: ClientMessage) => {
    ws?.send(JSON.stringify(message))
  }

  return { subscribe: webSocketConnection.subscribe, open, close: () => ws?.close(), send }
}
