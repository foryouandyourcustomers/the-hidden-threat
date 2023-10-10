import { z, type ZodRawShape } from 'zod'

const createAndJoinGameSchema = {
  acceptedTos: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'Bitte Datenschutzerklärung & Nutzungsbedingungen akzeptieren.' }),
  }),
  userName: z.string().min(3).max(20),
} satisfies ZodRawShape

export const createGameSchema = z.object({
  ...createAndJoinGameSchema,
})

export const joinGameSchema = z.object({
  ...createAndJoinGameSchema,
})

export type CreateGameSchema = typeof createGameSchema
export type JoinGameSchema = typeof joinGameSchema
