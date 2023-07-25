import type { User } from '$lib/game/types'
import type { Context } from './types'

/** Returns the user that is currently running the client machine. */
export const getUser = (context: Context): User => {
  const user = context.users.find((user) => user.id === context.userId)
  if (!user) throw new Error(`The current user was not found in the users list.`)
  return user
}
