<script lang="ts">
  import { dev } from '$app/environment'
  import { PUBLIC_DEV_DISABLE_CURSOR_POSITIONS } from '$env/static/public'
  import { useSelector } from '$lib/@xstate/svelte'
  import { useMachine } from '$lib/@xstate/svelte/useMachine.js'
  import { setGameContext } from '$lib/client/game-context.js'
  import { getClientGameMachine } from '$lib/client/game-machine/configured.js'
  import { getCurrentUser } from '$lib/client/game-machine/utils'
  import { createWebSocketConnection } from '$lib/client/web-socket'
  import CursorOverlays from '$lib/components/game/CursorOverlays.svelte'
  import EmojiOverlays from '$lib/components/game/EmojiOverlays.svelte'
  import Game from '$lib/components/game/Game.svelte'
  import { COLUMN_COUNT, ROW_COUNT } from '$lib/game/constants/general.js'
  import { play } from '$lib/sound/index.js'
  import { envBool } from '$lib/utils.js'
  import isEqual from 'lodash/isEqual'
  import throttle from 'lodash/throttle'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  export let data

  const machineInput = data.machineInput
  const gameId = machineInput.gameId
  const userId = machineInput.userId
  const hostUserId = machineInput.hostUserId

  const mousePositions: { [key: string]: [number, number] } = {}

  let debug =
    (dev && !window.location.hash.match('#nodebug')) || !!window.location.hash.match('#debug')

  const socketConnection = createWebSocketConnection({
    gameId,
    userId,
    onMessage: (message) => {
      if (message.type === 'mouse position') {
        mousePositions[message.userId] = message.position
      } else {
        machine.send(message)
      }
    },
    debug,
  })

  const machine = useMachine(
    getClientGameMachine({
      send: socketConnection.send,
      actions: {
        playSound: play,
        showEmoji: ({ userId, emoji }) => showEmoji?.({ userId, emoji }),
      },
    }),
    { input: machineInput },
  )

  const user = useSelector(machine.service, ({ context }) => getCurrentUser(context), isEqual)

  setGameContext({ gameId, userId, user, hostUserId, machine, highlightedFields: writable() })

  const state = machine.state

  onMount(() => {
    socketConnection.open()

    return () => {
      socketConnection.close()
    }
  })

  const reportMousePosition = throttle(
    (position: [number, number]) => {
      if (envBool(PUBLIC_DEV_DISABLE_CURSOR_POSITIONS)) return
      if ($socketConnection.status === 'opened') {
        socketConnection.send({
          type: 'mouse position',
          position,
        })
      }
    },
    50,
    { leading: true, trailing: true },
  )

  let showEmoji: (props: { userId: string; emoji: string }) => void
  const fillInventories = () => {
    machine.send({
      type: 'apply game event',
      gameEvent: { type: 'system', action: 'fill-inventory' },
    })
  }
</script>

<Game {reportMousePosition} --row-count={ROW_COUNT} --column-count={COLUMN_COUNT}>
  <svelte:fragment slot="overlays">
    <CursorOverlays {mousePositions} />
    <EmojiOverlays bind:showEmoji />
  </svelte:fragment>
</Game>

{#if debug}
  <button on:click={fillInventories}>fill inventory</button>
  <pre>
{$socketConnection.log.join('\n')}

{JSON.stringify($state, null, 2)}
</pre>
{/if}
