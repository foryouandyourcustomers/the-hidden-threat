import type { useMachine } from '$lib/@xstate/svelte'
import type { getClientGameMachine } from '$lib/client/game-machine/configured'
import { getContext, setContext } from 'svelte'

const KEY = {}

export type GameContext = {
  gameId: string
  userId: string
  hostUserId: string
  machine: ReturnType<typeof useMachine<ReturnType<typeof getClientGameMachine>>>
}

export const setGameContext = (context: GameContext) => {
  setContext<GameContext>(KEY, context)
}
export const getGameContext = () => getContext<GameContext>(KEY)
