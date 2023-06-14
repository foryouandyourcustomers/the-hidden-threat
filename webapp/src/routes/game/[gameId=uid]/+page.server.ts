import { getGame } from '$lib/server/game/global.js'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ params, parent }) => {
  const gameId = params.gameId
  const game = getGame(gameId)

  if (!game) {
    throw error(404, 'Game not found')
  }

  const { userId } = await parent()
  const snapshot = game.machine.getSnapshot()

  if (!snapshot.context.users.find((user) => user.id === userId)) {
    throw redirect(303, `/game/${params.gameId}/join`)
  }

  return {
    gameId,
    hostUserId: snapshot.context.hostUserId,
    name: game.name,
  }
}
