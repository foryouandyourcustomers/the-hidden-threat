import type { ServerMessage, SharedGameContext, Side } from '$lib/game/types'
import type { Sound } from '$lib/sound'

export type Context = SharedGameContext & {
  userId: string
}

export type ClientEvent =
  // All messages that the server sends can be used as client events
  | ServerMessage
  | {
      type: 'assign side'
      otherUserId: string
      side: Side
    }
  | {
      type: 'assign admin'
      otherUserId: string
      isAdmin: boolean
    }
  | { type: 'admin starts game' }
  | { type: 'user sends emoji'; emoji: string }

export type ClientEventOf<Type extends ClientEvent['type']> = Extract<ClientEvent, { type: Type }>

export type Actions = {
  playSound: (sound: Sound) => void
  showEmoji: (args: { emoji: string; userId: string }) => void
}
