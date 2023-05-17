export type Context = {
  gameId: string
  hostPlayerId: string
  players: Player[]
}

export type Player = {
  id: string
  name: string
  isConnected: boolean
}

export type ServerEvent =
  | { type: 'player connected'; playerId: string }
  | { type: 'player disconnected'; playerId: string }
  | { type: 'player joined'; playerId: string; playerName: string }
  | { type: 'host starts game'; value: string }

export type ServerEventOf<Type extends ServerEvent['type']> = Extract<ServerEvent, { type: Type }>
