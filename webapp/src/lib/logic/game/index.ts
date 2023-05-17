import { serverMachine } from '$lib/logic/machines/server/configured'
import type { Player, ServerEvent } from '$lib/logic/machines/server/types'
import { interpret } from 'xstate'
import { addGame, getGame } from './global'
import type { Game } from './types'
import shortUuid from 'short-uuid'

/**
 * Returns the uuid of the game
 */
export const createGame = ({ name, host }: { name?: string; host: Player }): Game => {
  const id = shortUuid.generate()

  const machine = interpret(serverMachine, {
    input: { gameId: id, host },
  }).start()

  machine.subscribe((state) => {
    console.log('  state:', state.value)
    console.log('context:', state.context)
  })

  const game = { id, name, machine }
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
