import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGEA2BLMAdgC4DEArrGAE6wAEZADhCkWANoAMAuoqAwPaxcRXPwK8QAD0QBGAGwyA7ADoOAVgBMchQBYdagMxqANCACeiALQG5ygxpmaD9gJzaORgL6fTqDDnxickoqWkoCCDowNH4AK1xOHiQQASERMQlpBHkZAA5lOUU5XIMXRxdDF1MLBBtbGRdFDmadVzkDGW9fdCw8QlJYAAt+AHdaaLiE7glU4VFxZKzHFRkddqL7DiaNLerERQdlDTW5NTUOfU0OTp8QP17AomUASQI5lGwSRJnBOYzFxC5GQFdR5LRKLStEzmWQuDh2XIlFwVRRqHQcXIuXJdO49AL9F5vEQfL4yJJ8X7pBagLJaZQueyODpONYXOR7WpA5QNRS5RQNNR8rYGHH3fHEQnvT5sDTklKU+aZRA6DQGAoGRQMzWKA6rdkwhCGDRHQrOS6o4oaUV4voSgAy-AARo6zCQUBA0LgCGEiCgqEQ6PdvslZlSlQgXMc7Mi4R1FB0XDoOTIOMaU0DVnC5Km1lbbmLbU8Hc6zMoAIJ0d2eghu2BCKDeoQQdjTEMK-405WNZTnOTowU6OEqpMGjRj7mnBQ2RQ6XL6ZHW-yF5TFl2S4nS1sUtKKgEIdHwnmJpmaXIaRTJwdHDpAuOowUMxcPAmr0uvKWkuWh3ed2pqYFYqUZ4eBwFTntCNRGGqiJ5EYGiCqBaxPuKRZOmuFa0FWXq1vW3pYQQwbbn81JSPs56qEYfaRnIDJnjIHJjmmk4cH2xyRucOjeLcBD8M28DJAWjw-DuHakQglgHMoZ4aLk7QYgYGJ5PRBqWORWhApiKanBqGLIcu74bsJxHhqpOhSWOskKSUim5CxyaIlJiI6KsvIzjYGp6Y8hL3EZYZ7jIjhmTqBgnLkajZnyHJnvSM4BYYHQBXOnkEq89zrrgHy+T+YkyDsxrBaF4UYheo5KMoOixXkLGphcjTJfaaE1ERfm-jstjhUYia2XCY5FBy2bXlVfJ8rlsl5t0S5ea+5aVh6XpZaJWQKMCegsX2tUeCONQuco8ZKaUCn8poaj1ahJYzbQDDYCgZjUAtJFZE4qgHK5jT8nyW2IEYwLtFVcjnkojQ3BNz4NedBkZdg93hvBZkdWoXWgam576jU575G454yYimoaBUp3KAAYl6uBDJA0N7h0CIHgFEIjXZBr-u1xzrGc-0Mnm3hAA */

  id: 'gameClient',

  context: ({ input }) => ({
    gameId: input.gameId,
    userId: input.userId,
    hostUserId: input.hostUserId,
    users: [],
    characters: [],
    actions: [],
  }),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ClientEvent,
    actors: {} as { loadParticipants: { output: Promise<string[]> } },
  },

  initial: 'Initial',

  states: {
    Initial: {
      always: [
        {
          target: 'Lobby',
          guard: 'gameNotStarted',
        },
        {
          target: 'Finished',
          guard: 'gameFinished',
        },
        {
          target: 'Ingame',
        },
      ],
    },

    Ingame: {
      entry: ['consoleLogValueAgain'],

      states: {
        Initial: {},
      },

      initial: 'Initial',
    },

    Lobby: {
      states: {
        'As admin': {
          on: {
            'assign side': {
              target: 'As admin',
              actions: 'forwardToServer',
            },

            'assign admin': {
              target: 'As admin',
              actions: 'forwardToServer',
            },
          },
        },
        'As player': {},
        Initial: {
          always: [
            {
              target: 'As admin',
              guard: 'isAdmin',
            },
            'As player',
          ],
        },
      },

      initial: 'Initial',

      on: {
        'admin starts game': {
          actions: 'consoleLogValue',
          target: 'Ingame',
        },
      },
    },

    Finished: {},
  },

  on: {
    'users update': {
      target: '#gameClient',
      actions: 'updateUsers',
    },

    'user sends emoji': {
      target: '#gameClient',
      actions: 'sendEmoji',
    },

    'show emoji': {
      target: '#gameClient',
      actions: 'showEmoji',
    },
  },
})
