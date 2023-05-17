import { createGame } from '$lib/server/game'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
  gameName: z.string().min(3).max(30).optional(),
  playerName: z.string().min(3).max(30),
})

export const load = async () => {
  const form = await superValidate(schema)

  return { form }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, schema)

    const playerId = cookies.get('playerId')

    if (!playerId) {
      throw error(500, 'No playerId was found')
    }

    if (!form.valid) {
      return fail(400, { form })
    }

    const { id } = createGame({
      host: { id: playerId, name: form.data.playerName, isConnected: false },
      name: form.data.gameName,
    })

    throw redirect(303, `/game/${id}`)
  },
}
