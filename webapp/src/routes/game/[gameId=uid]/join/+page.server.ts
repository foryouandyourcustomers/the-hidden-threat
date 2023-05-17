import { getGame } from '$lib/server/game/global'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { z } from 'zod'

const schema = z.object({
  playerName: z.string().min(3).max(30),
})

export const load = async () => {
  const form = await superValidate(schema)

  return { form }
}

export const actions = {
  default: async ({ request, cookies, params }) => {
    const form = await superValidate(request, schema)

    const playerId = cookies.get('playerId')
    const gameId = params.gameId
    const game = getGame(gameId)

    if (!playerId) {
      throw error(500, 'No playerId was found')
    }
    if (!game) {
      throw error(500, 'Invalid gameId')
    }
    if (!form.valid) {
      return fail(400, { form })
    }

    game.machine.send({
      type: 'player joined',
      playerId: playerId,
      playerName: form.data.playerName ?? 'Unnamed',
    })

    throw redirect(303, `/game/${gameId}`)
  },
}
