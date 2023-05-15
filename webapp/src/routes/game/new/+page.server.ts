import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms/server'

const schema = z.object({
  name: z.string().min(3).max(20).optional(),
})

export const load = async () => {
  // Server API:
  const form = await superValidate(schema)

  // Always return { form } in load and form actions.
  return { form }
}

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, schema)

    if (!form.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { form })
    }

    const uuid = crypto.randomUUID()
    throw redirect(303, `/game/${uuid}`)
  },
}
