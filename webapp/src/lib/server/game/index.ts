import { serverGameMachine } from '$lib/server/game-machine/configured'
import type { ServerEvent, ServerUser } from '$lib/server/game-machine/types'
import shortUuid from 'short-uuid'
import { interpret } from 'xstate'
import { addGame, getGame } from './global'
import type { Game } from './types'

/**
 * Returns the uuid of the game
 */
export const createGame = ({ host }: { host: ServerUser }): Game => {
  const id = shortUuid.generate()

  const machine = interpret(serverGameMachine, {
    input: { gameId: id, host },
  }).start()

  machine.subscribe((state) => {
    console.log('  state:', state.value)
    console.log('context:', state.context)
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
