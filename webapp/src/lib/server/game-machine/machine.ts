import { createMachine } from 'xstate'
import type { Context, ServerEvent, ServerUser } from './types'

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAxAK6y4AEAxgPYB2tYlALpANoAMAuoqAA7WwAlk0F0eIAJ6IAtAEYA7AFYANCAAeiWYsUAmAHTzZADh27ZATh0AWeUYDMAXwerUGbPiKkKORnQbM2LnF+IRExJEkZBRV1TW19QxMzSxt7Jxd0LFwCHBIyHHIIQVgaekYWCA5uCJDhUVpxKQQ5JVUNBC1dA2NTHQtrW0dnEFcsj1yyWghyMDRqACtBKuCBOvDQdtktPS1zRSNzWTsrE-kANjtVJrPZA3M7e6MrIyN2dh0n9JHM9xy9ADlqExyLAmCgcBU8hR5tRBAxKkEaqswg0Iu0dGcrDsHhYrOZXnZ5FZ2FYrohFOYznp2HZ2JYzuY8XstF9Rr9cACgSCwRDIIQAKIEWjAnTLJGheriTYnbGHRn4mlEklkhCKM7sakYvrvWQ3bRGVk-bIcwHA0Hgip6ACCsCEUFocKg5C8OFghDFfGRkrRiEJdj0dgU8hJ9neZyMupVVkUt3MdLsOgxdjOSjOZ0NbmNOE5Zp5loASmAUBAJOQmNRuRbCAALAS5i2wcijD0gWooqWIWxY8w9p6yPFPM46KMYvSKPEXYxbOzJ9PDNlZnOV3kQQgAVXy5AA7oIcNMwMKAGa4YUttvejbk9jyHYnC46d7mJR9S6RVWWPSMmfRhnadi6pxhloagIDgcQF3GFYJXWWIEDsRQ9AOV4HzsCM9nVM4VQGPQMUUYNTDw1IjHkDMxj+U1lwqKC1lRS8EHsRCFRQtC1XYTC32TfQ40sc5Q3HElSPZbMKPNFdrVtQR7UdZ18ngcUaI7DpA0Y5CaRYjCo0UDViUsPY1XiUxBMXES80gPRC2LUty0o6j2x9VV5H9J5bCOGlUgxTTtLpHRzl2F5ryM8Y9AAcUychMFMiBbIvWDZDeDVEl6fpUlfJpvwMM48NQ2wPnkONFECv5QowcLIr0ABJB0RBQAAbaKYM2ENuiSPoUkGKMGRwzLDHeUwnwxEjAKAA */

  id: 'gameServer',

  context: ({ input }: { input: { gameId: string; host: ServerUser } }) => ({
    gameId: input.gameId,
    hostUserId: input.host.id,
    // TODO: this should get popullated with players
    players: [],
    users: [input.host],
    actions: [],
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
