import type { Attacker, Defender, DefenderId } from '$lib/game/types'
import type { Context } from './types'

export const getUserIndex = (context: Context, userId: string): number | undefined => {
  const index = context.users.findIndex((user) => user.id === userId)
  return index === -1 ? undefined : index
}

export const getDefender = (context: Context, id: DefenderId): Defender => {
  const defender = context.defense.defenders[id]
  if (!defender) throw new Error(`There is no defender with id ${id}`)
  return defender
}

export const getAttacker = (context: Context): Attacker => {
  const attacker = context.attack.attacker
  if (!attacker) throw new Error(`There is no attacker`)
  return attacker
}
