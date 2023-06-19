import { getGame } from '$lib/server/game/global.js'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
  const gameId = params.gameId
  const game = getGame(gameId)

  if (!game) {
    throw error(404, 'Game not found')
  }

  return {
    gameId,
    name: game.name,
  }
}
