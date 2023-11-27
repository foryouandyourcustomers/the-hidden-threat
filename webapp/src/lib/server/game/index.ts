import type { SharedGameContext, User } from '$lib/game/types'
import { getSharedGameContext } from '$lib/game/utils'
import { serverGameMachine } from '$lib/server/game-machine/configured'
import type { ServerEvent } from '$lib/server/game-machine/types'
import { sendMessageToUsers } from '$lib/server/web-socket/game-communication'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import shortUuid from 'short-uuid'
import { createActor } from 'xstate'
import { addGame, getGame } from './global'
import type { Game } from './types'

/**
 * Returns the uuid of the game
 */
export const createGame = ({ host }: { host: User }): Game => {
  const id = shortUuid.generate()

  const machine = createActor(serverGameMachine, {
    input: { gameId: id, host },
  }).start()

  let prevSharedGameContext: SharedGameContext | undefined = undefined

  machine.subscribe({
    next: (state) => {
      const newSharedGameContext = getSharedGameContext(state.context)
      if (!isEqual(prevSharedGameContext, newSharedGameContext)) {
        // Cloning the shared context, since otherwise we'll be comparing the
        // same objects.
        prevSharedGameContext = cloneDeep(newSharedGameContext)
        sendMessageToUsers({
          gameId: id,
          message: {
            type: 'shared game context update',
            sharedGameContext: newSharedGameContext,
          },
        })
      }
      console.log('State:', state.value)
    },
    complete: () => console.log(`Game machine ${id} completed`),
    error: (error) => console.error(`\nERROR: `, error, '\n'),
  })

  const game = { id, machine }
  addGame(game)
  return game
}

export const sendMessageToMachine = (gameId: string, event: ServerEvent) => {
  const game = getGame(gameId)
  if (!game) {
    console.error(`Game ${gameId} not found`)
    return
  }
  game.machine.send(event)
}
