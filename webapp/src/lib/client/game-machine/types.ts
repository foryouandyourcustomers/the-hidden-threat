import type { BasePlayer, BaseUser, ServerMessage } from '$lib/game/types'
import type { Sound } from '$lib/sound'

export type Context = {
  gameId: string
  userId: string
  hostUserId: string
  users: User[]
  players: Player[]
}

export type Player = BasePlayer
export type User = BaseUser

export type ClientEvent =
  // All messages that the server sends can be used as client events
  ServerMessage | { type: 'user starts game' } | { type: 'user sends emoji'; emoji: string }

export type ClientEventOf<Type extends ClientEvent['type']> = Extract<ClientEvent, { type: Type }>

export type Actions = {
  playSound: (sound: Sound) => void
  showEmoji: (args: { emoji: string; userId: string }) => void
}
