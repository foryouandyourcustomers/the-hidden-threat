import type { Context } from './types'

export const getUserIndex = (context: Context, userId: string): number | undefined => {
  const index = context.users.findIndex((user) => user.id === userId)
  return index === -1 ? undefined : index
}
