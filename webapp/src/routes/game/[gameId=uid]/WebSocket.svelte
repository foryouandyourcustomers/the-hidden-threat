<script lang="ts">
  export let gameId: string
  export let playerId: string

  let webSocketEstablished = false
  let ws: WebSocket | null = null
  let log: string[] = []

  const logEvent = (str: string) => {
    log = [...log, str]
  }

  const establishWebSocket = () => {
    if (webSocketEstablished) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(
      `${protocol}//${window.location.host}/websocket?gameId=${gameId}&playerId=${playerId}`,
    )
    ws.addEventListener('open', (event) => {
      webSocketEstablished = true
      console.log('[websocket] connection open', event)
      logEvent('[websocket] connection open')
    })
    ws.addEventListener('close', (event) => {
      console.log('[websocket] connection closed', event)
      logEvent('[websocket] connection closed')
    })
    ws.addEventListener('message', (event) => {
      console.log('[websocket] message received', event)
      logEvent(`[websocket] message received: ${event.data}`)
    })
    console.log('hi222')
  }

  const requestData = async () => {
    const res = await fetch('/websocket-test/api')
    const data = await res.json()
    console.log('Data from GET endpoint', data)
    logEvent(`[GET] data received: ${JSON.stringify(data)}`)
  }
  const sendWsMessage = async () => {
    ws?.send('Manual send from client')
  }

  const joinGame = async () => {
    ws?.send(JSON.stringify({ name: 'Martias', gameId }))
  }
</script>

<main>
  <h1>WebSockets</h1>

  <button disabled={webSocketEstablished} on:click={() => establishWebSocket()}>
    Establish WebSocket connection
  </button>

  <button on:click={() => requestData()}> Request Data from GET endpoint </button>

  <button on:click={() => sendWsMessage()}>Send WS message </button>

  <button on:click={() => joinGame()}>Join game</button>

  <ul>
    {#each log as event}
      <li>{event}</li>
    {/each}
  </ul>

  <h1>^^^^^^^^^^^^^^^^^</h1>
</main>

<style>
  main {
    font-family: sans-serif;
  }
</style>
