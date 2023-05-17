import type { InterpreterFrom } from 'xstate'
import type { serverGameMachine } from '$lib/server/game-machine/configured'

export type Game = {
  id: string
  name?: string | undefined
  machine: InterpreterFrom<typeof serverGameMachine>
}
