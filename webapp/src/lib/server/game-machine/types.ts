import type { BasePlayer, ClientMessage } from '$lib/game/types'

export type Context = {
  gameId: string
  hostPlayerId: string
  players: Player[]
}

export type Player = BasePlayer

export type ServerEvent =
  // All messages that the server sends can be used as client events
  | (ClientMessage & { playerId: string })
  | { type: 'player connected'; playerId: string }
  /**
   * When the player has an existing connection but reconnects (maybe with
   * another client)
   */
  | { type: 'player reconnected'; playerId: string }
  | { type: 'player disconnected'; playerId: string }
  | { type: 'player joined'; playerId: string; playerName: string }
  | { type: 'host starts game'; value: string }

export type ServerEventOf<Type extends ServerEvent['type']> = Extract<ServerEvent, { type: Type }>
