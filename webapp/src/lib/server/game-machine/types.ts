import type { GameAction, Character, User, ClientMessage } from '$lib/game/types'

export type Context = {
  gameId: string
  hostUserId: string
  characters: Character[]
  users: User[]
  actions: ServerGameAction[]
}

export type ServerGameAction = GameAction

export type ServerEvent =
  // All messages that the server sends can be used as client events
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
