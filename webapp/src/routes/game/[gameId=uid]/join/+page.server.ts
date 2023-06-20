import { joinGameSchema } from '$lib/client/forms.js'
import { getGame } from '$lib/server/game/global'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export const load = async () => {
  const form = await superValidate(joinGameSchema)
  return { form }
}

export const actions = {
  default: async ({ request, cookies, params, locals }) => {
    const form = await superValidate(request, joinGameSchema)

    const userId = cookies.get('userId')
    const gameId = params.gameId
    const game = getGame(locals)

    if (!userId) {
      throw error(500, 'No userId was found')
    }
    if (!form.valid) {
      return fail(400, { form })
    }

    game.machine.send({
      type: 'user joined',
      userId: userId,
      userName: form.data.userName,
    })

    throw redirect(303, `/game/${gameId}`)
  },
}
