import { createMachine } from 'xstate'
import type { Context, ServerEvent, User } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAK6y4AEAxgPYB2tYlALpANoAMAuoqAA7WwAlk0F0eIAJ6IAtAEYA7AFYANCAAeiWYsUAmAHTzZADh27ZATh0AWeUYDMAXwerUGbPiKkKORnQbM2LnF+IRExJEkZBRV1TW19QxMzSxt7Jxd0LFwCHBIyHHIIQVgaekYWCA5uCJDhUVpxKQQ5JVUNBC1dA2NTHQtrW0dnEFcsj1yyWghyMDRqACtBKuCBOvDQdtktPS1zRSNzWTsrE-kANjtVJrPZA3M7e6MrIyN2dh0n9JHM9xy9ADlqExyLAmCgcBU8hR5tRBAxKkEaqswg0Iu0dGcrDsHhYrOZXnZ5FZ2FYrohFOYznp2HZ2JYzuY8XstF9Rr9cACgSCwRDIHoAIKwIRQWhwqDkLw4WCEZZI0L1cTtQl2PQ3diKLaU2SYoxnMkIKwa6kYhRGRRWBk2eRDDJubIcwHA0Hgip6ABKYBQEAk5CY1G5LsIAAsBE6eUxYORRrK+MiFWjELYseYU09ZHinmcdPqrBi9ObKXZjFs7HYzmcnMNaNQIHBxGz7TgVvL1rEEGWduZ2CYlEdS2dFJdIggBnoMYpzs9FAPZOPWT9G5ywy7IM21qiNognp3uzpe6Wy4P9WX9O8s+wjrJ1To3lZ53bxkuA7yIAKhYIRWKJfl4HL14rNDsfQLF3fd+yPYcTnMfMTQ1GwJyOCthgbR9HWfV0PS9H0-XQtcUQAhAJyxdN2HPbUbguWQczxGCbiA9h5DeRJ7zGP4AHFMnITBw1XP98ITDo3nYbokj6FJBmPY4DAHIkL1LQtrRY9kcD0DiMC4njXwASVFEQUAAGzw+NN0E54RN6fpUiHJoLWg8dDHeUxzHkDF5ErBwgA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: User } }) => ({
    gameId: input.gameId,
    hostUserId: input.host.id,
    // TODO: this should get popullated with players
    players: [],
    users: [input.host],
  }),

  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {} as Context,
    events: {} as ServerEvent,
    actors: {} as { loadParticipants: { output: string[] } },
  },

  initial: 'Not started',

  states: {
    'Not started': {
      initial: 'Assigning users',

      states: {
        'Assigning users': {
          always: [
            {
              target: 'Ready to start',
              guard: 'gameIsReadyToStart',
            },
          ],
        },
        'Ready to start': {
          on: {
            'host starts game': {
              actions: 'consoleLogValue',
              target: '#gameServer.Game Started',
            },
          },
        },
      },

      on: {
        // {

        'user joined': {
          actions: ['storeNewUser', 'sendUsersUpdate'],
          target: 'Not started',
        },
      },
    },

    'Game Started': {
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

  on: {
    'user connected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'user reconnected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'user disconnected': {
      actions: ['updateUserConnectionState', 'sendUsersUpdate'],
      target: '#gameServer',
    },

    'send emoji': {
      target: '#gameServer',
      actions: 'sendEmojiToOtherUsers',
    },
  },
})
