import { createMachine } from 'xstate'
import type { Context } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgEl9cAXXdAGwGIBXWMAJwGUr02rYBxdKjABtAAwBdRKAAOAe1jVcc-NJAAPRAFoATCQCcARgAcANh0AWQwHZj1sRZ1HrAGhABPRGJJjjNu4aGAKwO1qZiYjYAvjFu+HIQcGpoWHiERGryijQqapoIWiEGJuZWtvaO+m6eBYYAzBYk1vqRhqZhOnVB+uaxICk4BMTklDT0mQpKuUgaiI7ViIYOBn5hYUEWVsb6QX0DacMUUEJgE9nKqjP5dXXexjdBDZZi1jo6pqYLBRbWJLebdWMQTChn0DX0ewwg3SI2OwhGSnGMyyU0uoGuthI9y6TwsLzeHy+gTqJDaOx0hgsTyMdUMMRiQA */
  context: ({ input }) => ({
    gameId: input.gameId,
  }),
  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as { type: 'userStartsGame'; value: string },
    actors: {} as { loadParticipants: { output: Promise<string[]> } },
  },
  initial: 'Initial',
  states: {
    Initial: {
      on: {
        userStartsGame: {
          actions: 'consoleLogValue',
          target: 'Ingame',
        },
      },
    },

    Ingame: {
      entry: ['consoleLogValueAgain'],

      states: {
        Initial: {
          invoke: {
            src: 'loadParticipants',
          },
        },
      },

      initial: 'Initial',
    },
  },
})
