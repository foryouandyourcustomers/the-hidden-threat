import { CHARACTERS, type CharacterId } from '../constants/characters'
import {
  isDefenderId,
  type Player,
  type PlayerId,
  type SharedGameContext,
  type Side,
} from '../types'

export const getPlayer = (playerId: PlayerId, context: SharedGameContext): Player => {
  if (isDefenderId(playerId)) {
    const player = context.defense.defenders.find((player) => player.id === playerId)
    if (!player) throw new Error(`Player ${playerId} not found in context`)
    return player
  } else {
    return context.attack.attacker
  }
}

export const getPlayerSide = (playerId: PlayerId): Side =>
  isDefenderId(playerId) ? 'defense' : 'attack'

export const getCharacter = (characterId: CharacterId) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  CHARACTERS.find((character) => character.id === characterId)!
