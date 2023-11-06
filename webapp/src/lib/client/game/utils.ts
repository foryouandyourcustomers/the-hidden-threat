import type { SharedGameContext } from '$lib/game/types'
import type { Context } from '../game-machine/types'

export const getSharedGameContext = (context: Context): SharedGameContext => {
  const { userId: _, ...sharedGameContext } = context
  return sharedGameContext
}
