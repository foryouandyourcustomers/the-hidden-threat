import type { Context } from '$lib/client/game-machine/types'
import { getSharedGameContext } from '$lib/game/utils'
import { getGame } from '$lib/server/game/global'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ params, parent, locals }) => {
  const { userId } = await parent()

  const game = getGame(locals)

  const snapshot = game.machine.getSnapshot()

  if (!snapshot.context.users.find((user) => user.id === userId)) {
    if (snapshot.can({ type: 'user joined', userId, userName: '' })) {
      throw redirect(303, `/game/${params.gameId}/join`)
    } else {
      throw error(403, 'This game already started.')
    }
  }

  const sharedGameContext = getSharedGameContext(snapshot.context)

  return {
    machineInput: {
      userId,
      ...sharedGameContext,
    } satisfies Context,
  }
}
