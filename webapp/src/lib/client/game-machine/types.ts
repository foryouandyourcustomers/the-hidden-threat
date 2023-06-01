import type { BasePlayer, ServerMessage } from '$lib/game/types'
import type { Sound } from '$lib/sound'

export type Context = {
  gameId: string
  playerId: string
  hostPlayerId: string
  players: Player[]
}

export type Player = BasePlayer

export type ClientEvent =
  // All messages that the server sends can be used as client events
  ServerMessage | { type: 'user starts game' } | { type: 'player sends emoji'; emoji: string }

export type ClientEventOf<Type extends ClientEvent['type']> = Extract<ClientEvent, { type: Type }>

export type Actions = {
  playSound: (sound: Sound) => void
  showEmoji: (args: { emoji: string; playerId: string }) => void
}
