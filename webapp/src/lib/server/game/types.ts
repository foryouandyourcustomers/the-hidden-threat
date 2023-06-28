import type { InterpreterFrom } from 'xstate'
import type { serverGameMachine } from '$lib/server/game-machine/configured'

export type Game = {
  id: string
  machine: InterpreterFrom<typeof serverGameMachine>
}
