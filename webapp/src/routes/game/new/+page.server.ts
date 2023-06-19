import { createGame } from '$lib/server/game'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
  acceptedTos: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzerklärung & Nutzungsbedingungen akzeptieren.' }),
  }),
  over18: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte das Alter bestätigen.' }),
  }),
  gameName: z.string().min(3).max(30).optional(),
  userName: z.string().min(3).max(10),
})

export const load = async () => {
  const form = await superValidate(schema)

  return { form }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, schema)

    const userId = cookies.get('userId')

    if (!userId) {
      throw error(500, 'No userId was found')
    }

    if (!form.valid) {
      return fail(400, { form })
    }

    const { id } = createGame({
      host: { id: userId, name: form.data.userName, isConnected: false },
      name: form.data.gameName,
    })

    throw redirect(303, `/game/${id}`)
  },
}
