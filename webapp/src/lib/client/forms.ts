import { z, type ZodRawShape } from 'zod'

const createAndJoinGameSchema = {
  acceptedTos: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzerklärung & Nutzungsbedingungen akzeptieren.' }),
  }),
  over18: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte das Alter bestätigen.' }),
  }),
  userName: z.string().min(3).max(10),
} satisfies ZodRawShape

export const createGameSchema = z.object({
  ...createAndJoinGameSchema,
  gameName: z.string().min(3).max(30).optional(),
})

export const joinGameSchema = z.object({
  ...createAndJoinGameSchema,
})
