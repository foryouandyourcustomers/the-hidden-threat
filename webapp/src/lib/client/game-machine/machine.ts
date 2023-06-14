import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGEA2BLMAdgC4DEADtigJ5gBOsABAK5kQpFgDaADALqKgyAe1i4iuIQQEgAHogCsAZgB0AdkXcAjPICcigGwAWQ9x07NAGhBVE+nQA5lAJn33D9+bo2n9AX19WqBg4+MTklDS0DLCEEIxgaEIAVrg8-EggwqLiktJyCE72qso6hqr29qVO7vaKlta2Ds6u7p563D7+gehYeISksAAWQgDuDAnJqXzSWWISUhn58qryyh5ainp6m5qGVjYIdjrKhoWa5qpGqk51XSBBvaFEygCSBHMo2CRpMyJzuYtEPZNMp9Nx5Jp7C5NNcjIp5PtEOduMpFBVNjplvITJV7HcHiF+q93uJPt9NOlBH8cgtQPkXCVFE5tHV5DdDGCOYiEGiQedyqpzvIitx1PieoTiMSPl9OE5KZlqfM8ohTip9IpVHotaprrt9NylE5mupFIZPCtXE5xcE+lKADJCABGTqoJCYMSisCIKFoREYDx+GVmNJVhyUymWrVq12uTlU3M0phK5zMwMM8OjNseRMdLqo0tJsumwaVALpiHh6s2Zt1HkK8cThmOy1KdlOK2FemzkueeddhdwZM4FN+2WVgJ54JOTiUFUKpjZK25mecTlK5nk3Hspg5-gCIAIQggcGkBLtRDH-1pskQAFprmsnIUNduNMDgdy7wZlNvtAudH0MEdR7C9B0+K9Q0nO9qifF933fSFuANBoEEhRwKjcXYBQzDVVFAp5iQeSCJwrBAKhRco2jRZCyk0RRDRBTZLkzXRMWbfCD3PQi3gecDsBI8tbwQHRCjUDwvB3K56MTDw1lOTFuHhS47AI3NnVdQSb3pZDIw1XR3FMbhn0ubkwUjWo6g6NVLlONSHQ0gsAEFGGGb0tLDLcUUsspShMbCEVQ3ZHGQ2dZ2k+MinsvtHOUFyGAoag6A8ycymNCEPFqMoWgqQKDlnY5NBaAxYUqflouUfsCzeGUUrI2dDD0+FSh3HRjPjFD8vKEp9HjQoKi1dd5AqgAxXB3iGSA6uEupUTcDpNEW64iiTTqFCKyNqjwzxer0a19yAA */

  id: 'gameClient',

  context: ({ input }) => ({
    gameId: input.gameId,
    userId: input.userId,
    hostUserId: input.hostUserId,
    users: [],
    players: [],
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
        Initial: {
          invoke: {
            src: 'loadParticipants',
          },
        },
      },

      initial: 'Initial',
    },

    Lobby: {
      on: {
        'user starts game': {
          actions: 'consoleLogValue',
          target: 'Ingame',
        },
      },

      states: {
        'As host': {},
        'As player': {},
        Initial: {
          always: [
            {
              target: 'As host',
              guard: 'isHost',
            },
            'As player',
          ],
        },
      },

      initial: 'Initial',
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
