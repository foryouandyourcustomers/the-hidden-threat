import { getGame } from '$lib/logic/game/global.js'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ params, parent }) => {
  const gameId = params.gameId
  const game = getGame(gameId)

  if (!game) {
    throw error(404, 'Game not found')
  }

  const { playerId } = await parent()
  const snapshot = game.machine.getSnapshot()

  if (!snapshot.context.players.find((player) => player.id === playerId)) {
    throw redirect(303, `/game/${params.gameId}/join`)
  }

  return {
    gameId,
    name: game.name,
  }
}
