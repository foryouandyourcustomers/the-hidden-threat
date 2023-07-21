import { createGameSchema } from '$lib/client/forms'
import { createGame } from '$lib/server/game'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export const load = async () => {
  const form = await superValidate(createGameSchema)

  return { form }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, createGameSchema)

    const userId = cookies.get('userId')

    if (!userId) {
      throw error(500, 'No userId was found')
    }

    if (!form.valid) {
      return fail(400, { form })
    }

    const { id } = createGame({
      host: {
        id: userId,
        name: form.data.userName,
        isAdmin: true,
        isConnected: false,
        side: 'defender',
      },
    })

    throw redirect(303, `/game/${id}`)
  },
}
