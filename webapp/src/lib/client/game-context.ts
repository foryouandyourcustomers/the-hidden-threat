import type { useMachine } from '$lib/@xstate/svelte'
import type { getClientGameMachine } from '$lib/client/game-machine/configured'
import type { Coordinate, User } from '$lib/game/types'
import { getContext, setContext } from 'svelte'
import type { Readable, Writable } from 'svelte/store'

const KEY = {}

export type GameContext = {
  gameId: string
  userId: string
  user: Readable<User>
  highlightedFields: Writable<{
    info: Coordinate[] | undefined
    attacker: Coordinate[] | undefined
  }>
  hostUserId: string
  machine: ReturnType<typeof useMachine<ReturnType<typeof getClientGameMachine>>>
}

export const setGameContext = (context: GameContext) => {
  setContext<GameContext>(KEY, context)
}
export const getGameContext = () => getContext<GameContext>(KEY)
