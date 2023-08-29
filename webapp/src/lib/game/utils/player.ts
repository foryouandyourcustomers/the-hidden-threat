import { isDefenderId, type Player, type PlayerId, type SharedGameContext } from '../types'

export const getPlayer = (playerId: PlayerId, context: SharedGameContext): Player => {
  if (isDefenderId(playerId)) {
    const player = context.defense.defenders.find((player) => player.id === playerId)
    if (!player) throw new Error(`Player ${playerId} not found in context`)
    return player
  } else {
    return context.attack.attacker
  }
}
