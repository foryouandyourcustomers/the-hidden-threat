import type { Game } from './types'

const GLOBAL_GAMES_KEY = Symbol.for('game.games')

const getGames = (): { [key: string]: Game } => {
  let games = (globalThis as any)[GLOBAL_GAMES_KEY]
  if (!games) {
    games = {}
    ;(globalThis as any)[GLOBAL_GAMES_KEY] = games
  }
  return games
}

export const addGame = (game: Game) => {
  const games = getGames()
  games[game.id] = game
}

export const getGame = (gameId: string): Game | undefined => {
  const games = getGames()
  return games[gameId]
}
