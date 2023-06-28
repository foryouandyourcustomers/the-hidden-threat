import { z, type ZodRawShape } from 'zod'

const createAndJoinGameSchema = {
  acceptedTos: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzerklärung & Nutzungsbedingungen akzeptieren.' }),
  }),
  userName: z.string().min(3).max(10),
} satisfies ZodRawShape

export const createGameSchema = z.object({
  ...createAndJoinGameSchema,
})

export const joinGameSchema = z.object({
  ...createAndJoinGameSchema,
})
