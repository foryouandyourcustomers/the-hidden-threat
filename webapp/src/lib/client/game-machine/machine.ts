import { createMachine } from 'xstate'
import type { ClientEvent, Context } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGEA2BLMAdgC4DEArrGAE6wAEZADhCkWANoAMAuoqAwPaxcRXPwK8QAD0QBGAGwyA7ADoOAVgBMchQBYdagMxqANCACeiALQG5ygxpmaD9gJzaORgL6fTqDDnxickoqWkoCCDowNH4AK1xOHiQQASERMQlpBHkZAA5lOUU5XIMXRxdDF1MLBBtbGRdFDmadVzkDGW9fdCw8QlJYAAt+AHdaaLiE7glU4VFxZKzHFRkddqL7DiaNLerERQdlDTW5NTUOfU0OTp8QP17AomUASQI5lGwSRJnBOYzFxC5GQFdR5LRKLStEzmWQuDh2XIlFwVRRqHQcXIuXJdO49AL9F5vEQfL4yJJ8X7pBagLJaZQueyODpONYXOR7WpA5QNRS5RQNNR8rYGHH3fHEQnvT5sDTklKU+aZRA6DQGAoGRQMzWKA6rdkwhCGDRHQrOS6o4oaUV4voSgAy-AARo6zCQUBA0LgCGEiCgqEQ6PdvslZlSlQgXMc7Mi4R1FB0XDoOTIOMaU0DVnC5Km1lbbmLbU8Hc6zJLidLpiGFf8acrmtzGommZpchpFMmdC4jh0gXHUYKGdb-IXlMWXWXcCS2GSfmlFQDampgVjSq2PBwKm3oTUjGrEXkjBpBRu1kOHgSx6WAIJ0d2eghu2BCKDeoQQdiVilzmtSRByHT5AYOg8joOoODIMgGByDhqhosZ5ABrTIiKOIEPw77wMkBaPLOfzUr+CCWAcyithouTtBiBgYnkMgcpYbYmkCajIqBG65FsihnuKTyvFKuFhgu9E6CRGhkRRJTUex+o1Hk+SIrkwGgXyrTrFxI6vPc-HzrW2SOMJOpAdouRqNmfIcq29KKMBZGpsiciqjoamPIS9wTh8Wk-ksOzGgZJzGaZ7YGg4KigcBeQcNmOydpx+Y2s5l4efhtIRcoJlGIm7FwqJRQctm3ZgnIZSiTYBxOReTrjjetB3l6iXhgowJ6BF-4XLGSYGqsKjxjRpRUfymhqGV9oVdedAMNgKBmNQdULk4qgHLy2r8spHJGMC7ThfZ-Lajc3TDvFI1udgM06UewlpcxAEbqmbbSYgbb5G4bZkYimpwYNsX7QSABiXq4EMkAnQRHQIui1wQQcfIpndhryKlxzrGc9kMnm3hAA */

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
