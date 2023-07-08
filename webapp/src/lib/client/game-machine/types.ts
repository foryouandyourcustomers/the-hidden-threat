import type { Player, User, ServerMessage, GameAction, PlayerSide } from '$lib/game/types'
import type { Sound } from '$lib/sound'

export type Context = {
  gameId: string
  userId: string
  hostUserId: string
  users: ClientUser[]
  players: ClientPlayer[]
  actions: ClientGameAction[]
}

export type ClientPlayer = Player
export type ClientUser = User
export type ClientGameAction = GameAction

export type ClientEvent =
  // All messages that the server sends can be used as client events
  | ServerMessage
  | {
      type: 'assign side'
      side: PlayerSide
      otherUserId: string
    }
  | { type: 'admin starts game' }
  | { type: 'user sends emoji'; emoji: string }

export type ClientEventOf<Type extends ClientEvent['type']> = Extract<ClientEvent, { type: Type }>

export type Actions = {
  playSound: (sound: Sound) => void
  showEmoji: (args: { emoji: string; userId: string }) => void
}
