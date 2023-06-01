import type { UseMachineReturn } from '$lib/@xstate/svelte/useMachine'
import type { getClientGameMachine } from '$lib/client/game-machine/configured'
import { getContext, setContext } from 'svelte'

const KEY = {}

export type GameContext = {
  gameId: string
  playerId: string
  hostPlayerId: string
  machine: UseMachineReturn<ReturnType<typeof getClientGameMachine>>
}

export const setGameContext = (context: GameContext) => {
  setContext<GameContext>(KEY, context)
}
export const getGameContext = () => getContext<GameContext>(KEY)
