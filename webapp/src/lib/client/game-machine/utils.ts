import type { User } from '$lib/game/types'
import { getUser } from '$lib/game/utils/user'
import type { Context } from './types'

/** Returns the user that is currently running the client machine. */
export const getCurrentUser = (context: Context): User => getUser(context.userId, context)
