import { error } from '@sveltejs/kit'
import type { Game } from './types'

const GLOBAL_GAMES_KEY = Symbol.for('game.games')

const getGames = (): { [key: string]: Game } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let games = (globalThis as any)[GLOBAL_GAMES_KEY]
  if (!games) {
    games = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any)[GLOBAL_GAMES_KEY] = games
  }
  return games
}

export const addGame = (game: Game) => {
  const games = getGames()
  games[game.id] = game
}

export function getGame(gameId: string): Game | undefined
export function getGame(locals: App.Locals): Game

export function getGame(gameIdOrLocals: string | App.Locals): Game | undefined {
  return typeof gameIdOrLocals === 'string'
    ? findGame(gameIdOrLocals)
    : getGameFromLocals(gameIdOrLocals)
}

const findGame = (gameId: string): Game | undefined => getGames()[gameId]
const getGameFromLocals = (locals: App.Locals): Game => {
  const game = locals.game
  if (!game) throw error(500, 'No game found in locals')
  return game
}
