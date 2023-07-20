import { joinGameSchema } from '$lib/client/forms.js'
import { getGame } from '$lib/server/game/global'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export const load = async () => {
  const form = await superValidate(joinGameSchema)
  return { form }
}

export const actions = {
  default: async ({ request, cookies, params }) => {
    const form = await superValidate(request, joinGameSchema)

    const userId = cookies.get('userId')
    const gameId = params.gameId
    const game = getGame(gameId)

    if (!userId) {
      throw error(500, 'No userId was found')
    }
    if (!game) {
      throw error(500, 'Game was not found')
    }
    if (!form.valid) {
      return fail(400, { form })
    }

    if (!game.machine.getSnapshot().can({ type: 'user joined', userId, userName: '' })) {
      throw error(403, 'This game already started.')
    }

    game.machine.send({
      type: 'user joined',
      userId: userId,
      userName: form.data.userName,
    })

    throw redirect(303, `/game/${gameId}`)
  },
}
