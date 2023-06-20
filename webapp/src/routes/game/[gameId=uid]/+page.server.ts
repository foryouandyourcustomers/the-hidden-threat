import { getGame } from '$lib/server/game/global'
import { redirect } from '@sveltejs/kit'

export const load = async ({ params, parent, locals }) => {
  const { userId } = await parent()

  const game = getGame(locals)

  const snapshot = game.machine.getSnapshot()

  if (!snapshot.context.users.find((user) => user.id === userId)) {
    throw redirect(303, `/game/${params.gameId}/join`)
  }

  return {
    gameId: game.id,
    name: game.name,
    hostUserId: snapshot.context.hostUserId,
  }
}
