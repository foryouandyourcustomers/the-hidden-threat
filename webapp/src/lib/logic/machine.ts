import { createMachine } from 'xstate'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgEl9cAXXdAGwGIBXWMAJwGUr02rYBxdKjABtAAwBdRKAAOAe1jVcc-NJAAPRAFoATCQCcARgAcANh0AWQwHZj1sRZ1HrAGhABPRGJJjjNu4aGAKwO1qZiYjYAvjFu+HIQcGpoWHiERGryijQqapoIWiEGJuZWtvaO+m6eBYYAzBYk1vqRhqZhOnVB+uaxICk4BMTklDT0mQpKuUgaiI7ViIYOBn5hYUEWVsb6QX0DacMUUEJgE9nKqjP5dXXexjdBDZZi1jo6pqYLBRbWJLebdWMQTChn0DX0ewwg3SI2OwhGSnGMyyU0uoGuthI9y6TwsLzeHy+gTqJDaOx0hgsTyMdUMMRiQA */
  tsTypes: {} as import('./machine.typegen').Typegen0,
  schema: {
    context: {} as { value: string },
    events: {} as { type: 'userStartsGame'; value: string },
    services: {} as { loadParticipants: { data: string[] } },
  },
  initial: 'Initial',
  context: {
    value: 'initial',
  },
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
      entry: ['setValue', 'consoleLogValueAgain'],

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
  predictableActionArguments: true,
})
