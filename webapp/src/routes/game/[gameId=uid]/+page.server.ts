import { getGame } from '$lib/server/game/global'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params, parent }) => {
  const { userId, gameId } = await parent()

  const game = getGame(gameId)!

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
