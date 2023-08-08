import type { ClientMessage, GameEvent, SharedGameContext } from '$lib/game/types'

export type Context = SharedGameContext

export type ServerGameAction = GameEvent

export type ServerEvent =
  // All messages that the client sends can be used as server events
  | (ClientMessage & { userId: string })
  | { type: 'user connected'; userId: string }
  /**
   * When the user has an existing connection but reconnects (maybe with
   * another client)
   */
  | { type: 'user reconnected'; userId: string }
  | { type: 'user disconnected'; userId: string }
  | { type: 'user joined'; userId: string; userName: string }

export type ServerEventOf<Type extends ServerEvent['type']> = Extract<ServerEvent, { type: Type }>
