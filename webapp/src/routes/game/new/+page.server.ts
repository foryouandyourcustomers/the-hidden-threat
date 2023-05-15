import { redirect } from '@sveltejs/kit'

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    console.log(formData.get('name')?.toString())
    const uuid = crypto.randomUUID()
    throw redirect(303, `/game/${uuid}`)
  },
}
